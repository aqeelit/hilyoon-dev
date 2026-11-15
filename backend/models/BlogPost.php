<?php
require_once __DIR__ . '/../config/database.php';

/**
 * Blog post model for the `blog_posts` table.
 *
 * Schema notes: posts are per-language rows (`language`), publication state is
 * the `is_published` flag (exposed to the API as status 'published'/'draft'),
 * and the author is stored inline (`author_name`, `author_email`).
 */
class BlogPost {
    public $id;
    public $title;
    public $slug;
    public $excerpt;
    public $content;
    public $meta_title;
    public $meta_description;
    public $meta_keywords;
    public $featured_image;
    public $author_name;
    public $author_email;
    public $category_id;
    public $tags;
    public $language;
    public $is_published;
    public $is_featured;
    public $read_time;
    public $views_count;
    public $published_at;
    public $ai_generated;
    public $created_at;
    public $updated_at;

    const LIST_COLUMNS = "p.id, p.title, p.slug, p.excerpt, p.featured_image, p.language, p.category_id,
        p.is_published, p.is_featured, p.read_time, p.views_count, p.published_at, p.ai_generated,
        p.created_at, p.updated_at,
        CASE WHEN p.is_published = 1 THEN 'published' ELSE 'draft' END AS status,
        p.author_name, p.author_email, NULL AS author_avatar,
        c.name AS category_name, c.slug AS category_slug, c.color AS category_color";

    private function db() {
        return getDB();
    }

    /** Build WHERE clause for locale + status ('published', 'draft', 'all'). */
    private function baseFilter($locale, $status, array &$params) {
        $where = [];
        if ($locale) {
            $where[] = 'p.language = ?';
            $params[] = $locale;
        }
        if ($status === 'published') {
            $where[] = 'p.is_published = 1';
        } elseif ($status === 'draft') {
            $where[] = 'p.is_published = 0';
        }
        return $where;
    }

    private static function castRow(array $row) {
        foreach (['id', 'category_id', 'read_time', 'views_count'] as $k) {
            if (array_key_exists($k, $row) && $row[$k] !== null) $row[$k] = (int)$row[$k];
        }
        foreach (['is_published', 'is_featured', 'ai_generated'] as $k) {
            if (array_key_exists($k, $row)) $row[$k] = (bool)$row[$k];
        }
        return $row;
    }

    public function getAllPosts($locale = 'en', $limit = 10, $offset = 0, $status = 'published', $category = null, $search = null) {
        $params = [];
        $where = $this->baseFilter($locale, $status, $params);

        if ($category) {
            $where[] = 'c.slug = ?';
            $params[] = $category;
        }
        if ($search) {
            $where[] = '(p.title LIKE ? OR p.excerpt LIKE ? OR p.content LIKE ?)';
            $like = '%' . $search . '%';
            array_push($params, $like, $like, $like);
        }

        $limit = max(1, (int)$limit);
        $offset = max(0, (int)$offset);
        $sql = "SELECT " . self::LIST_COLUMNS . "
                FROM blog_posts p
                LEFT JOIN blog_categories c ON p.category_id = c.id
                " . ($where ? 'WHERE ' . implode(' AND ', $where) : '') . "
                ORDER BY COALESCE(p.published_at, p.created_at) DESC
                LIMIT $limit OFFSET $offset";

        return array_map([self::class, 'castRow'], $this->db()->query($sql, $params));
    }

    public function getFeaturedPosts($locale = 'en', $limit = 5) {
        $limit = max(1, (int)$limit);
        $sql = "SELECT " . self::LIST_COLUMNS . "
                FROM blog_posts p
                LEFT JOIN blog_categories c ON p.category_id = c.id
                WHERE p.language = ? AND p.is_published = 1 AND p.is_featured = 1
                ORDER BY p.published_at DESC
                LIMIT $limit";
        return array_map([self::class, 'castRow'], $this->db()->query($sql, [$locale]));
    }

    public function getPostCount($locale = 'en', $status = 'published', $category = null, $search = null) {
        $params = [];
        $where = $this->baseFilter($locale, $status, $params);
        $join = '';
        if ($category) {
            $join = ' LEFT JOIN blog_categories c ON p.category_id = c.id';
            $where[] = 'c.slug = ?';
            $params[] = $category;
        }
        if ($search) {
            $where[] = '(p.title LIKE ? OR p.excerpt LIKE ? OR p.content LIKE ?)';
            $like = '%' . $search . '%';
            array_push($params, $like, $like, $like);
        }
        $sql = "SELECT COUNT(*) AS count FROM blog_posts p" . $join . ($where ? ' WHERE ' . implode(' AND ', $where) : '');
        $rows = $this->db()->query($sql, $params);
        return (int)($rows[0]['count'] ?? 0);
    }

    /** Load a published post by slug into this object. */
    public function findBySlug($slug, $locale = 'en') {
        $rows = $this->db()->query(
            "SELECT * FROM blog_posts WHERE slug = ? AND language = ? AND is_published = 1 LIMIT 1",
            [$slug, $locale]
        );
        if (!$rows) return false;
        foreach (self::castRow($rows[0]) as $key => $value) {
            if (property_exists($this, $key)) $this->$key = $value;
        }
        return true;
    }

    public function findById($id) {
        $rows = $this->db()->query("SELECT * FROM blog_posts WHERE id = ?", [(int)$id]);
        if (!$rows) return false;
        foreach (self::castRow($rows[0]) as $key => $value) {
            if (property_exists($this, $key)) $this->$key = $value;
        }
        return true;
    }

    public function incrementViews() {
        return (bool)$this->db()->execute("UPDATE blog_posts SET views_count = views_count + 1 WHERE id = ?", [$this->id]);
    }

    public function getRelatedPosts($category_id, $locale, $exclude_id, $limit = 3) {
        $limit = max(1, (int)$limit);
        $sql = "SELECT p.id, p.title, p.slug, p.excerpt, p.featured_image, p.read_time, p.published_at
                FROM blog_posts p
                WHERE p.category_id = ? AND p.language = ? AND p.id <> ? AND p.is_published = 1
                ORDER BY p.published_at DESC
                LIMIT $limit";
        return array_map([self::class, 'castRow'], $this->db()->query($sql, [$category_id, $locale, $exclude_id]));
    }

    public function toArray() {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'content' => $this->content,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'meta_keywords' => $this->meta_keywords,
            'featured_image' => $this->featured_image,
            'category_id' => $this->category_id,
            'language' => $this->language,
            'status' => $this->is_published ? 'published' : 'draft',
            'is_featured' => (bool)$this->is_featured,
            'read_time' => $this->read_time,
            'views_count' => $this->views_count,
            'published_at' => $this->published_at,
            'ai_generated' => (bool)$this->ai_generated,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
