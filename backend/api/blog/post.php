<?php
require_once __DIR__ . '/../../utils/auth.php';
require_once __DIR__ . '/../../models/BlogPost.php';

handleCORS();

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    APIResponse::error('Method not allowed', 405);
}

try {
    // Slug from router (?slug=) or the last URL path segment
    $slug = $_GET['slug'] ?? getPathTail();
    
    if (!$slug) {
        APIResponse::error('Post slug is required', 400);
    }

    $locale = $_GET['locale'] ?? 'en';
    
    // Validate locale
    if (!Validator::validateLocale($locale)) {
        APIResponse::error('Invalid locale');
    }

    $blog_post = new BlogPost();
    $post_found = $blog_post->findBySlug($slug, $locale);
    
    if (!$post_found) {
        APIResponse::notFound('Post not found');
    }

    // Get post data
    $post_data = $blog_post->toArray();
    
    // Add additional data
    $post_data['tags'] = getPostTags($blog_post->id);
    $post_data['related_posts'] = $blog_post->getRelatedPosts($blog_post->category_id, $locale, $blog_post->id, 3);
    
    // Author is stored inline on the post
    $post_data['author'] = [
        'name' => $blog_post->author_name,
        'email' => $blog_post->author_email,
        'avatar' => null
    ];
    
    // Get category info
    $category_query = "SELECT name, slug, description, color FROM blog_categories WHERE id = ?";
    $category_data = getDB()->query($category_query, [$blog_post->category_id]);
    $post_data['category'] = $category_data[0] ?? null;

    // Track page view
    trackPageView($_SERVER['REQUEST_URI'], $blog_post->id);
    $blog_post->incrementViews();

    APIResponse::success($post_data, 'Post retrieved successfully');

} catch (Exception $e) {
    Logger::error("Get post error: " . $e->getMessage());
    APIResponse::error('Failed to retrieve post');
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

/**
 * Track page view
 * @param string $url
 * @param int $post_id
 */
function trackPageView($url, $post_id = null) {
    try {
        $db = getDB();
        
        $query = "INSERT INTO page_views (url, post_id, user_agent, ip_address, referrer, session_id)
                  VALUES (?, ?, ?, ?, ?, ?)";
        
        $session_id = session_id() ?: bin2hex(random_bytes(16));
        
        $db->execute($query, [
            $url,
            $post_id,
            $_SERVER['HTTP_USER_AGENT'] ?? '',
            $_SERVER['REMOTE_ADDR'] ?? '',
            $_SERVER['HTTP_REFERER'] ?? '',
            $session_id
        ]);
        
    } catch (Exception $e) {
        error_log("Track page view error: " . $e->getMessage());
    }
}
?>
