<?php
require_once __DIR__ . '/../utils/auth.php';
require_once __DIR__ . '/../models/User.php';

// Hardened session cookie
session_set_cookie_params([
    'httponly' => true,
    'samesite' => 'Lax',
    'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
]);
session_start();

// Already logged in
if (!empty($_SESSION['admin_logged_in'])) {
    header('Location: dashboard.php');
    exit;
}

if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 300;

$error = null;
$locked_until = $_SESSION['login_locked_until'] ?? 0;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (time() < $locked_until) {
        $error = 'Too many failed attempts. Try again in a few minutes.';
    } elseif (!hash_equals($_SESSION['csrf_token'], (string)($_POST['csrf_token'] ?? ''))) {
        $error = 'Your session expired. Please try again.';
    } else {
        $email = trim((string)($_POST['email'] ?? ''));
        $password = (string)($_POST['password'] ?? '');

        $user = new User();
        $valid = false;
        try {
            $valid = $user->findByEmail($email)
                && $user->is_active
                && $user->role === 'admin'
                && $user->verifyPassword($password);
        } catch (Exception $e) {
            Logger::error('Admin login DB error: ' . $e->getMessage());
            $error = 'Login is temporarily unavailable.';
        }

        if ($valid) {
            session_regenerate_id(true);
            unset($_SESSION['login_failures'], $_SESSION['login_locked_until']);
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_user_id'] = $user->id;
            $_SESSION['admin_email'] = $user->email;
            $_SESSION['admin_name'] = $user->name;
            $_SESSION['admin_role'] = $user->role;
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
            $user->updateLastLogin();
            Logger::info("Admin panel login: {$user->email}");
            header('Location: dashboard.php');
            exit;
        }

        if (!$error) {
            $_SESSION['login_failures'] = ($_SESSION['login_failures'] ?? 0) + 1;
            Logger::warning('Failed admin login for ' . $email . ' from ' . ($_SERVER['REMOTE_ADDR'] ?? '?'));
            usleep(400000); // slow down guessing
            if ($_SESSION['login_failures'] >= MAX_ATTEMPTS) {
                $_SESSION['login_locked_until'] = time() + LOCKOUT_SECONDS;
                $_SESSION['login_failures'] = 0;
            }
            $error = 'Invalid email or password';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hilyoon Admin Login</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
    </style>
</head>
<body class="gradient-bg min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
        <!-- Header -->
        <div class="text-center mb-8">
            <div class="inline-block p-3 bg-white rounded-full shadow-lg mb-4">
                <i class="fas fa-rocket text-indigo-600 text-2xl"></i>
            </div>
            <h1 class="text-3xl font-bold text-white mb-2">Hilyoon Admin</h1>
            <p class="text-indigo-100">Complete Admin Dashboard</p>
        </div>

        <!-- Login Form -->
        <div class="bg-white rounded-2xl shadow-2xl p-8">
            <form method="POST" class="space-y-6" autocomplete="on">
                <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($_SESSION['csrf_token']) ?>">
                <!-- Email Field -->
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <i class="fas fa-envelope text-gray-400"></i>
                        </div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value="<?= htmlspecialchars($_POST['email'] ?? '') ?>"
                            autocomplete="username"
                            class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="you@company.com"
                        >
                    </div>
                </div>

                <!-- Password Field -->
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                        Password
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <i class="fas fa-lock text-gray-400"></i>
                        </div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            autocomplete="current-password"
                            class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter password"
                        >
                    </div>
                </div>

                <!-- Error Message -->
                <?php if (isset($error)): ?>
                <div class="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div class="flex">
                        <i class="fas fa-exclamation-triangle text-red-400 mt-1"></i>
                        <div class="ml-3">
                            <p class="text-sm text-red-800"><?= htmlspecialchars($error) ?></p>
                        </div>
                    </div>
                </div>
                <?php endif; ?>

                <!-- Login Button -->
                <button
                    type="submit"
                    class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition duration-200 transform hover:scale-105"
                >
                    <i class="fas fa-sign-in-alt mr-2"></i>
                    Sign In to Dashboard
                </button>
            </form>
        </div>

        <!-- Features -->
        <div class="mt-6 text-center">
            <div class="grid grid-cols-2 gap-4 text-white text-sm">
                <div class="bg-white bg-opacity-10 rounded-lg p-3">
                    <i class="fas fa-robot text-xl mb-2"></i>
                    <p>AI Automation</p>
                </div>
                <div class="bg-white bg-opacity-10 rounded-lg p-3">
                    <i class="fas fa-chart-bar text-xl mb-2"></i>
                    <p>Analytics</p>
                </div>
                <div class="bg-white bg-opacity-10 rounded-lg p-3">
                    <i class="fas fa-blog text-xl mb-2"></i>
                    <p>Blog Management</p>
                </div>
                <div class="bg-white bg-opacity-10 rounded-lg p-3">
                    <i class="fas fa-users text-xl mb-2"></i>
                    <p>User Management</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
