<?php
// Database Configuration for Hilyoon SaaS Platform
class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $conn;

    public function __construct() {
        // Load environment variables or set defaults
        $this->host = $_ENV['DB_HOST'] ?? 'localhost';
        $this->db_name = $_ENV['DB_NAME'] ?? 'hilyoon_saas';
        $this->username = $_ENV['DB_USER'] ?? 'root';
        $this->password = $_ENV['DB_PASS'] ?? '';
    }

    /**
     * Get database connection
     * @return PDO|null
     */
    public function getConnection() {
        $this->conn = null;

        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4";
            
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
            ];

            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
            
        } catch(PDOException $exception) {
            error_log("Database connection error: " . $exception->getMessage());
            throw new Exception("Database connection failed");
        }

        return $this->conn;
    }

    /**
     * Test database connection
     * @return bool
     */
    public function testConnection() {
        try {
            $conn = $this->getConnection();
            return $conn !== null;
        } catch(Exception $e) {
            return false;
        }
    }

    /**
     * Close database connection
     */
    public function closeConnection() {
        $this->conn = null;
    }

    /**
     * Execute a query and return results
     * @param string $query
     * @param array $params
     * @return array
     */
    public function query($query, $params = []) {
        try {
            $conn = $this->getConnection();
            $stmt = $conn->prepare($query);
            $stmt->execute($params);
            return $stmt->fetchAll();
        } catch(Exception $e) {
            error_log("Query error: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Execute an insert/update/delete query
     * @param string $query
     * @param array $params
     * @return bool|string
     */
    public function execute($query, $params = []) {
        try {
            $conn = $this->getConnection();
            $stmt = $conn->prepare($query);
            $result = $stmt->execute($params);
            
            // Return last insert ID for INSERT queries
            if (stripos($query, 'INSERT') === 0) {
                return $conn->lastInsertId();
            }
            
            return $result;
        } catch(Exception $e) {
            error_log("Execute error: " . $e->getMessage());
            throw $e;
        }
    }
}

// Global database instance
$database = new Database();

/**
 * Get database instance
 * @return Database
 */
function getDB() {
    global $database;
    return $database;
}

?>
