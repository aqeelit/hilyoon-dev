<?php
require_once __DIR__ . '/../../utils/auth.php';

handleCORS();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    APIResponse::error('Method not allowed', 405);
}

$locale = $_GET['locale'] ?? 'en';
if (!Validator::validateLocale($locale)) {
    APIResponse::error('Invalid locale');
}

try {
    $categories = getDB()->query(
        "SELECT c.id, c.name, c.slug, c.description, c.color, c.language,
                (SELECT COUNT(*) FROM blog_posts p WHERE p.category_id = c.id AND p.is_published = 1) AS post_count
         FROM blog_categories c
         WHERE c.language = ? AND c.is_active = 1
         ORDER BY c.name",
        [$locale]
    );
    foreach ($categories as &$c) {
        $c['id'] = (int)$c['id'];
        $c['post_count'] = (int)$c['post_count'];
    }
    APIResponse::success(['categories' => $categories], 'Categories retrieved successfully');
} catch (Exception $e) {
    Logger::error('Get categories error: ' . $e->getMessage());
    APIResponse::error('Failed to retrieve categories', 500);
}
