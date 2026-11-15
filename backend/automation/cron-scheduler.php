<?php
require_once __DIR__ . '/content-generator.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/auth.php';

class CronScheduler {
    private $content_generator;
    private $db;
    private $lock_file;

    public function __construct() {
        $this->content_generator = new ContentGenerator();
        $this->db = getDB();
        $this->lock_file = __DIR__ . '/../logs/blog_automation.lock';
    }

    /**
     * Main cron job execution - runs every 6 hours
     */
    public function executeScheduledGeneration() {
        $start_time = microtime(true);
        $execution_id = uniqid('blog_gen_');
        
        Logger::info("Starting scheduled blog generation - Execution ID: {$execution_id}");

        try {
            // 1. Check if already running (prevent overlapping executions)
            if ($this->isAlreadyRunning()) {
                Logger::warning("Blog generation already in progress - skipping");
                return;
            }

            // 2. Create lock file
            $this->createLockFile($execution_id);

            // 3. Check if it's time to run (every 6 hours)
            if (!$this->shouldRun()) {
                Logger::info("Not yet time for next generation - skipping");
                $this->removeLockFile();
                return;
            }

            // 4. Generate blog posts
            $results = $this->content_generator->generateBlogPosts(1); // Generate 1 post per run

            // 5. Log execution results
            $execution_time = round(microtime(true) - $start_time, 2);
            $this->logExecution($execution_id, $results, $execution_time);

            // 6. Update last run time
            $this->updateLastRunTime();

            // 7. Cleanup old logs
            $this->cleanupOldLogs();

            Logger::info("Scheduled generation completed - Execution ID: {$execution_id}, Time: {$execution_time}s");

        } catch (Exception $e) {
            Logger::error("Critical error in scheduled generation: " . $e->getMessage());
            $this->logError($execution_id, $e->getMessage());
        } finally {
            // Always remove lock file
            $this->removeLockFile();
        }
    }

    /**
     * Check if blog generation is already running
     * @return bool
     */
    private function isAlreadyRunning() {
        if (!file_exists($this->lock_file)) {
            return false;
        }

        $lock_time = filemtime($this->lock_file);
        $max_execution_time = 3600; // 1 hour max

        // If lock file is older than max execution time, consider it stale
        if (time() - $lock_time > $max_execution_time) {
            Logger::warning("Removing stale lock file");
            unlink($this->lock_file);
            return false;
        }

        return true;
    }

    /**
     * Create lock file to prevent concurrent executions
     * @param string $execution_id
     */
    private function createLockFile($execution_id) {
        $lock_dir = dirname($this->lock_file);
        if (!is_dir($lock_dir)) {
            mkdir($lock_dir, 0755, true);
        }

        file_put_contents($this->lock_file, json_encode([
            'execution_id' => $execution_id,
            'start_time' => date('Y-m-d H:i:s'),
            'pid' => getmypid()
        ]));
    }

    /**
     * Remove lock file
     */
    private function removeLockFile() {
        if (file_exists($this->lock_file)) {
            unlink($this->lock_file);
        }
    }

    /**
     * Check if it's time to run (every 6 hours)
     * @return bool
     */
    private function shouldRun() {
        try {
            $query = "SELECT last_run_time FROM automation_schedule WHERE job_name = 'blog_generation' LIMIT 1";
            $result = $this->db->query($query);

            if (empty($result)) {
                // First run - create record
                $this->initializeScheduleRecord();
                return true;
            }

            $last_run = strtotime($result[0]['last_run_time']);
            $six_hours_ago = time() - (6 * 3600); // 6 hours in seconds

            return $last_run < $six_hours_ago;

        } catch (Exception $e) {
            Logger::error("Failed to check schedule: " . $e->getMessage());
            // If we can't check, err on the side of running
            return true;
        }
    }

    /**
     * Initialize schedule record
     */
    private function initializeScheduleRecord() {
        try {
            $query = "INSERT INTO automation_schedule (job_name, interval_hours, last_run_time, next_run_time, is_active, created_at) 
                     VALUES ('blog_generation', 6, NOW(), DATE_ADD(NOW(), INTERVAL 6 HOUR), 1, NOW())
                     ON DUPLICATE KEY UPDATE updated_at = NOW()";
            
            $this->db->execute($query);

        } catch (Exception $e) {
            Logger::error("Failed to initialize schedule record: " . $e->getMessage());
        }
    }

    /**
     * Update last run time
     */
    private function updateLastRunTime() {
        try {
            $query = "UPDATE automation_schedule 
                     SET last_run_time = NOW(), 
                         next_run_time = DATE_ADD(NOW(), INTERVAL 6 HOUR),
                         total_runs = total_runs + 1,
                         updated_at = NOW()
                     WHERE job_name = 'blog_generation'";
            
            $this->db->execute($query);

        } catch (Exception $e) {
            Logger::error("Failed to update last run time: " . $e->getMessage());
        }
    }

