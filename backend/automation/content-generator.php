<?php
require_once __DIR__ . '/rss-analyzer.php';
require_once __DIR__ . '/../ai/openai-client.php';
require_once __DIR__ . '/../models/BlogPost.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/auth.php';

class ContentGenerator {
    private $rss_analyzer;
    private $openai_client;
    private $blog_post_model;
    private $db;
    private $languages = ['en', 'ro', 'ar'];

    public function __construct() {
        $this->rss_analyzer = new RSSFeedAnalyzer();
        $this->openai_client = new OpenAIClient();
        $this->blog_post_model = new BlogPost();
        $this->db = getDB();
    }

    /**
     * Generate and publish blog posts automatically
     * @param int $posts_to_generate
     * @return array
     */
    public function generateBlogPosts($posts_to_generate = 1) {
        Logger::info("Starting AI blog post generation - target: {$posts_to_generate} posts");

        $results = [
            'success' => 0,
            'failed' => 0,
            'posts' => [],
            'errors' => []
        ];

        try {
            // 1. Analyze RSS feeds for trending topics
            $trending_topics = $this->rss_analyzer->analyzeFeedsForTrends();
            
            if (empty($trending_topics['topics'])) {
                throw new Exception("No trending topics found from RSS feeds");
            }

            Logger::info("Found " . count($trending_topics['topics']) . " trending topics");

            // 2. Filter out topics we've already written about
            $available_topics = $this->filterUnusedTopics($trending_topics['topics']);
            
            if (empty($available_topics)) {
                Logger::warning("No new topics available - all topics already covered");
                
                // Use older topics if no new ones available
                $available_topics = array_slice($trending_topics['topics'], 0, $posts_to_generate);
            }

            // 3. Generate posts for top topics
            $topics_to_use = array_slice($available_topics, 0, $posts_to_generate);

            foreach ($topics_to_use as $topic) {
                try {
                    $post_results = $this->generateMultilingualPost($topic);
                    
                    if ($post_results['success']) {
                        $results['success']++;
                        $results['posts'][] = $post_results;
                        Logger::info("Successfully generated multilingual post: {$topic['title']}");
                    } else {
                        $results['failed']++;
                        $results['errors'][] = $post_results['error'];
                        Logger::error("Failed to generate post: {$topic['title']} - {$post_results['error']}");
                    }

                    // Add delay to avoid rate limiting
                    sleep(2);

                } catch (Exception $e) {
                    $results['failed']++;
                    $results['errors'][] = $e->getMessage();
                    Logger::error("Exception generating post for topic {$topic['title']}: " . $e->getMessage());
                }
            }

            // 4. Log generation summary
            $this->logGenerationSummary($results);

            Logger::info("Blog generation completed - Success: {$results['success']}, Failed: {$results['failed']}");

        } catch (Exception $e) {
            Logger::error("Critical error in blog generation: " . $e->getMessage());
            $results['errors'][] = $e->getMessage();
        }

        return $results;
    }

    /**
     * Generate multilingual blog post for a topic
     * @param array $topic
     * @return array
     */
    private function generateMultilingualPost($topic) {
        $post_data = [];
        $generated_languages = [];
        $image_data = null;

        try {
            // 1. Generate image first (shared across all languages)
            $image_data = $this->openai_client->generateBlogImage(
                $topic['title'], 
                $topic['keywords'], 
                $topic['category']
            );

            if (!$image_data) {
                Logger::warning("Failed to generate image for: {$topic['title']}");
            }

            // 2. Generate content for each language
            foreach ($this->languages as $language) {
                try {
                    $blog_content = $this->openai_client->generateBlogPost($topic, $language);
                    
                    if ($blog_content) {
                        // 3. Save to database
                        $post_id = $this->saveBlogPost($blog_content, $image_data, $language);
                        
                        if ($post_id) {
                            $generated_languages[] = $language;
                            $post_data[$language] = [
                                'id' => $post_id,
                                'title' => $blog_content['title'],
                                'slug' => $blog_content['slug'],
                                'language' => $language
                            ];
                            
                            Logger::info("Saved blog post in {$language}: {$blog_content['title']}");
                        }
                    }

                    // Small delay between languages
                    sleep(1);

                } catch (Exception $e) {
                    Logger::error("Failed to generate {$language} version: " . $e->getMessage());
                }
            }

            // 4. Mark topic as used
            $this->markTopicAsUsed($topic);

            return [
                'success' => !empty($generated_languages),
                'topic' => $topic['title'],
                'languages' => $generated_languages,
                'posts' => $post_data,
                'image' => $image_data,
                'error' => empty($generated_languages) ? 'Failed to generate content in any language' : null
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'topic' => $topic['title'],
                'error' => $e->getMessage(),
                'posts' => $post_data
            ];
        }
    }

