<?php
require_once __DIR__ . '/../utils/auth.php';

handleCORS();

$db_ok = getDB()->testConnection();

APIResponse::success([
    'status' => $db_ok ? 'ok' : 'degraded',
    'database' => $db_ok ? 'connected' : 'unavailable',
    'php_version' => PHP_VERSION,
    'app' => config('APP_NAME', 'Hilyoon SaaS'),
    'version' => config('APP_VERSION', '1.0.0'),
    'server_time' => date('c'),
], $db_ok ? 'API is running' : 'API is running but the database is unavailable', $db_ok ? 200 : 503);