    /**
     * Log execution results
     * @param string $execution_id
     * @param array $results
     * @param float $execution_time
     */
    private function logExecution($execution_id, $results, $execution_time) {
        try {
            $log_data = [
                'execution_id' => $execution_id,
                'success_count' => $results['success'],
                'failed_count' => $results['failed'],
                'total_posts' => count($results['posts']),
                'execution_time_seconds' => $execution_time,
                'errors' => $results['errors'],
                'posts_generated' => $results['posts']
            ];

            $query = "INSERT INTO automation_execution_log 
                     (job_name, execution_id, status, results, execution_time, created_at) 
                     VALUES (?, ?, ?, ?, ?, NOW())";

            $status = $results['success'] > 0 ? 'success' : 
                     ($results['failed'] > 0 ? 'failed' : 'no_content');

            $this->db->execute($query, [
                'blog_generation',
                $execution_id,
                $status,
                json_encode($log_data),
                $execution_time
            ]);

            Logger::info("Execution logged - ID: {$execution_id}, Status: {$status}");

        } catch (Exception $e) {
            Logger::error("Failed to log execution: " . $e->getMessage());
        }
    }

    /**
     * Log execution error
     * @param string $execution_id
     * @param string $error_message
     */
    private function logError($execution_id, $error_message) {
        try {
            $query = "INSERT INTO automation_execution_log 
                     (job_name, execution_id, status, error_message, created_at) 
                     VALUES (?, ?, ?, ?, NOW())";

            $this->db->execute($query, [
                'blog_generation',
                $execution_id,
                'error',
                $error_message
            ]);

        } catch (Exception $e) {
            Logger::error("Failed to log error: " . $e->getMessage());
        }
    }

    /**
     * Cleanup old logs (keep last 30 days)
     */
    private function cleanupOldLogs() {
        try {
            // Cleanup execution logs
            $query = "DELETE FROM automation_execution_log WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)";
            $this->db->execute($query);

            // Cleanup AI generation logs
            $query = "DELETE FROM ai_generation_log WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)";
            $this->db->execute($query);

            // Cleanup used topics (keep 60 days to avoid duplicates)
            $query = "DELETE FROM ai_used_topics WHERE created_at < DATE_SUB(NOW(), INTERVAL 60 DAY)";
            $this->db->execute($query);

            Logger::info("Old logs cleaned up successfully");

        } catch (Exception $e) {
            Logger::warning("Failed to cleanup old logs: " . $e->getMessage());
        }
    }

    /**
     * Manual trigger for testing (bypasses schedule check)
     * @return array
     */
    public function manualTrigger() {
        $start_time = microtime(true);
        $execution_id = 'manual_' . uniqid();

        Logger::info("Manual blog generation triggered - Execution ID: {$execution_id}");

        try {
            if ($this->isAlreadyRunning()) {
                return [
                    'success' => false,
                    'error' => 'Blog generation already in progress'
                ];
            }

            $this->createLockFile($execution_id);
            
            $results = $this->content_generator->generateBlogPosts(1);
            
            $execution_time = round(microtime(true) - $start_time, 2);
            $this->logExecution($execution_id, $results, $execution_time);

            return [
                'success' => true,
                'execution_id' => $execution_id,
                'results' => $results,
                'execution_time' => $execution_time
            ];

        } catch (Exception $e) {
            Logger::error("Manual generation failed: " . $e->getMessage());
            $this->logError($execution_id, $e->getMessage());
            
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        } finally {
            $this->removeLockFile();
        }
    }

    /**
     * Get automation status
     * @return array
     */
    public function getAutomationStatus() {
        try {
            // Get schedule info
            $schedule_query = "SELECT * FROM automation_schedule WHERE job_name = 'blog_generation' LIMIT 1";
            $schedule = $this->db->query($schedule_query);

            // Get recent executions
            $executions_query = "SELECT * FROM automation_execution_log 
                                WHERE job_name = 'blog_generation' 
                                ORDER BY created_at DESC LIMIT 10";
            $recent_executions = $this->db->query($executions_query);

            // Check if currently running
            $is_running = $this->isAlreadyRunning();

            // Calculate next run time
            $next_run = null;
            if (!empty($schedule)) {
                $last_run = strtotime($schedule[0]['last_run_time']);
                $next_run = date('Y-m-d H:i:s', $last_run + (6 * 3600));
            }

            return [
                'is_running' => $is_running,
                'schedule' => $schedule[0] ?? null,
                'next_run_time' => $next_run,
                'recent_executions' => $recent_executions,
                'should_run_now' => $this->shouldRun()
            ];

        } catch (Exception $e) {
            Logger::error("Failed to get automation status: " . $e->getMessage());
            return ['error' => $e->getMessage()];
        }
    }

    /**
     * Enable/disable automation
     * @param bool $enabled
     * @return bool
     */
    public function setAutomationEnabled($enabled) {
        try {
            $query = "UPDATE automation_schedule 
                     SET is_active = ?, updated_at = NOW() 
                     WHERE job_name = 'blog_generation'";
            
            $this->db->execute($query, [$enabled ? 1 : 0]);
            
            Logger::info("Automation " . ($enabled ? 'enabled' : 'disabled'));
            return true;

        } catch (Exception $e) {
            Logger::error("Failed to update automation status: " . $e->getMessage());
            return false;
        }
    }
}

// If called directly (via cron), execute the job
if (php_sapi_name() === 'cli' || (isset($_GET['cron_key']) && $_GET['cron_key'] === 'hilyoon_blog_automation_2024')) {
    $scheduler = new CronScheduler();
    $scheduler->executeScheduledGeneration();
}
?>
