<?php
/**
 * Create an admin user, or reset an existing user's password and make them admin.
 *
 * Usage (from the project root):
 *   php backend/scripts/create-admin.php <email> "<Full Name>"
 *
 * The password is read from the HILYOON_ADMIN_PASSWORD environment variable if set,
 * otherwise you are prompted for it. Passwords need 8+ characters with a letter and a number.
 */
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/../utils/auth.php';
require_once __DIR__ . '/../models/User.php';

[$script, $email, $name] = array_pad($argv, 3, null);
if (!$email || !Validator::validateEmail($email)) {
    fwrite(STDERR, "Usage: php backend/scripts/create-admin.php <email> \"<Full Name>\"\n");
    exit(1);
}

$password = getenv('HILYOON_ADMIN_PASSWORD') ?: null;
if ($password === null) {
    fwrite(STDOUT, 'Password: ');
    $password = trim((string)fgets(STDIN));
}
$errors = Validator::validatePassword($password);
if ($errors) {
    fwrite(STDERR, 'Password ' . implode(', ', $errors) . "\n");
    exit(1);
}

$user = new User();
if ($user->findByEmail($email)) {
    $user->role = 'admin';
    $user->is_active = true;
    if ($name) $user->name = $name;
    $user->update();
    $user->updatePassword($password);
    echo "Updated {$email}: password reset, role admin, active.\n";
} else {
    $user->email = $email;
    $user->name = $name ?: 'Administrator';
    $user->role = 'admin';
    $user->is_active = true;
    $user->password_hash = $password; // hashed in create()
    $id = $user->create();
    echo $id ? "Created admin {$email} (id {$id}).\n" : "Failed to create admin.\n";
    exit($id ? 0 : 1);
}
