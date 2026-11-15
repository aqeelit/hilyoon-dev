<?php
require_once __DIR__ . '/../../utils/auth.php';
require_once __DIR__ . '/../../models/User.php';

// Require admin authentication
$user_data = requireAuth('admin');

handleCORS();

$method = $_SERVER['REQUEST_METHOD'];

try {
    $user = new User();
    
    switch ($method) {
        case 'GET':
            // Get all users with pagination
            $limit = min((int)($_GET['limit'] ?? 20), 100);
            $offset = max((int)($_GET['offset'] ?? 0), 0);
            
            $users = $user->getAllUsers($limit, $offset);
            $total = $user->getUserCount();
            
            APIResponse::success([
                'users' => $users,
                'pagination' => [
                    'total' => $total,
                    'limit' => $limit,
                    'offset' => $offset,
                    'pages' => ceil($total / $limit),
                    'current_page' => floor($offset / $limit) + 1
                ]
            ], 'Users retrieved successfully');
            break;

        case 'POST':
            // Create new user
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                APIResponse::error('Invalid JSON input');
            }

            $required_fields = ['email', 'password', 'name', 'role'];
            $missing_fields = Validator::validateRequired($input, $required_fields);
            
            if ($missing_fields) {
                APIResponse::error('Missing required fields: ' . implode(', ', $missing_fields));
            }

            // Validate email
            if (!Validator::validateEmail($input['email'])) {
                APIResponse::error('Invalid email format');
            }

            // Validate role
            if (!Validator::validateRole($input['role'])) {
                APIResponse::error('Invalid role');
            }

            // Validate password
            $password_errors = Validator::validatePassword($input['password']);
            if (!empty($password_errors)) {
                APIResponse::error('Password validation failed: ' . implode(', ', $password_errors));
            }

            // Check if email already exists
            if ($user->findByEmail($input['email'])) {
                APIResponse::error('Email already exists');
            }

            // Create user
            $user->email = Validator::sanitizeString($input['email']);
            $user->password_hash = $input['password']; // Will be hashed in create method
            $user->name = Validator::sanitizeString($input['name']);
            $user->role = $input['role'];
            $user->bio = isset($input['bio']) ? Validator::sanitizeString($input['bio']) : null;
            $user->is_active = $input['is_active'] ?? true;

            $user_id = $user->create();
            
            if ($user_id) {
                Logger::info("New user created: {$user->email} by admin: {$user_data['email']}");
                APIResponse::success(['user_id' => $user_id], 'User created successfully');
            } else {
                APIResponse::error('Failed to create user');
            }
            break;

        case 'PUT':
            // Update user
            $user_id = $_GET['id'] ?? getPathTail();
            
            if (!$user_id || !is_numeric($user_id)) {
                APIResponse::error('Invalid user ID');
            }

            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                APIResponse::error('Invalid JSON input');
            }

            // Find user
            if (!$user->findById($user_id)) {
                APIResponse::notFound('User not found');
            }

            // Prevent admin from modifying their own role/status
            if ($user->id == $user_data['user_id'] && 
                (isset($input['role']) || isset($input['is_active']))) {
                APIResponse::error('Cannot modify your own role or status');
            }

            // Update fields
            if (isset($input['name'])) {
                $user->name = Validator::sanitizeString($input['name']);
            }
            
            if (isset($input['role']) && Validator::validateRole($input['role'])) {
                $user->role = $input['role'];
            }
            
            if (isset($input['bio'])) {
                $user->bio = Validator::sanitizeString($input['bio']);
            }
            
            if (isset($input['is_active'])) {
                $user->is_active = (bool)$input['is_active'];
            }

            if ($user->update()) {
                Logger::info("User updated: {$user->email} by admin: {$user_data['email']}");
                APIResponse::success($user->toArray(), 'User updated successfully');
            } else {
                APIResponse::error('Failed to update user');
            }
            break;

        case 'DELETE':
            // Delete user (soft delete)
            $user_id = $_GET['id'] ?? getPathTail();
            
            if (!$user_id || !is_numeric($user_id)) {
                APIResponse::error('Invalid user ID');
            }

            // Find user
            if (!$user->findById($user_id)) {
                APIResponse::notFound('User not found');
            }

            // Prevent admin from deleting themselves
            if ($user->id == $user_data['user_id']) {
                APIResponse::error('Cannot delete your own account');
            }

            if ($user->delete()) {
                Logger::info("User deleted: {$user->email} by admin: {$user_data['email']}");
                APIResponse::success(null, 'User deleted successfully');
            } else {
                APIResponse::error('Failed to delete user');
            }
            break;

        default:
            APIResponse::error('Method not allowed', 405);
    }

} catch (Exception $e) {
    Logger::error("Users API error: " . $e->getMessage());
    APIResponse::error('API request failed');
}
?>
