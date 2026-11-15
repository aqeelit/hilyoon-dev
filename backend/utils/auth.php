<?php
/**
 * Shared API helpers: config loading, JSON responses, CORS, validation,
 * logging and stateless HMAC-signed (JWT HS256) token authentication.
 */

require_once __DIR__ . '/../config/database.php';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/**
 * Read a config value from the environment, an optional config/env.php
 * (same format as config/env.example.php), or fall back to a default.
 */
function config($key, $default = null) {
    static $file_config = null;
    if ($file_config === null) {
        $path = __DIR__ . '/../config/env.php';
        $file_config = file_exists($path) ? (array)(include $path) : [];
    }
    if (isset($_ENV[$key])) return $_ENV[$key];
    $env = getenv($key);
    if ($env !== false) return $env;
    return $file_config[$key] ?? $default;
}

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------

function handleCORS() {
    if (headers_sent()) return;

    $allowed = config('CORS_ORIGINS', ['http://localhost:3000']);
    if (!is_array($allowed)) $allowed = array_map('trim', explode(',', $allowed));

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin && in_array($origin, $allowed, true)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Vary: Origin');
    } else {
        header('Access-Control-Allow-Origin: ' . $allowed[0]);
    }
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

// ---------------------------------------------------------------------------
// JSON responses
// ---------------------------------------------------------------------------

