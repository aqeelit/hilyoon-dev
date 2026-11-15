<?php
require_once __DIR__ . '/../config/database.php';

class User {
    public $id;
    public $email;
    public $password_hash;
    public $name;
    public $role = 'viewer';
    public $avatar;
    public $bio;
    public $is_active = true;
    public $last_login_at;
    public $created_at;
    public $updated_at;

    const PUBLIC_COLUMNS = 'id, email, name, role, avatar, bio, is_active, last_login_at, created_at, updated_at';

    private function db() {
        return getDB();
    }

    private function hydrate(array $row) {
        foreach ($row as $key => $value) {
            if (property_exists($this, $key)) $this->$key = $value;
        }
        $this->id = (int)$this->id;
        $this->is_active = (bool)$this->is_active;
    }

    public function findById($id) {
        $rows = $this->db()->query("SELECT * FROM users WHERE id = ?", [(int)$id]);
        if (!$rows) return false;
        $this->hydrate($rows[0]);
        return true;
    }

    public function findByEmail($email) {
        $rows = $this->db()->query("SELECT * FROM users WHERE email = ?", [$email]);
        if (!$rows) return false;
        $this->hydrate($rows[0]);
        return true;
    }

    public function verifyPassword($password) {
        return $this->password_hash && password_verify($password, $this->password_hash);
    }

    /**
     * Insert a new user. $this->password_hash holds the plain password
     * on entry and is hashed here.
     * @return int|false new user id
     */
    public function create() {
        $hash = password_hash($this->password_hash, PASSWORD_BCRYPT);
        $id = $this->db()->execute(
            "INSERT INTO users (email, password_hash, name, role, avatar, bio, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [$this->email, $hash, $this->name, $this->role, $this->avatar, $this->bio, $this->is_active ? 1 : 0]
        );
        if (!$id) return false;
        $this->password_hash = $hash;
        $this->id = (int)$id;
        return $this->id;
    }

    public function update() {
        return (bool)$this->db()->execute(
            "UPDATE users SET name = ?, role = ?, avatar = ?, bio = ?, is_active = ? WHERE id = ?",
            [$this->name, $this->role, $this->avatar, $this->bio, $this->is_active ? 1 : 0, $this->id]
        );
    }

    public function updatePassword($plain) {
        $this->password_hash = password_hash($plain, PASSWORD_BCRYPT);
        return (bool)$this->db()->execute(
            "UPDATE users SET password_hash = ? WHERE id = ?",
            [$this->password_hash, $this->id]
        );
    }

    public function updateLastLogin() {
        return (bool)$this->db()->execute("UPDATE users SET last_login_at = NOW() WHERE id = ?", [$this->id]);
    }

    /** Soft delete: deactivate the account. */
    public function delete() {
        $this->is_active = false;
        return (bool)$this->db()->execute("UPDATE users SET is_active = 0 WHERE id = ?", [$this->id]);
    }

    public function getAllUsers($limit = 20, $offset = 0) {
        $limit = max(1, (int)$limit);
        $offset = max(0, (int)$offset);
        $rows = $this->db()->query(
            "SELECT " . self::PUBLIC_COLUMNS . " FROM users ORDER BY created_at DESC LIMIT $limit OFFSET $offset"
        );
        foreach ($rows as &$row) {
            $row['id'] = (int)$row['id'];
            $row['is_active'] = (bool)$row['is_active'];
        }
        return $rows;
    }

    public function getUserCount() {
        $rows = $this->db()->query("SELECT COUNT(*) AS count FROM users WHERE is_active = 1");
        return (int)($rows[0]['count'] ?? 0);
    }

    public function toArray() {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'name' => $this->name,
            'role' => $this->role,
            'avatar' => $this->avatar,
            'bio' => $this->bio,
            'is_active' => (bool)$this->is_active,
            'last_login_at' => $this->last_login_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
