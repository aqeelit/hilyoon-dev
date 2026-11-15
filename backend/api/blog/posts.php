<?php
require_once __DIR__ . '/../../utils/auth.php';
require_once __DIR__ . '/../../models/BlogPost.php';

handleCORS();

// Allow GET and OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    APIResponse::error('Method not allowed', 405);
}

try {
    $blog_post = new BlogPost();
    
    // Get query parameters
    $locale = $_GET['locale'] ?? 'en';
    $limit = min((int)($_GET['limit'] ?? 10), 50); // Max 50 posts per request
    $offset = max((int)($_GET['offset'] ?? 0), 0);
    $status = $_GET['status'] ?? 'published';
    $category = $_GET['category'] ?? null;
    $search = $_GET['search'] ?? null;
    $featured = $_GET['featured'] ?? null;

    // Validate locale
    if (!Validator::validateLocale($locale)) {
        APIResponse::error('Invalid locale');
    }

    if ($featured === 'true') {
        $posts = $blog_post->getFeaturedPosts($locale, $limit);
    } else {
        $posts = $blog_post->getAllPosts($locale, $limit, $offset, $status, $category, $search);
    }

    // Shape author/category/tags the same way for every response
    foreach ($posts as &$post) {
        $post['tags'] = getPostTags($post['id']);
        $post['author'] = [
            'name' => $post['author_name'],
            'email' => $post['author_email'],
            'avatar' => $post['author_avatar']
        ];
        $post['category'] = [
            'name' => $post['category_name'],
            'slug' => $post['category_slug'],
            'color' => $post['category_color']
        ];
        unset($post['author_name'], $post['author_email'], $post['author_avatar']);
        unset($post['category_name'], $post['category_slug'], $post['category_color']);
    }
    unset($post);

    if ($featured === 'true') {
        APIResponse::success([
            'posts' => $posts,
            'total' => count($posts),
            'limit' => $limit,
            'offset' => $offset
        ], 'Featured posts retrieved successfully');
    }

    // Count with the same filters so pagination matches the results
    $total_posts = $blog_post->getPostCount($locale, $status, $category, $search);

    APIResponse::success([
        'posts' => $posts,
        'pagination' => [
            'total' => $total_posts,
            'limit' => $limit,
            'offset' => $offset,
            'pages' => ceil($total_posts / $limit),
            'current_page' => floor($offset / $limit) + 1
        ]
    ], 'Posts retrieved successfully');

} catch (Exception $e) {
    Logger::error("Get posts error: " . $e->getMessage());
    APIResponse::error('Failed to retrieve posts');
}

/**
 * Get tags for a post
 * @param int $post_id
 * @return array
 */
function getPostTags($post_id) {
    try {
        $db = getDB();
        $query = "SELECT t.name, t.slug 
                  FROM blog_tags t
                  JOIN blog_post_tags pt ON t.id = pt.tag_id
                  WHERE pt.post_id = ?
                  ORDER BY t.name";
        
        return $db->query($query, [$post_id]);
        
    } catch (Exception $e) {
        error_log("Get post tags error: " . $e->getMessage());
        return [];
    }
}
?>
