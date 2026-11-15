<?php
require_once __DIR__ . '/../../utils/auth.php';
require_once __DIR__ . '/../../config/database.php';

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
$action = $_GET['action'] ?? '';

try {
    $db = getDB();
    
    switch ($method) {
        case 'GET':
            handleGetRequest($action, $db);
            break;
            
        case 'POST':
            handlePostRequest($action, $db);
            break;
            
        case 'PUT':
            handlePutRequest($action, $db);
            break;
            
        case 'DELETE':
            handleDeleteRequest($action, $db);
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    }

} catch (Exception $e) {
    error_log("Complete Admin API error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Internal server error']);
}

/**
 * Handle GET requests - Fetch data
 */
function handleGetRequest($action, $db) {
    switch ($action) {
        case 'dashboard-stats':
            getDashboardStats($db);
            break;
            
        case 'blog-posts':
            getBlogPosts($db);
            break;
            
        case 'users':
            getUsers($db);
            break;
            
        case 'analytics':
            getAnalytics($db);
            break;
            
        case 'ai-status':
            getAIStatus($db);
            break;
            
        case 'ai-history':
            getAIHistory($db);
            break;
            
        case 'system-health':
            getSystemHealth($db);
            break;
            
        case 'settings':
            getSettings($db);
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
    }
}

/**
 * Handle POST requests - Create data
 */
function handlePostRequest($action, $db) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    switch ($action) {
        case 'blog-post':
            createBlogPost($db, $input);
            break;
            
        case 'user':
            createUser($db, $input);
            break;
            
        case 'ai-generate':
            triggerAIGeneration($db, $input);
            break;
            
        case 'test-rss':
            testRSSFeeds($db);
            break;
            
        case 'save-settings':
            saveSettings($db, $input);
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
    }
}

/**
 * Handle PUT requests - Update data
 */
function handlePutRequest($action, $db) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    switch ($action) {
        case 'blog-post':
            updateBlogPost($db, $input);
            break;
            
        case 'user':
            updateUser($db, $input);
            break;
            
        case 'ai-settings':
            updateAISettings($db, $input);
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
    }
}

/**
 * Handle DELETE requests - Delete data
 */
function handleDeleteRequest($action, $db) {
    $id = $_GET['id'] ?? null;
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID required']);
        return;
    }
    
    switch ($action) {
        case 'blog-post':
            deleteBlogPost($db, $id);
            break;
            
        case 'user':
            deleteUser($db, $id);
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
    }
}

/**
 * Get comprehensive dashboard statistics
 */
