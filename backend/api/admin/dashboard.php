<?php
require_once __DIR__ . '/../../utils/auth.php';
require_once __DIR__ . '/../../models/User.php';
require_once __DIR__ . '/../../models/BlogPost.php';

// Require admin authentication
$user_data = requireAuth('viewer'); // Allow viewer role and above

handleCORS();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    APIResponse::error('Method not allowed', 405);
}

try {
    $user = new User();
    $blog_post = new BlogPost();
    
    // Get dashboard statistics
    $stats = [
        'users' => [
            'total' => $user->getUserCount(),
            'admins' => getUserCountByRole('admin'),
            'editors' => getUserCountByRole('editor'),
            'viewers' => getUserCountByRole('viewer')
        ],
        'posts' => [
            'total' => $blog_post->getPostCount('en', 'all') + $blog_post->getPostCount('ro', 'all') + $blog_post->getPostCount('ar', 'all'),
            'published' => $blog_post->getPostCount('en', 'published') + $blog_post->getPostCount('ro', 'published') + $blog_post->getPostCount('ar', 'published'),
            'draft' => $blog_post->getPostCount('en', 'draft') + $blog_post->getPostCount('ro', 'draft') + $blog_post->getPostCount('ar', 'draft'),
            'by_locale' => [
                'en' => $blog_post->getPostCount('en'),
                'ro' => $blog_post->getPostCount('ro'),
                'ar' => $blog_post->getPostCount('ar')
            ]
        ],
        'analytics' => [
            'total_views' => getTotalViews(),
            'unique_visitors' => getUniqueVisitors(),
            'avg_session_duration' => getAvgSessionDuration(),
            'bounce_rate' => getBounceRate()
        ]
    ];

    // Get recent activity
    $recent_posts = $blog_post->getAllPosts('en', 5, 0, 'all');
    $recent_users = $user->getAllUsers(5, 0);
    
    // Get top performing posts
    $top_posts = getTopPosts(5);
    
    // Get traffic sources
    $traffic_sources = getTrafficSources();

    APIResponse::success([
        'stats' => $stats,
        'recent_posts' => $recent_posts,
        'recent_users' => $recent_users,
        'top_posts' => $top_posts,
        'traffic_sources' => $traffic_sources,
        'user' => $user_data
    ], 'Dashboard data retrieved successfully');

} catch (Exception $e) {
    Logger::error("Dashboard error: " . $e->getMessage());
    APIResponse::error('Failed to retrieve dashboard data');
}

/**
 * Get user count by role
 * @param string $role
 * @return int
 */
function getUserCountByRole($role) {
    try {
        $db = getDB();
        $query = "SELECT COUNT(*) as count FROM users WHERE role = ? AND is_active = 1";
        $result = $db->query($query, [$role]);
        return $result[0]['count'] ?? 0;
    } catch (Exception $e) {
        return 0;
    }
}

/**
 * Get total page views
 * @return int
 */
function getTotalViews() {
    try {
        $db = getDB();
        $query = "SELECT COUNT(*) as count FROM page_views WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
        $result = $db->query($query);
        return $result[0]['count'] ?? 0;
    } catch (Exception $e) {
        return 0;
    }
}

/**
 * Get unique visitors
 * @return int
 */
function getUniqueVisitors() {
    try {
        $db = getDB();
        $query = "SELECT COUNT(DISTINCT ip_address) as count FROM page_views WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
        $result = $db->query($query);
        return $result[0]['count'] ?? 0;
    } catch (Exception $e) {
        return 0;
    }
}

/**
 * Get average session duration
 * @return float
 */
function getAvgSessionDuration() {
    try {
        $db = getDB();
        $query = "SELECT AVG(view_duration) as avg_duration FROM page_views WHERE view_duration > 0 AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
        $result = $db->query($query);
        return round($result[0]['avg_duration'] ?? 0, 2);
    } catch (Exception $e) {
        return 0;
    }
}

/**
 * Get bounce rate
 * @return float
 */
function getBounceRate() {
    try {
        $db = getDB();
        $query = "SELECT 
                    (COUNT(CASE WHEN page_count = 1 THEN 1 END) / COUNT(*)) * 100 as bounce_rate
                  FROM (
                    SELECT session_id, COUNT(*) as page_count 
                    FROM page_views 
                    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                    GROUP BY session_id
                  ) session_stats";
        $result = $db->query($query);
        return round($result[0]['bounce_rate'] ?? 0, 2);
    } catch (Exception $e) {
        return 0;
    }
}

/**
 * Get top performing posts
 * @param int $limit
 * @return array
 */
function getTopPosts($limit = 5) {
    try {
        $db = getDB();
        $limit = max(1, (int)$limit);
        $query = "SELECT p.id, p.title, p.slug, p.language, p.views_count, p.published_at,
                         c.name as category_name, p.author_name
                  FROM blog_posts p
                  LEFT JOIN blog_categories c ON p.category_id = c.id
                  WHERE p.is_published = 1
                  ORDER BY p.views_count DESC
                  LIMIT $limit";
        return $db->query($query);
    } catch (Exception $e) {
        return [];
    }
}

/**
 * Get traffic sources
 * @return array
 */
function getTrafficSources() {
    try {
        $db = getDB();
        $query = "SELECT 
                    CASE 
                        WHEN referrer = '' OR referrer IS NULL THEN 'Direct'
                        WHEN referrer LIKE '%google%' THEN 'Google'
                        WHEN referrer LIKE '%facebook%' THEN 'Facebook'
                        WHEN referrer LIKE '%twitter%' THEN 'Twitter'
                        WHEN referrer LIKE '%linkedin%' THEN 'LinkedIn'
                        ELSE 'Other'
                    END as source,
                    COUNT(*) as visits,
                    (COUNT(*) / (SELECT COUNT(*) FROM page_views WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) * 100) as percentage
                  FROM page_views 
                  WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                  GROUP BY source
                  ORDER BY visits DESC";
        return $db->query($query);
    } catch (Exception $e) {
        return [];
    }
}
?>
