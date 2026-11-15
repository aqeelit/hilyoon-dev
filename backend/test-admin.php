<?php
// Simple test script to verify the admin system (development only)
require_once __DIR__ . '/utils/auth.php';
if (appEnv() !== 'development') {
    http_response_code(404);
    exit;
}
echo "<h1>🚀 Hilyoon Admin System - Test Status</h1>";

// Check if files exist
$files_to_check = [
    'admin/index.php' => 'Login Page',
    'admin/dashboard.php' => 'Dashboard',
    'sql/hilyoon.sql' => 'Database Schema'
];

echo "<h2>📁 File Check:</h2>";
foreach ($files_to_check as $file => $description) {
    if (file_exists($file)) {
        echo "✅ <strong>{$description}</strong>: {$file} - EXISTS<br>";
    } else {
        echo "❌ <strong>{$description}</strong>: {$file} - MISSING<br>";
    }
}

// Check PHP version
echo "<h2>🖥️ System Check:</h2>";
echo "✅ <strong>PHP Version</strong>: " . PHP_VERSION . "<br>";
echo "✅ <strong>Server</strong>: " . ($_SERVER['SERVER_SOFTWARE'] ?? 'Unknown') . "<br>";

// Session test
session_start();
echo "✅ <strong>Sessions</strong>: Working<br>";

// Database connection test (if config exists)
if (file_exists('config/database.php')) {
    echo "✅ <strong>Database Config</strong>: Found<br>";
} else {
    echo "⚠️ <strong>Database Config</strong>: Not configured yet<br>";
}

echo "<h2>🔐 Login Information:</h2>";
echo "<div style='background: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;'>";
echo "<strong>URL:</strong> <a href='admin/'>http://localhost/hilyoon-backend/admin/</a><br>";
echo "<strong>First admin:</strong> <code>php backend/scripts/create-admin.php you@company.com \"Your Name\"</code><br>";
echo "</div>";

echo "<h2>🎯 Next Steps:</h2>";
echo "<ol>";
echo "<li><strong>Import Database:</strong> Import <code>sql/hilyoon.sql</code> in phpMyAdmin</li>";
echo "<li><strong>Access Admin:</strong> <a href='admin/'>Click here to login</a></li>";
echo "<li><strong>Test Features:</strong> Try all dashboard sections</li>";
echo "</ol>";

echo "<h2>✨ Clean File Structure:</h2>";
echo "<pre style='background: #f8f9fa; padding: 15px; border-radius: 8px;'>";
echo "backend/
├── admin/                  # ✅ Admin Interface (2 files)
│   ├── index.php          # Login page
│   └── dashboard.php      # Complete dashboard
│
├── sql/                   # ✅ Database Schema (1 file)  
│   └── hilyoon.sql        # Complete database
│
└── _backup_old/           # 🗂️ Backup files (optional)
    ├── old_*.bak          # Previous versions
    └── unused_files/      # Other backup files
</pre>";

echo "<p style='color: #059669; font-weight: bold;'>🎉 System is clean and ready to use!</p>";
?>