class APIResponse {
    public static function send($success, $data, $message, $status_code) {
        if (!headers_sent()) {
            handleCORS();
            http_response_code($status_code);
            header('Content-Type: application/json; charset=utf-8');
        }
        echo json_encode([
            'success' => $success,
            'status_code' => $status_code,
            'message' => $message,
            'data' => $data,
            'timestamp' => date('c'),
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function success($data = null, $message = 'Success', $status_code = 200) {
        self::send(true, $data, $message, $status_code);
    }

    public static function error($message = 'Bad request', $status_code = 400, $data = null) {
        self::send(false, $data, $message, $status_code);
    }

    public static function notFound($message = 'Not found') {
        self::send(false, null, $message, 404);
    }

    public static function unauthorized($message = 'Authentication required') {
        self::send(false, null, $message, 401);
    }

    public static function forbidden($message = 'Insufficient permissions') {
        self::send(false, null, $message, 403);
    }
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

class Validator {
    const LOCALES = ['en', 'ro', 'ar'];
    const ROLES = ['admin', 'editor', 'viewer'];

    public static function validateLocale($locale) {
        return in_array($locale, self::LOCALES, true);
    }

    public static function validateRole($role) {
        return in_array($role, self::ROLES, true);
    }

    public static function validateEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    /** @return array names of missing/empty fields */
    public static function validateRequired($input, array $fields) {
        $missing = [];
        foreach ($fields as $field) {
            if (!isset($input[$field]) || (is_string($input[$field]) && trim($input[$field]) === '')) {
                $missing[] = $field;
            }
        }
        return $missing;
    }

    /** @return array list of password rule violations (empty if valid) */
    public static function validatePassword($password) {
        $errors = [];
        if (strlen((string)$password) < 8) $errors[] = 'must be at least 8 characters';
        if (!preg_match('/[A-Za-z]/', $password)) $errors[] = 'must contain a letter';
        if (!preg_match('/\d/', $password)) $errors[] = 'must contain a number';
        return $errors;
    }

    public static function sanitizeString($value) {
        return trim(strip_tags((string)$value));
    }
}

// ---------------------------------------------------------------------------
// Logging
// ---------------------------------------------------------------------------

class Logger {
    private static function write($level, $message) {
        $line = sprintf("[%s] %s: %s\n", date('Y-m-d H:i:s'), $level, $message);
        $dir = __DIR__ . '/../logs';
        if (!is_dir($dir)) @mkdir($dir, 0755, true);
        if (!@file_put_contents($dir . '/api.log', $line, FILE_APPEND | LOCK_EX)) {
            error_log(trim($line));
        }
    }

    public static function debug($message)   { self::write('DEBUG', $message); }
    public static function info($message)    { self::write('INFO', $message); }
    public static function warning($message) { self::write('WARNING', $message); }
    public static function error($message)   { self::write('ERROR', $message); }
}

// ---------------------------------------------------------------------------
// Tokens (JWT, HS256)
// ---------------------------------------------------------------------------

function base64UrlEncode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64UrlDecode($data) {
    return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', (4 - strlen($data) % 4) % 4));
}

function jwtSecret() {
    return config('JWT_SECRET', 'hilyoon_jwt_secret_key_2025_change_in_production');
}

function generateToken(array $user, $ttl = null) {
    $ttl = $ttl ?? (int)config('JWT_EXPIRATION', 86400);
    $header = ['alg' => 'HS256', 'typ' => 'JWT'];
    $payload = [
        'user_id' => (int)$user['id'],
        'email' => $user['email'],
        'name' => $user['name'],
        'role' => $user['role'],
        'iat' => time(),
        'exp' => time() + $ttl,
    ];
    $segments = base64UrlEncode(json_encode($header)) . '.' . base64UrlEncode(json_encode($payload));
    $signature = hash_hmac('sha256', $segments, jwtSecret(), true);
    return $segments . '.' . base64UrlEncode($signature);
}

/** @return array|null decoded payload, or null if invalid/expired */
function verifyToken($token) {
    $parts = explode('.', (string)$token);
    if (count($parts) !== 3) return null;

    [$header, $payload, $signature] = $parts;
    $expected = base64UrlEncode(hash_hmac('sha256', "$header.$payload", jwtSecret(), true));
    if (!hash_equals($expected, $signature)) return null;

    $data = json_decode(base64UrlDecode($payload), true);
    if (!is_array($data) || ($data['exp'] ?? 0) < time()) return null;

    return $data;
}

function getBearerToken() {
    $header = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? null;

    if (!$header && function_exists('getallheaders')) {
        foreach (getallheaders() as $name => $value) {
            if (strcasecmp($name, 'Authorization') === 0) {
                $header = $value;
                break;
            }
        }
    }

    if ($header && preg_match('/Bearer\s+(\S+)/i', $header, $m)) {
        return $m[1];
    }
    return null;
}

/**
 * Authenticate the current request from its Bearer token.
 * The user is re-checked against the database so deactivated users or
 * role changes take effect immediately.
 *
 * @return array|null ['user_id','email','name','role'] or null
 */
function authenticateUser() {
    $payload = verifyToken(getBearerToken());
    if (!$payload) return null;

    try {
        $rows = getDB()->query(
            "SELECT id, email, name, role FROM users WHERE id = ? AND is_active = 1",
            [$payload['user_id']]
        );
    } catch (Exception $e) {
        Logger::error('Auth lookup failed: ' . $e->getMessage());
        return null;
    }
    if (!$rows) return null;

    return [
        'user_id' => (int)$rows[0]['id'],
        'email' => $rows[0]['email'],
        'name' => $rows[0]['name'],
        'role' => $rows[0]['role'],
    ];
}

/**
 * Require an authenticated user with at least the given role
 * (viewer < editor < admin). Sends 401/403 and exits otherwise.
 */
function requireAuth($min_role = 'viewer') {
    $levels = ['viewer' => 1, 'editor' => 2, 'admin' => 3];

    $user = authenticateUser();
    if (!$user) {
        APIResponse::unauthorized('Authentication required');
    }
    if (($levels[$user['role']] ?? 0) < ($levels[$min_role] ?? 99)) {
        APIResponse::forbidden('Insufficient permissions');
    }
    return $user;
}

/** Last path segment of the request URI, without the query string. */
function getPathTail() {
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '';
    $parts = explode('/', trim($path, '/'));
    return urldecode(end($parts));
}
