<?php
require_once __DIR__ . '/../../utils/auth.php';

handleCORS();

// Tokens are stateless; the client discards its token.
APIResponse::success(null, 'Logged out successfully');
