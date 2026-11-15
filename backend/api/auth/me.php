<?php
require_once __DIR__ . '/../../utils/auth.php';
require_once __DIR__ . '/../../models/User.php';

handleCORS();

$auth = requireAuth('viewer');
$user = new User();
if (!$user->findById($auth['user_id'])) {
    APIResponse::notFound('User not found');
}
APIResponse::success($user->toArray(), 'Profile retrieved successfully');
