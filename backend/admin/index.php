<?php
session_start();

// Simple login check - if already logged in, redirect to dashboard
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header('Location: dashboard.php');
    exit;
}

// Handle login form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    
    // Simple hardcoded admin credentials
    if ($email === 'admin@hilyoon.com' && $password === 'admin123') {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_email'] = $email;
        $_SESSION['admin_name'] = 'Admin User';
        $_SESSION['admin_role'] = 'admin';
        
        header('Location: dashboard.php');
        exit;
    } else {
        $error = 'Invalid email or password';
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
            <form method="POST" class="space-y-6">
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
                            value="<?= isset($_POST['email']) ? htmlspecialchars($_POST['email']) : 'admin@hilyoon.com' ?>"
                            class="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="admin@hilyoon.com"
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
                            value="admin123"
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

        <!-- Demo Info -->
        <div class="mt-8 bg-white bg-opacity-20 rounded-xl p-6 text-center">
            <h3 class="text-lg font-medium text-white mb-2">
                <i class="fas fa-key mr-2"></i>
                Demo Login
            </h3>
            <div class="text-indigo-100 space-y-1">
                <p><strong>Email:</strong> admin@hilyoon.com</p>
                <p><strong>Password:</strong> admin123</p>
            </div>
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