function getDashboardStats($db) {
    try {
        // Users stats
        $userStats = $db->query("
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins,
                COUNT(CASE WHEN role = 'editor' THEN 1 END) as editors,
                COUNT(CASE WHEN role = 'viewer' THEN 1 END) as viewers,
                COUNT(CASE WHEN is_active = 1 THEN 1 END) as active
            FROM users
        ")[0];
        
        // Blog posts stats
        $blogStats = $db->query("
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN is_published = 1 THEN 1 END) as published,
                COUNT(CASE WHEN is_published = 0 THEN 1 END) as drafts,
                COUNT(CASE WHEN ai_generated = 1 THEN 1 END) as ai_generated,
                SUM(views_count) as total_views
            FROM blog_posts
        ")[0];
        
        // Analytics stats
        $analyticsStats = $db->query("
            SELECT 
                COUNT(*) as total_views,
                COUNT(DISTINCT session_id) as unique_sessions,
                COUNT(DISTINCT ip_address) as unique_visitors,
                AVG(view_duration) as avg_duration
            FROM page_views
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        ")[0];
        
        // AI generation stats
        $aiStats = $db->query("
            SELECT 
                COUNT(*) as total_generations,
                COUNT(CASE WHEN status = 'success' THEN 1 END) as successful,
                COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
                SUM(tokens_used) as total_tokens,
                AVG(tokens_used) as avg_tokens
            FROM ai_generation_log
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        ")[0];
        
        // Recent activity
        $recentActivity = $db->query("
            SELECT 
                'blog_post' as type,
                title as description,
                created_at
            FROM blog_posts 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            
            UNION ALL
            
            SELECT 
                'user' as type,
                CONCAT('New user: ', name) as description,
                created_at
            FROM users 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            
            ORDER BY created_at DESC 
            LIMIT 10
        ");
        
        echo json_encode([
            'success' => true,
            'data' => [
                'stats' => [
                    'users' => $userStats,
                    'blog' => $blogStats,
                    'analytics' => $analyticsStats,
                    'ai' => $aiStats
                ],
                'recent_activity' => $recentActivity
            ]
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to fetch dashboard stats']);
    }
}

/**
 * Get blog posts with pagination and filtering
 */
function getBlogPosts($db) {
    try {
        $page = (int)($_GET['page'] ?? 1);
        $limit = (int)($_GET['limit'] ?? 20);
        $language = $_GET['language'] ?? '';
        $status = $_GET['status'] ?? '';
        $offset = ($page - 1) * $limit;
        
        $whereClause = "WHERE 1=1";
        $params = [];
        
        if ($language) {
            $whereClause .= " AND language = ?";
            $params[] = $language;
        }
        
        if ($status === 'published') {
            $whereClause .= " AND is_published = 1";
        } elseif ($status === 'draft') {
            $whereClause .= " AND is_published = 0";
        }
        
        $posts = $db->query("
            SELECT 
                id, title, slug, language, is_published, ai_generated,
                views_count, created_at, published_at,
                CASE WHEN ai_generated = 1 THEN 'AI Generated' ELSE 'Manual' END as source_type
            FROM blog_posts 
            $whereClause
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?
        ", array_merge($params, [$limit, $offset]));
        
        $total = $db->query("SELECT COUNT(*) as count FROM blog_posts $whereClause", $params)[0]['count'];
        
        echo json_encode([
            'success' => true,
            'data' => [
                'posts' => $posts,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => (int)$total,
                    'pages' => ceil($total / $limit)
                ]
            ]
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to fetch blog posts']);
    }
}

/**
 * Get users with role information
 */
function getUsers($db) {
    try {
        $users = $db->query("
            SELECT 
                id, name, email, role, is_active, 
                last_login_at, created_at
            FROM users 
            ORDER BY created_at DESC
        ");
        
        echo json_encode([
            'success' => true,
            'data' => ['users' => $users]
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to fetch users']);
    }
}

/**
 * Get analytics data
 */
function getAnalytics($db) {
    try {
        // Daily views for the last 30 days
        $dailyViews = $db->query("
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as views,
                COUNT(DISTINCT session_id) as sessions,
                COUNT(DISTINCT ip_address) as visitors
            FROM page_views 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        ");
        
        // Top content
        $topContent = $db->query("
            SELECT 
                bp.title,
                bp.language,
                COUNT(pv.id) as views
            FROM blog_posts bp
            LEFT JOIN page_views pv ON bp.id = pv.post_id
            WHERE pv.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY bp.id, bp.title, bp.language
            ORDER BY views DESC
            LIMIT 10
        ");
        
        // Device breakdown
        $deviceStats = $db->query("
            SELECT 
                device_type,
                COUNT(*) as count,
                ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM page_views WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)), 2) as percentage
            FROM page_views 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            AND device_type IS NOT NULL
            GROUP BY device_type
        ");
        
        echo json_encode([
            'success' => true,
            'data' => [
                'daily_views' => $dailyViews,
                'top_content' => $topContent,
                'device_stats' => $deviceStats
            ]
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to fetch analytics']);
    }
}

/**
 * Get AI automation status
 */
function getAIStatus($db) {
    try {
        // Get automation schedule
        $schedule = $db->query("
            SELECT * FROM automation_schedule 
            WHERE job_name = 'blog_generation'
        ")[0] ?? null;
        
        // Get recent executions
        $recentExecutions = $db->query("
            SELECT * FROM automation_execution_log 
            WHERE job_name = 'blog_generation'
            ORDER BY created_at DESC 
            LIMIT 10
        ");
        
        // Calculate success rate
        $successRate = 0;
        if (count($recentExecutions) > 0) {
            $successful = count(array_filter($recentExecutions, fn($exec) => $exec['status'] === 'success'));
            $successRate = round(($successful / count($recentExecutions)) * 100, 1);
        }
        
        // Get AI usage stats
        $aiStats = $db->query("
            SELECT 
                SUM(tokens_used) as total_tokens,
                COUNT(*) as total_generations,
                AVG(tokens_used) as avg_tokens
            FROM ai_generation_log 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        ")[0];
        
        echo json_encode([
            'success' => true,
            'data' => [
                'schedule' => $schedule,
                'recent_executions' => $recentExecutions,
                'success_rate' => $successRate,
                'ai_stats' => $aiStats
            ]
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to fetch AI status']);
    }
}

/**
 * Get AI generation history
 */
function getAIHistory($db) {
    try {
        $history = $db->query("
            SELECT 
                type, status, tokens_used, cost_usd, created_at, error_message
            FROM ai_generation_log 
            ORDER BY created_at DESC 
            LIMIT 50
        ");
        
        echo json_encode([
            'success' => true,
            'data' => ['history' => $history]
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to fetch AI history']);
    }
}

/**
 * Get system health information
 */
function getSystemHealth($db) {
    try {
        $health = [
            'database' => [
                'status' => 'online',
                'version' => $db->query("SELECT VERSION() as version")[0]['version']
            ],
            'php' => [
                'version' => PHP_VERSION,
                'memory_limit' => ini_get('memory_limit'),
                'max_execution_time' => ini_get('max_execution_time')
            ],
            'server' => [
                'software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
                'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown'
            ],
            'disk_space' => [
                'free' => disk_free_space('.'),
                'total' => disk_total_space('.')
            ]
        ];
        
        echo json_encode([
            'success' => true,
            'data' => ['health' => $health]
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to fetch system health']);
    }
}

/**
 * Get system settings
 */
function getSettings($db) {
    try {
        $settings = $db->query("
            SELECT setting_key, setting_value, description, type, is_public 
            FROM system_settings 
            ORDER BY setting_key
        ");
        
        // Convert to key-value pairs
        $settingsMap = [];
        foreach ($settings as $setting) {
            $settingsMap[$setting['setting_key']] = [
                'value' => $setting['setting_value'],
                'description' => $setting['description'],
                'type' => $setting['type'],
                'is_public' => (bool)$setting['is_public']
            ];
        }
        
        echo json_encode([
            'success' => true,
            'data' => ['settings' => $settingsMap]
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to fetch settings']);
    }
}

/**
 * Create new blog post
 */
function createBlogPost($db, $input) {
    try {
        $requiredFields = ['title', 'content', 'language', 'category_id'];
        foreach ($requiredFields as $field) {
            if (!isset($input[$field]) || empty($input[$field])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => "Field $field is required"]);
                return;
            }
        }
        
        $slug = generateSlug($input['title']);
        $readTime = estimateReadTime($input['content']);
        
        $postId = $db->insert("
            INSERT INTO blog_posts 
            (title, slug, content, excerpt, language, category_id, is_published, read_time, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ", [
            $input['title'],
            $slug,
            $input['content'],
            $input['excerpt'] ?? '',
            $input['language'],
            $input['category_id'],
            $input['is_published'] ?? 0,
            $readTime
        ]);
        
        echo json_encode([
            'success' => true,
            'data' => ['post_id' => $postId],
            'message' => 'Blog post created successfully'
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to create blog post']);
    }
}

/**
 * Create new user
 */
function createUser($db, $input) {
    try {
        $requiredFields = ['name', 'email', 'password', 'role'];
        foreach ($requiredFields as $field) {
            if (!isset($input[$field]) || empty($input[$field])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => "Field $field is required"]);
                return;
            }
        }
        
        // Check if email already exists
        $existingUser = $db->query("SELECT id FROM users WHERE email = ?", [$input['email']]);
        if (!empty($existingUser)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Email already exists']);
            return;
        }
        
        $passwordHash = password_hash($input['password'], PASSWORD_BCRYPT);
        
        $userId = $db->insert("
            INSERT INTO users (name, email, password_hash, role, is_active, created_at) 
            VALUES (?, ?, ?, ?, ?, NOW())
        ", [
            $input['name'],
            $input['email'],
            $passwordHash,
            $input['role'],
            $input['is_active'] ?? 1
        ]);
        
        echo json_encode([
            'success' => true,
            'data' => ['user_id' => $userId],
            'message' => 'User created successfully'
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to create user']);
    }
}

/**
 * Trigger AI blog generation
 */
function triggerAIGeneration($db, $input) {
    try {
        // This would integrate with your AI automation system
        require_once __DIR__ . '/../../automation/content-generator.php';
        
        $generator = new ContentGenerator();
        $result = $generator->generateBlogPost([
            'languages' => $input['languages'] ?? ['en'],
            'count' => $input['count'] ?? 1
        ]);
        
        echo json_encode([
            'success' => true,
            'data' => $result,
            'message' => 'AI generation triggered successfully'
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to trigger AI generation']);
    }
}

/**
 * Test RSS feeds
 */
function testRSSFeeds($db) {
    try {
        require_once __DIR__ . '/../../automation/rss-analyzer.php';
        
        $analyzer = new RSSFeedAnalyzer();
        $results = $analyzer->testAllFeeds();
        
        echo json_encode([
            'success' => true,
            'data' => $results,
            'message' => 'RSS feeds tested successfully'
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to test RSS feeds']);
    }
}

/**
 * Save system settings
 */
function saveSettings($db, $input) {
    try {
        foreach ($input as $key => $value) {
            $db->execute("
                UPDATE system_settings 
                SET setting_value = ?, updated_at = NOW() 
                WHERE setting_key = ?
            ", [$value, $key]);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Settings saved successfully'
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to save settings']);
    }
}

/**
 * Helper function to generate URL slug
 */
function generateSlug($text) {
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $text)));
    return trim($slug, '-');
}

/**
 * Helper function to estimate reading time
 */
function estimateReadTime($content) {
    $wordCount = str_word_count(strip_tags($content));
    return max(1, round($wordCount / 200)); // 200 words per minute
}

// handleCORS() is provided by utils/auth.php
?>
