<?php
// Environment Configuration for Hilyoon Backend
// Copy this file to config/env.php (git-ignored) and fill in real values.
// Generate secrets with:  php -r "echo bin2hex(random_bytes(32)), PHP_EOL;"

return [
    // Database Configuration
    'DB_HOST' => 'localhost',
    'DB_NAME' => 'hilyoon_saas',
    'DB_USER' => 'root',
    'DB_PASS' => '',
    'DB_PORT' => 3306,

    // JWT Configuration
    // REQUIRED: 64-char random hex. The API refuses to start without it.
    'JWT_SECRET' => '',
    'JWT_EXPIRATION' => 86400, // 24 hours

    // API Configuration
    'API_BASE_URL' => 'http://localhost:8080/api',
    'FRONTEND_URL' => 'http://localhost:3000',
    
    // File Upload Configuration
    'UPLOAD_PATH' => __DIR__ . '/uploads',
    'UPLOAD_MAX_SIZE' => 10485760, // 10MB
    'ALLOWED_FILE_TYPES' => ['jpg', 'jpeg', 'png', 'gif', 'webp'],

    // AI Services Configuration
    'OPENAI_API_KEY' => '',
    'CLAUDE_API_KEY' => '',
    'ENABLE_AI_GENERATION' => false,

    // Email Configuration
    'SMTP_HOST' => '',
    'SMTP_PORT' => 587,
    'SMTP_USERNAME' => '',
    'SMTP_PASSWORD' => '',
    'FROM_EMAIL' => 'noreply@hilyoon.com',
    'FROM_NAME' => 'Hilyoon',

    // Rate Limiting
    'RATE_LIMIT_ENABLED' => true,
    'RATE_LIMIT_MAX_REQUESTS' => 100,
    'RATE_LIMIT_TIME_WINDOW' => 3600, // 1 hour

    // Logging
    'LOG_LEVEL' => 'INFO', // DEBUG, INFO, WARNING, ERROR
    'LOG_FILE' => __DIR__ . '/logs/api.log',

    // Security
    // REQUIRED for HTTP-triggered blog automation (sent as X-Cron-Key header)
    'CRON_SECRET' => '',
    'BCRYPT_ROUNDS' => 12,
    'SESSION_LIFETIME' => 86400, // 24 hours
    'CORS_ORIGINS' => ['http://localhost:3000'],

    // Application
    'APP_NAME' => 'Hilyoon SaaS',
    'APP_VERSION' => '1.0.0',
    'APP_ENV' => 'production', // 'development' enables dev-only pages locally
    'DEBUG' => true,
    'TIMEZONE' => 'UTC',

    // Cache Configuration
    'CACHE_ENABLED' => false,
    'CACHE_TYPE' => 'file', // file, redis, memcached
    'CACHE_TTL' => 3600, // 1 hour

    // Admin Configuration
    'ADMIN_EMAIL' => 'admin@hilyoon.com',
    'ENABLE_USER_REGISTRATION' => false,
    'REQUIRE_EMAIL_VERIFICATION' => false,

    // SEO and Meta
    'SITE_NAME' => 'Hilyoon',
    'SITE_DESCRIPTION' => 'AI-Powered SaaS Solutions',
    'SITE_URL' => 'https://hilyoon.com',
    'SITE_LOGO' => '/assets/logo.png',

    // Analytics
    'GOOGLE_ANALYTICS_ID' => '',
    'ENABLE_ANALYTICS' => true,
    'TRACK_PAGE_VIEWS' => true,

    // Backup Configuration
    'BACKUP_ENABLED' => false,
    'BACKUP_SCHEDULE' => 'daily',
    'BACKUP_RETENTION_DAYS' => 30,
];
?>