    /**
     * Save blog post to database
     * @param array $blog_content
     * @param array|null $image_data
     * @param string $language
     * @return string|false
     */
    private function saveBlogPost($blog_content, $image_data, $language) {
        try {
            // Find or create category
            $category_id = $this->getOrCreateCategory($blog_content['category'], $language);
            
            // Prepare post data
            $post_data = [
                'title' => $blog_content['title'],
                'slug' => $blog_content['slug'] . '-' . $language,
                'excerpt' => $blog_content['excerpt'],
                'content' => $blog_content['content'],
                'featured_image' => $image_data['url'] ?? null,
                'meta_title' => $blog_content['meta_title'] ?? $blog_content['title'],
                'meta_description' => $blog_content['meta_description'] ?? $blog_content['excerpt'],
                'author_name' => 'Hily Teco',
                'author_email' => 'hily.teco@hilyoon.com',
                'category_id' => $category_id,
                'tags' => implode(',', $blog_content['tags'] ?? []),
                'language' => $language,
                'is_published' => true,
                'is_featured' => false,
                'read_time' => $blog_content['read_time'] ?? 5,
                'source_title' => $blog_content['source_title'] ?? '',
                'source_link' => $blog_content['source_link'] ?? '',
                'source_name' => $blog_content['source_name'] ?? '',
                'ai_generated' => true,
                'published_at' => date('Y-m-d H:i:s')
            ];

            return $this->blog_post_model->create($post_data);

        } catch (Exception $e) {
            Logger::error("Failed to save blog post: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get or create blog category
     * @param string $category_name
     * @param string $language
     * @return string
     */
    private function getOrCreateCategory($category_name, $language) {
        try {
            // Try to find existing category
            $query = "SELECT id FROM blog_categories WHERE name = ? AND language = ? LIMIT 1";
            $result = $this->db->query($query, [$category_name, $language]);
            
            if (!empty($result)) {
                return $result[0]['id'];
            }

            // Create new category
            $category_data = [
                'name' => $category_name,
                'slug' => $this->generateSlug($category_name) . '-' . $language,
                'description' => "AI and technology articles about {$category_name}",
                'color' => $this->getCategoryColor($category_name),
                'language' => $language,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ];

            $insert_query = "INSERT INTO blog_categories (name, slug, description, color, language, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)";
            
            $this->db->execute($insert_query, array_values($category_data));
            
            return $this->db->lastInsertId();

        } catch (Exception $e) {
            Logger::error("Failed to get/create category: " . $e->getMessage());
            return '1'; // Default category ID
        }
    }

    /**
     * Get color for category
     * @param string $category_name
     * @return string
     */
    private function getCategoryColor($category_name) {
        $colors = [
            'AI Research' => 'blue',
            'Machine Learning' => 'green',
            'AI Technology' => 'purple',
            'AI Trends' => 'indigo',
            'Automation' => 'orange',
            'Deep Learning' => 'teal',
            'Natural Language Processing' => 'pink',
            'Computer Vision' => 'cyan'
        ];

        return $colors[$category_name] ?? 'gray';
    }

    /**
     * Filter topics we haven't used recently
     * @param array $topics
     * @return array
     */
    private function filterUnusedTopics($topics) {
        $filtered_topics = [];

        foreach ($topics as $topic) {
            // Check if we've used this topic in the last 30 days
            $similar_title_check = "SELECT id FROM blog_posts 
                                  WHERE (title LIKE ? OR source_title LIKE ?) 
                                  AND created_at > DATE_SUB(NOW(), INTERVAL 30 DAY) 
                                  AND ai_generated = 1 
                                  LIMIT 1";

            $title_pattern = '%' . substr($topic['title'], 0, 50) . '%';
            $result = $this->db->query($similar_title_check, [$title_pattern, $title_pattern]);

            if (empty($result)) {
                $filtered_topics[] = $topic;
            }
        }

        return $filtered_topics;
    }

    /**
     * Mark topic as used to avoid duplicates
     * @param array $topic
     */
    private function markTopicAsUsed($topic) {
        try {
            $query = "INSERT INTO ai_used_topics (title, source, link, keywords, created_at) VALUES (?, ?, ?, ?, NOW())";
            
            $this->db->execute($query, [
                $topic['title'],
                $topic['source'],
                $topic['link'],
                implode(',', array_slice($topic['keywords'], 0, 10))
            ]);

        } catch (Exception $e) {
            Logger::warning("Failed to mark topic as used: " . $e->getMessage());
        }
    }

    /**
     * Generate URL slug
     * @param string $text
     * @return string
     */
    private function generateSlug($text) {
        $slug = strtolower($text);
        $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
        $slug = preg_replace('/\s+/', '-', $slug);
        $slug = trim($slug, '-');
        
        return substr($slug, 0, 100);
    }

    /**
     * Log generation summary
     * @param array $results
     */
    private function logGenerationSummary($results) {
        try {
            $summary = [
                'total_attempted' => $results['success'] + $results['failed'],
                'successful' => $results['success'],
                'failed' => $results['failed'],
                'success_rate' => $results['success'] + $results['failed'] > 0 ? 
                    round(($results['success'] / ($results['success'] + $results['failed'])) * 100, 2) : 0,
                'generated_posts' => count($results['posts']),
                'errors' => $results['errors']
            ];

            $query = "INSERT INTO ai_generation_log (type, prompt, response, status, created_at) VALUES (?, ?, ?, ?, NOW())";
            
            $this->db->execute($query, [
                'blog_generation_summary',
                'Automated blog post generation session',
                json_encode($summary),
                $results['success'] > 0 ? 'success' : 'failed'
            ]);

        } catch (Exception $e) {
            Logger::error("Failed to log generation summary: " . $e->getMessage());
        }
    }

    /**
     * Test generation with single topic (for debugging)
     * @param string $language
     * @return array
     */
    public function testGeneration($language = 'en') {
        try {
            // Get trending topics
            $trending_topics = $this->rss_analyzer->analyzeFeedsForTrends();
            
            if (empty($trending_topics['topics'])) {
                return ['error' => 'No trending topics available'];
            }

            // Use first topic
            $topic = $trending_topics['topics'][0];
            
            // Generate content
            $blog_content = $this->openai_client->generateBlogPost($topic, $language);
            
            if (!$blog_content) {
                return ['error' => 'Failed to generate blog content'];
            }

            // Generate image
            $image_data = $this->openai_client->generateBlogImage(
                $topic['title'], 
                $topic['keywords'], 
                $topic['category']
            );

            return [
                'success' => true,
                'topic' => $topic,
                'blog_content' => $blog_content,
                'image_data' => $image_data,
                'language' => $language
            ];

        } catch (Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }

    /**
     * Get generation statistics
     * @param int $days
     * @return array
     */
    public function getGenerationStats($days = 30) {
        try {
            $stats_query = "SELECT 
                COUNT(*) as total_posts,
                COUNT(CASE WHEN ai_generated = 1 THEN 1 END) as ai_generated,
                COUNT(CASE WHEN is_published = 1 THEN 1 END) as published,
                AVG(views_count) as avg_views,
                language,
                DATE(created_at) as date
                FROM blog_posts 
                WHERE created_at > DATE_SUB(NOW(), INTERVAL ? DAY)
                GROUP BY language, DATE(created_at)
                ORDER BY date DESC";

            $results = $this->db->query($stats_query, [$days]);

            $log_query = "SELECT type, status, COUNT(*) as count, AVG(tokens_used) as avg_tokens
                         FROM ai_generation_log 
                         WHERE created_at > DATE_SUB(NOW(), INTERVAL ? DAY)
                         GROUP BY type, status
                         ORDER BY created_at DESC";

            $log_results = $this->db->query($log_query, [$days]);

            return [
                'post_stats' => $results,
                'generation_logs' => $log_results,
                'period_days' => $days
            ];

        } catch (Exception $e) {
            Logger::error("Failed to get generation stats: " . $e->getMessage());
            return ['error' => $e->getMessage()];
        }
    }
}
?>
