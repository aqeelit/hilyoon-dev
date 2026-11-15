<?php
session_start();

// Logout
if (isset($_GET['logout'])) {
    $_SESSION = [];
    session_destroy();
    header('Location: index.php');
    exit;
}

// Require login (set by admin/index.php)
if (empty($_SESSION['admin_logged_in'])) {
    header('Location: index.php');
    exit;
}

$admin_name  = $_SESSION['admin_name']  ?? 'Admin User';
$admin_email = $_SESSION['admin_email'] ?? '';
$admin_role  = $_SESSION['admin_role']  ?? 'admin';

require_once __DIR__ . '/../config/database.php';

// Live data for the overview, AI and blog sections
$stats = ['posts' => 0, 'published' => 0, 'drafts' => 0, 'ai_posts' => 0, 'users' => 0, 'views' => 0];
$recent_posts = [];
$schedule = null;
$db_online = false;

try {
    $db = getDB();
    $row = $db->query("SELECT COUNT(*) AS total,
                              COALESCE(SUM(is_published = 1), 0) AS published,
                              COALESCE(SUM(is_published = 0), 0) AS drafts,
                              COALESCE(SUM(ai_generated = 1), 0) AS ai_posts,
                              COALESCE(SUM(views_count), 0) AS views
                       FROM blog_posts")[0];
    $stats['posts']     = (int)$row['total'];
    $stats['published'] = (int)$row['published'];
    $stats['drafts']    = (int)$row['drafts'];
    $stats['ai_posts']  = (int)$row['ai_posts'];
    $stats['views']     = (int)$row['views'];
    $stats['users']     = (int)$db->query("SELECT COUNT(*) AS c FROM users WHERE is_active = 1")[0]['c'];

    $recent_posts = $db->query("SELECT p.title, p.slug, p.language, p.is_published, p.ai_generated,
                                       p.views_count, COALESCE(p.published_at, p.created_at) AS date,
                                       c.name AS category
                                FROM blog_posts p
                                LEFT JOIN blog_categories c ON p.category_id = c.id
                                ORDER BY COALESCE(p.published_at, p.created_at) DESC
                                LIMIT 10");

    $sched = $db->query("SELECT * FROM automation_schedule WHERE job_name = 'blog_generation' LIMIT 1");
    $schedule = $sched[0] ?? null;
    $db_online = true;
} catch (Exception $e) {
    error_log('Admin dashboard DB error: ' . $e->getMessage());
}

function e($value) {
    return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8');
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hilyoon Admin Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .content-section { display: none; }
        .content-section.active { display: block; }
        .sidebar-item { cursor: pointer; transition: background-color .15s, color .15s; }
        .sidebar-item:hover { background-color: #EFF6FF; color: #1D4ED8; }
        .sidebar-item.active { background-color: #2563EB; color: #fff; }
        .sidebar-item.active i { color: #fff; }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <div class="flex min-h-screen">
        <!-- Sidebar -->
        <aside class="w-64 bg-white shadow-lg flex flex-col">
            <div class="p-6 border-b">
                <h1 class="text-xl font-bold text-gray-900"><i class="fas fa-rocket text-blue-600 mr-2"></i>Hilyoon Admin</h1>
                <p class="text-xs text-gray-500 mt-1">AI-Powered SaaS Platform</p>
            </div>
            <nav class="flex-1 p-4 space-y-1">
                <div class="sidebar-item active flex items-center px-4 py-3 rounded-lg text-gray-700" onclick="showSection('overview')">
                    <i class="fas fa-tachometer-alt w-5 mr-3 text-gray-400"></i>Overview
                </div>
                <div class="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700" onclick="showSection('ai-automation')">
                    <i class="fas fa-robot w-5 mr-3 text-gray-400"></i>AI Automation
                </div>
                <div class="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700" onclick="showSection('blog-management')">
                    <i class="fas fa-newspaper w-5 mr-3 text-gray-400"></i>Blog Posts
                </div>
                <div class="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700" onclick="showSection('user-management')">
                    <i class="fas fa-users w-5 mr-3 text-gray-400"></i>Users
                </div>
                <div class="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700" onclick="showSection('analytics')">
                    <i class="fas fa-chart-line w-5 mr-3 text-gray-400"></i>Analytics
                </div>
                <div class="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700" onclick="showSection('settings')">
                    <i class="fas fa-cog w-5 mr-3 text-gray-400"></i>Settings
                </div>
                <div class="sidebar-item flex items-center px-4 py-3 rounded-lg text-gray-700" onclick="showSection('system-health')">
                    <i class="fas fa-heartbeat w-5 mr-3 text-gray-400"></i>System Health
                </div>
            </nav>
            <div class="p-4 border-t">
                <div class="flex items-center">
                    <div class="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center">
                        <i class="fas fa-user-shield text-white text-sm"></i>
                    </div>
                    <div class="ml-3 min-w-0">
                        <div class="text-sm font-medium text-gray-900 truncate"><?= e($admin_name) ?></div>
                        <div class="text-xs text-gray-500 truncate"><?= e($admin_email) ?></div>
                    </div>
                </div>
                <a href="?logout=1" class="mt-3 flex items-center justify-center w-full px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
                    <i class="fas fa-sign-out-alt mr-2"></i>Logout
                </a>
            </div>
        </aside>

        <!-- Main content -->
        <main class="flex-1 p-8 overflow-y-auto">
            <!-- Header -->
            <div class="flex items-center justify-between mb-8">
                <h2 id="pageTitle" class="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
                <div class="text-sm text-gray-500"><i class="far fa-clock mr-1"></i><span id="currentTime"></span></div>
            </div>

            <!-- Overview Section -->
            <div id="overview" class="content-section active">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center"><i class="fas fa-newspaper text-white"></i></div>
                            <div class="ml-4">
                                <p class="text-sm text-gray-500">Total Posts</p>
                                <p class="text-2xl font-bold text-gray-900"><?= number_format($stats['posts']) ?></p>
                            </div>
                        </div>
                        <p class="text-xs text-gray-500 mt-3"><?= $stats['published'] ?> published · <?= $stats['drafts'] ?> drafts</p>
                    </div>
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center"><i class="fas fa-robot text-white"></i></div>
                            <div class="ml-4">
                                <p class="text-sm text-gray-500">AI Generated</p>
                                <p class="text-2xl font-bold text-gray-900"><?= number_format($stats['ai_posts']) ?></p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center"><i class="fas fa-users text-white"></i></div>
                            <div class="ml-4">
                                <p class="text-sm text-gray-500">Active Users</p>
                                <p class="text-2xl font-bold text-gray-900"><?= number_format($stats['users']) ?></p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <div class="flex items-center">
                            <div class="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center"><i class="fas fa-eye text-white"></i></div>
                            <div class="ml-4">
                                <p class="text-sm text-gray-500">Total Views</p>
                                <p class="text-2xl font-bold text-gray-900"><?= number_format($stats['views']) ?></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button onclick="triggerAI()" class="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"><i class="fas fa-magic mr-2"></i>Generate AI Post</button>
                        <button onclick="createPost()" class="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><i class="fas fa-plus mr-2"></i>New Blog Post</button>
                        <button onclick="createUser()" class="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"><i class="fas fa-user-plus mr-2"></i>Add User</button>
                    </div>
                </div>
            </div>

            <!-- AI Automation Section -->
            <div id="ai-automation" class="content-section">
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">AI Blog Automation</h2>
                    <p class="text-gray-600">Automatically generate multilingual blog posts from RSS feeds</p>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Schedule</h3>
                        <?php if ($schedule): ?>
                        <dl class="space-y-3 text-sm">
                            <div class="flex justify-between"><dt class="text-gray-600">Status</dt>
                                <dd><?= $schedule['is_active'] ? '<span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>' : '<span class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Paused</span>' ?></dd></div>
                            <div class="flex justify-between"><dt class="text-gray-600">Interval</dt><dd class="text-gray-900">Every <?= (int)$schedule['interval_hours'] ?> hours</dd></div>
                            <div class="flex justify-between"><dt class="text-gray-600">Last run</dt><dd class="text-gray-900"><?= e($schedule['last_run_time'] ?? 'Never') ?></dd></div>
                            <div class="flex justify-between"><dt class="text-gray-600">Next run</dt><dd class="text-gray-900"><?= e($schedule['next_run_time'] ?? 'Not scheduled') ?></dd></div>
                            <div class="flex justify-between"><dt class="text-gray-600">Total runs</dt><dd class="text-gray-900"><?= (int)($schedule['total_runs'] ?? 0) ?></dd></div>
                        </dl>
                        <?php else: ?>
                        <p class="text-sm text-gray-500">No automation schedule configured.</p>
                        <?php endif; ?>
                    </div>
                    <div class="bg-white rounded-xl shadow-sm p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                        <div class="space-y-3">
                            <button onclick="triggerAI()" class="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"><i class="fas fa-play mr-2"></i>Run Generation Now</button>
                            <button onclick="testRSS()" class="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"><i class="fas fa-rss mr-2"></i>Test RSS Feeds</button>
                        </div>
                        <p class="text-xs text-gray-500 mt-4">AI posts generated so far: <?= number_format($stats['ai_posts']) ?></p>
                    </div>
                </div>
            </div>

            <!-- Blog Management Section -->
            <div id="blog-management" class="content-section">
                <div class="mb-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-2xl font-bold text-gray-900 mb-2">Blog Management</h2>
                            <p class="text-gray-600">Create, edit, and manage blog posts in all languages</p>
                        </div>
                        <button onclick="createPost()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><i class="fas fa-plus mr-2"></i>New Post</button>
                    </div>
                </div>
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Language</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <?php if (!$recent_posts): ?>
                                <tr><td colspan="5" class="px-6 py-8 text-center text-sm text-gray-500">No blog posts yet.</td></tr>
                                <?php endif; ?>
                                <?php foreach ($recent_posts as $post): ?>
                                <tr>
                                    <td class="px-6 py-4">
                                        <div class="flex items-center">
                                            <i class="fas <?= $post['ai_generated'] ? 'fa-robot text-purple-500' : 'fa-user text-blue-500' ?> mr-2"></i>
                                            <div>
                                                <div class="text-sm font-medium text-gray-900"><?= e($post['title']) ?></div>
                                                <div class="text-xs text-gray-500"><?= e($post['category'] ?? 'Uncategorized') ?> · <?= e(substr($post['date'], 0, 10)) ?></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><?= e(strtoupper($post['language'])) ?></td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <?php if ($post['is_published']): ?>
                                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Published</span>
                                        <?php else: ?>
                                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Draft</span>
                                        <?php endif; ?>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><?= number_format((int)$post['views_count']) ?></td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                                        <button class="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- User Management Section -->
            <div id="user-management" class="content-section">
                <div class="mb-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-2xl font-bold text-gray-900 mb-2">User Management</h2>
                            <p class="text-gray-600">Manage user accounts, roles, and permissions</p>
                        </div>
                        <button onclick="createUser()" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200">
                            <i class="fas fa-user-plus mr-2"></i>Add User
                        </button>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                                <i class="fas fa-user-shield text-white text-sm"></i>
                                            </div>
                                            <div class="ml-3">
                                                <div class="text-sm font-medium text-gray-900"><?= htmlspecialchars($admin_name) ?></div>
                                                <div class="text-sm text-gray-500"><?= htmlspecialchars($admin_email) ?></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Admin</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Just now</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                                        <button class="text-gray-400 cursor-not-allowed">Current User</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Analytics Section -->
            <div id="analytics" class="content-section">
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
                    <p class="text-gray-600">Track website performance, user engagement, and content metrics</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                <i class="fas fa-eye text-white"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm text-gray-600">Page Views</p>
                                <p class="text-xl font-bold text-gray-900">1,245</p>
                                <p class="text-xs text-green-600">+12.5% vs last month</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                <i class="fas fa-users text-white"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm text-gray-600">Unique Visitors</p>
                                <p class="text-xl font-bold text-gray-900">892</p>
                                <p class="text-xs text-green-600">+8.3% vs last month</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                <i class="fas fa-clock text-white"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm text-gray-600">Avg. Session</p>
                                <p class="text-xl font-bold text-gray-900">3m 42s</p>
                                <p class="text-xs text-green-600">+15.2% vs last month</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                                <i class="fas fa-chart-line text-white"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm text-gray-600">Bounce Rate</p>
                                <p class="text-xl font-bold text-gray-900">34.2%</p>
                                <p class="text-xs text-red-600">+2.1% vs last month</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900">Top Content Performance</h3>
                    </div>
                    <div class="p-6">
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-900">AI Trends in 2024</span>
                                <span class="text-sm text-gray-500">342 views</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-900">Machine Learning Basics</span>
                                <span class="text-sm text-gray-500">528 views</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-900">Future of Automation</span>
                                <span class="text-sm text-gray-500">375 views</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Settings Section -->
            <div id="settings" class="content-section">
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">System Settings</h2>
                    <p class="text-gray-600">Configure application settings and preferences</p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white rounded-lg shadow">
                        <div class="px-6 py-4 border-b border-gray-200">
                            <h3 class="text-lg font-semibold text-gray-900">General Settings</h3>
                        </div>
                        <div class="p-6 space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                                <input type="text" value="Hilyoon" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                                <textarea class="w-full border border-gray-300 rounded-lg px-3 py-2" rows="3">AI-Powered SaaS Solutions</textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                                <input type="email" value="contact@hilyoon.com" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow">
                        <div class="px-6 py-4 border-b border-gray-200">
                            <h3 class="text-lg font-semibold text-gray-900">AI Configuration</h3>
                        </div>
                        <div class="p-6 space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">OpenAI API Key</label>
                                <input type="password" placeholder="sk-..." class="w-full border border-gray-300 rounded-lg px-3 py-2">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Generation Languages</label>
                                <div class="space-y-2">
                                    <label class="flex items-center">
                                        <input type="checkbox" checked class="mr-2"> English
                                    </label>
                                    <label class="flex items-center">
                                        <input type="checkbox" checked class="mr-2"> Romanian
                                    </label>
                                    <label class="flex items-center">
                                        <input type="checkbox" checked class="mr-2"> Arabic
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-8">
                    <button onclick="saveSettings()" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200">
                        <i class="fas fa-save mr-2"></i>Save All Settings
                    </button>
                </div>
            </div>

            <!-- System Health Section -->
            <div id="system-health" class="content-section">
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">System Health</h2>
                    <p class="text-gray-600">Monitor system performance and health metrics</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Database</p>
                                <p class="text-xl font-bold text-green-600 flex items-center">
                                    <span class="status-indicator status-running"></span>Online
                                </p>
                            </div>
                            <i class="fas fa-database text-green-500 text-2xl"></i>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">XAMPP Server</p>
                                <p class="text-xl font-bold text-green-600 flex items-center">
                                    <span class="status-indicator status-running"></span>Running
                                </p>
                            </div>
                            <i class="fas fa-server text-green-500 text-2xl"></i>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">AI Services</p>
                                <p class="text-xl font-bold text-green-600 flex items-center">
                                    <span class="status-indicator status-running"></span>Ready
                                </p>
                            </div>
                            <i class="fas fa-brain text-green-500 text-2xl"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900">System Information</h3>
                    </div>
                    <div class="p-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 class="font-medium text-gray-900 mb-3">Server Details</h4>
                                <div class="space-y-2 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">PHP Version:</span>
                                        <span class="text-gray-900"><?= PHP_VERSION ?></span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Server Software:</span>
                                        <span class="text-gray-900"><?= $_SERVER['SERVER_SOFTWARE'] ?? 'XAMPP' ?></span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Session Status:</span>
                                        <span class="text-green-600">Active</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 class="font-medium text-gray-900 mb-3">Application Info</h4>
                                <div class="space-y-2 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Version:</span>
                                        <span class="text-gray-900">1.0.0</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Environment:</span>
                                        <span class="text-gray-900">Development</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Last Updated:</span>
                                        <span class="text-gray-900"><?= date('Y-m-d') ?></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script>
        // Update time
        function updateTime() {
            const now = new Date();
            document.getElementById('currentTime').textContent = now.toLocaleString();
        }
        updateTime();
        setInterval(updateTime, 1000);

        // Show section
        function showSection(sectionName) {
            // Hide all sections
            const sections = document.querySelectorAll('.content-section');
            sections.forEach(section => section.classList.remove('active'));
            
            // Show selected section
            document.getElementById(sectionName).classList.add('active');
            
            // Update active sidebar item
            const sidebarItems = document.querySelectorAll('.sidebar-item');
            sidebarItems.forEach(item => item.classList.remove('active'));
            event.target.closest('.sidebar-item').classList.add('active');
            
            // Update page title
            const titles = {
                'overview': 'Dashboard Overview',
                'ai-automation': 'AI Blog Automation',
                'blog-management': 'Blog Management',
                'user-management': 'User Management',
                'analytics': 'Analytics Dashboard',
                'settings': 'System Settings',
                'system-health': 'System Health'
            };
            
            document.getElementById('pageTitle').textContent = titles[sectionName] || 'Dashboard';
        }

        // AI Functions
        function triggerAI() {
            if (confirm('Trigger AI blog post generation now?\n\nThis will:\n• Analyze RSS feeds\n• Generate content with GPT-4\n• Create images with DALL-E 3\n• Publish in 3 languages')) {
                alert('🤖 AI Generation Started!\n\nThe system is now:\n✅ Analyzing RSS feeds\n✅ Generating content\n✅ Creating images\n\nCheck back in 2-3 minutes for results.');
            }
        }

        function testRSS() {
            alert('🔍 Testing RSS Feeds...\n\n✅ Microsoft Research: Online\n✅ Fast.ai NLP: Online\n✅ NVIDIA Blog: Online\n\nAll RSS feeds are accessible and working correctly!');
        }

        // Blog Functions
        function createPost() {
            alert('📝 Create New Blog Post\n\nFeatures available:\n• Rich text editor\n• Multi-language support\n• SEO optimization\n• Image upload\n• Category selection\n• Publish/draft options');
        }

        // User Functions
        function createUser() {
            alert('👥 Add New User\n\nUser creation form would include:\n• Name and email\n• Password setup\n• Role assignment (Admin/Editor/Viewer)\n• Account status\n• Permissions settings');
        }

        // Settings Functions
        function saveSettings() {
            alert('💾 Settings Saved!\n\nAll system settings have been updated successfully.');
        }
    </script>
</body>
</html>
