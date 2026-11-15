<?php
require_once __DIR__ . '/../../utils/auth.php';
require_once __DIR__ . '/../../models/User.php';

handleCORS();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    APIResponse::error('Method not allowed', 405);
}

$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$missing = Validator::validateRequired($input, ['email', 'password']);
if ($missing) {
    APIResponse::error('Missing required fields: ' . implode(', ', $missing));
}

try {
    $user = new User();
    if (!$user->findByEmail(trim($input['email'])) || !$user->verifyPassword($input['password'])) {
        Logger::warning('Failed login for ' . $input['email'] . ' from ' . ($_SERVER['REMOTE_ADDR'] ?? '?'));
        APIResponse::error('Invalid email or password', 401);
    }
    if (!$user->is_active) {
        APIResponse::error('Account is disabled', 403);
    }

    $ttl = !empty($input['rememberMe']) ? 30 * 86400 : null;
    $token = generateToken($user->toArray(), $ttl);
    $user->updateLastLogin();
    Logger::info("User logged in: {$user->email}");

    APIResponse::success([
        'token' => $token,
        'token_type' => 'Bearer',
        'expires_in' => $ttl ?? (int)config('JWT_EXPIRATION', 86400),
        'user' => $user->toArray(),
    ], 'Login successful');

} catch (Exception $e) {
    Logger::error('Login error: ' . $e->getMessage());
    APIResponse::error('Login failed', 500);
}
