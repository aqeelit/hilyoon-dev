<?php
/**
 * API front controller. .htaccess sends every /api/* request here.
 *
 *   GET    /api/status
 *   POST   /api/auth/login | /api/auth/logout      GET /api/auth/me
 *   GET    /api/blog/posts   GET /api/blog/categories   GET /api/blog/post/{slug}
 *   GET    /api/admin/dashboard
 *   GET|POST /api/admin/users     PUT|DELETE /api/admin/users/{id}
 *   *      /api/admin/complete?action=...          * /api/automation?action=...
 */
require_once __DIR__ . '/../utils/auth.php';

handleCORS(); // also answers OPTIONS preflight

$path = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '';
$route = preg_match('#/api/(.*)$#', $path, $m) ? trim($m[1], '/') : '';
$route = preg_replace('#\.php$#', '', $route);

$routes = [
    '#^(status)?$#'                     => 'status.php',
    '#^auth/login$#'                    => 'auth/login.php',
    '#^auth/logout$#'                   => 'auth/logout.php',
    '#^auth/(me|profile)$#'             => 'auth/me.php',
    '#^blog/posts$#'                    => 'blog/posts.php',
    '#^blog/categories$#'               => 'blog/categories.php',
    '#^blog/posts?/(?<slug>[^/]+)$#'    => 'blog/post.php',
    '#^admin/dashboard$#'               => 'admin/dashboard.php',
    '#^admin/users(/(?<id>\d+))?$#'     => 'admin/users.php',
    '#^admin/complete$#'                => 'admin/complete.php',
    '#^automation(/index)?$#'           => 'automation/index.php',
];

foreach ($routes as $pattern => $file) {
    if (preg_match($pattern, $route, $params)) {
        foreach (['slug', 'id'] as $key) {
            if (!empty($params[$key])) $_GET[$key] = $params[$key];
        }
        require __DIR__ . '/' . $file;
        exit;
    }
}

APIResponse::notFound("Endpoint not found: /api/$route");
