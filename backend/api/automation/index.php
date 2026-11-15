<?php
require_once __DIR__ . '/../../utils/auth.php';
require_once __DIR__ . '/../../automation/cron-scheduler.php';
require_once __DIR__ . '/../../automation/content-generator.php';

header('Content-Type: application/json');
handleCORS();

// Check authentication
$user = authenticateUser();
if (!$user || $user['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Admin access required']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$path = $_GET['action'] ?? '';

try {
    $scheduler = new CronScheduler();
    $generator = new ContentGenerator();

    switch ($method) {
        case 'GET':
            handleGetRequest($path, $scheduler, $generator);
            break;
            
        case 'POST':
            handlePostRequest($path, $scheduler, $generator);
            break;
            
        default:
            APIResponse::error('Method not allowed', 405);
    }

} catch (Exception $e) {
    Logger::error("Automation API error: " . $e->getMessage());
    APIResponse::error('Internal server error: ' . $e->getMessage(), 500);
}

/**
 * Handle GET requests
 */
function handleGetRequest($path, $scheduler, $generator) {
    switch ($path) {
        case 'status':
            $status = $scheduler->getAutomationStatus();
            APIResponse::success($status);
            break;
            
        case 'stats':
            $stats = $generator->getGenerationStats(30);
            APIResponse::success($stats);
            break;
            
        case 'test-rss':
            $rss_analyzer = new RSSFeedAnalyzer();
            $trends = $rss_analyzer->analyzeFeedsForTrends();
            APIResponse::success($trends);
            break;
            
        case 'recent-posts':
            $recent_posts = getRecentAIGeneratedPosts();
            APIResponse::success($recent_posts);
            break;
            
        default:
            APIResponse::notFound('Action not found');
    }
}

/**
 * Handle POST requests
 */
function handlePostRequest($path, $scheduler, $generator) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    switch ($path) {
        case 'generate':
            $posts_count = $input['posts_count'] ?? 1;
            $result = $scheduler->manualTrigger();
            APIResponse::success($result);
            break;
            
        case 'toggle':
            $enabled = $input['enabled'] ?? true;
            $result = $scheduler->setAutomationEnabled($enabled);
            APIResponse::success(['enabled' => $enabled, 'updated' => $result]);
            break;
            
        case 'test-generation':
            $language = $input['language'] ?? 'en';
            $result = $generator->testGeneration($language);
            APIResponse::success($result);
            break;
            
        case 'update-settings':
            $result = updateAutomationSettings($input);
            APIResponse::success($result);
            break;
            
        default:
            APIResponse::notFound('Action not found');
    }
}

/**
 * Get recent AI generated posts
 */
function getRecentAIGeneratedPosts($limit = 20) {
    $db = getDB();
    
    $query = "SELECT id, title, slug, language, published_at, views_count, 
                     source_name, source_title, ai_generated
              FROM blog_posts 
              WHERE ai_generated = 1 
              ORDER BY published_at DESC 
              LIMIT ?";
    
    return $db->query($query, [$limit]);
}

/**
 * Update automation settings
 */
function updateAutomationSettings($settings) {
    $db = getDB();
    $updated = [];
    
    $valid_settings = [
        'posts_per_generation' => $settings['posts_per_generation'] ?? null,
        'generation_languages' => isset($settings['languages']) ? implode(',', $settings['languages']) : null,
        'blog_automation_enabled' => $settings['enabled'] ?? null
    ];
    
    foreach ($valid_settings as $key => $value) {
        if ($value !== null) {
            try {
                $query = "UPDATE system_settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = ?";
                $db->execute($query, [$value, $key]);
                $updated[$key] = $value;
            } catch (Exception $e) {
                Logger::error("Failed to update setting {$key}: " . $e->getMessage());
            }
        }
    }
    
    return $updated;
}
?>
