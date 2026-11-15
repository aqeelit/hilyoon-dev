<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/auth.php';

class RSSFeedAnalyzer {
    private $db;
    private $feeds = [
        'microsoft' => [
            'url' => 'https://www.microsoft.com/en-us/research/feed/',
            'name' => 'Microsoft Research',
            'category' => 'AI Research'
        ],
        'fast_ai' => [
            'url' => 'https://nlp.fast.ai/feed.xml',
            'name' => 'Fast.ai NLP',
            'category' => 'Machine Learning'
        ],
        'nvidia' => [
            'url' => 'https://feeds.feedburner.com/nvidiablog',
            'name' => 'NVIDIA Blog',
            'category' => 'AI Technology'
        ]
    ];

    public function __construct() {
        $this->db = getDB();
    }

    /**
     * Analyze all RSS feeds and extract trending topics
     * @return array
     */
    public function analyzeFeedsForTrends() {
        $all_items = [];
        $trending_topics = [];
        
        foreach ($this->feeds as $feed_id => $feed_info) {
            try {
                $items = $this->parseFeed($feed_info['url'], $feed_info['name'], $feed_info['category']);
                $all_items = array_merge($all_items, $items);
                
                Logger::info("Parsed {$feed_info['name']}: " . count($items) . " items");
                
            } catch (Exception $e) {
                Logger::error("Failed to parse feed {$feed_info['name']}: " . $e->getMessage());
            }
        }

        // Sort by publish date (newest first)
        usort($all_items, function($a, $b) {
            return strtotime($b['published']) - strtotime($a['published']);
        });

        // Take the most recent items (last 48 hours if available, or top 20)
        $recent_items = array_slice($all_items, 0, 20);
        $cutoff_time = time() - (48 * 3600); // 48 hours ago

        $filtered_items = array_filter($recent_items, function($item) use ($cutoff_time) {
            return strtotime($item['published']) > $cutoff_time;
        });

        // If no recent items, take top 10 anyway
        if (empty($filtered_items)) {
            $filtered_items = array_slice($recent_items, 0, 10);
        }

        // Extract trending topics and keywords
        $trending_topics = $this->extractTrendingTopics($filtered_items);
        
        // Log analysis results
        $this->logAnalysisResults($trending_topics, count($filtered_items));

        return $trending_topics;
    }

    /**
     * Parse individual RSS feed
     * @param string $feed_url
     * @param string $source_name
     * @param string $category
     * @return array
     */
    private function parseFeed($feed_url, $source_name, $category) {
        $items = [];
        
        // Set user agent to avoid blocking
        $context = stream_context_create([
            'http' => [
                'user_agent' => 'Mozilla/5.0 (compatible; Hilyoon RSS Analyzer/1.0)',
                'timeout' => 30
            ]
        ]);

        $rss_content = file_get_contents($feed_url, false, $context);
        
        if (!$rss_content) {
            throw new Exception("Failed to fetch RSS feed from {$feed_url}");
        }

        // Parse XML
        libxml_use_internal_errors(true);
        $xml = simplexml_load_string($rss_content);
        
        if (!$xml) {
            $errors = libxml_get_errors();
            throw new Exception("Failed to parse RSS XML: " . implode(', ', array_column($errors, 'message')));
        }

        // Handle different RSS formats
        if (isset($xml->channel->item)) {
            // RSS 2.0 format
            foreach ($xml->channel->item as $item) {
                $items[] = $this->extractItemData($item, $source_name, $category);
            }
        } elseif (isset($xml->item)) {
            // RSS 1.0 format
            foreach ($xml->item as $item) {
                $items[] = $this->extractItemData($item, $source_name, $category);
            }
        } elseif (isset($xml->entry)) {
            // Atom format
            foreach ($xml->entry as $entry) {
                $items[] = $this->extractAtomData($entry, $source_name, $category);
            }
        }

        return $items;
    }

    /**
     * Extract data from RSS item
     * @param SimpleXMLElement $item
     * @param string $source_name
     * @param string $category
     * @return array
     */
    private function extractItemData($item, $source_name, $category) {
        return [
            'title' => $this->cleanText((string)$item->title),
            'description' => $this->cleanText((string)$item->description),
            'link' => (string)$item->link,
            'published' => $this->normalizeDate((string)$item->pubDate),
            'source' => $source_name,
            'category' => $category,
            'keywords' => $this->extractKeywords((string)$item->title . ' ' . (string)$item->description)
        ];
    }

    /**
     * Extract data from Atom entry
     * @param SimpleXMLElement $entry
     * @param string $source_name
     * @param string $category
     * @return array
     */
    private function extractAtomData($entry, $source_name, $category) {
        $summary = isset($entry->summary) ? (string)$entry->summary : (string)$entry->content;
        
        return [
            'title' => $this->cleanText((string)$entry->title),
            'description' => $this->cleanText($summary),
            'link' => (string)$entry->link['href'],
            'published' => $this->normalizeDate((string)$entry->published),
            'source' => $source_name,
            'category' => $category,
            'keywords' => $this->extractKeywords((string)$entry->title . ' ' . $summary)
        ];
    }

    /**
     * Extract trending topics from items
     * @param array $items
     * @return array
     */
    private function extractTrendingTopics($items) {
        $topics = [];
        $keyword_frequency = [];
        
        foreach ($items as $item) {
            // Weight newer items higher
            $age_hours = (time() - strtotime($item['published'])) / 3600;
            $weight = max(1, 48 - $age_hours) / 48; // Higher weight for newer items
            
            foreach ($item['keywords'] as $keyword) {
                if (!isset($keyword_frequency[$keyword])) {
                    $keyword_frequency[$keyword] = 0;
                }
                $keyword_frequency[$keyword] += $weight;
            }
            
            $topics[] = [
                'title' => $item['title'],
                'description' => $item['description'],
                'source' => $item['source'],
                'category' => $item['category'],
                'link' => $item['link'],
                'published' => $item['published'],
                'keywords' => $item['keywords'],
                'trend_score' => $weight * count($item['keywords'])
            ];
        }

        // Sort topics by trend score
        usort($topics, function($a, $b) {
            return $b['trend_score'] - $a['trend_score'];
        });

        // Get top trending keywords
        arsort($keyword_frequency);
        $trending_keywords = array_slice(array_keys($keyword_frequency), 0, 20);

        return [
            'topics' => array_slice($topics, 0, 10), // Top 10 trending topics
            'keywords' => $trending_keywords,
            'analysis_time' => date('Y-m-d H:i:s'),
            'total_items' => count($items)
        ];
    }

    /**
     * Extract keywords from text
     * @param string $text
     * @return array
     */
    private function extractKeywords($text) {
        $text = strtolower($this->cleanText($text));
        
        // Remove common stop words
        $stop_words = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an', 'as', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'shall', 'is', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'our', 'their'];
        
        // Extract words (3+ characters)
        preg_match_all('/\b\w{3,}\b/', $text, $matches);
        $words = $matches[0];
        
        // Filter out stop words and common tech terms
        $keywords = array_filter($words, function($word) use ($stop_words) {
            return !in_array($word, $stop_words) && strlen($word) >= 3;
        });

        // Focus on AI/ML/Tech related terms
        $tech_keywords = array_filter($keywords, function($word) {
            $tech_terms = ['ai', 'artificial', 'intelligence', 'machine', 'learning', 'deep', 'neural', 'network', 'algorithm', 'data', 'science', 'technology', 'research', 'model', 'automation', 'computer', 'vision', 'nlp', 'processing', 'language', 'microsoft', 'nvidia', 'gpu', 'training', 'inference', 'transformer', 'llm', 'generative'];
            
            foreach ($tech_terms as $tech) {
                if (strpos($word, $tech) !== false || strpos($tech, $word) !== false) {
                    return true;
                }
            }
            return false;
        });

        // Return mix of tech keywords and general keywords
        return array_unique(array_merge(array_values($tech_keywords), array_slice(array_values($keywords), 0, 10)));
    }

    /**
     * Clean and normalize text
     * @param string $text
     * @return string
     */
    private function cleanText($text) {
        // Remove HTML tags
        $text = strip_tags($text);
        
        // Decode HTML entities
        $text = html_entity_decode($text, ENT_QUOTES, 'UTF-8');
        
        // Clean up whitespace
        $text = preg_replace('/\s+/', ' ', $text);
        
        return trim($text);
    }

    /**
     * Normalize date format
     * @param string $date
     * @return string
     */
    private function normalizeDate($date) {
        $timestamp = strtotime($date);
        return $timestamp ? date('Y-m-d H:i:s', $timestamp) : date('Y-m-d H:i:s');
    }

    /**
     * Log analysis results
     * @param array $trending_topics
     * @param int $item_count
     */
    private function logAnalysisResults($trending_topics, $item_count) {
        try {
            $query = "INSERT INTO ai_generation_log (type, prompt, response, status, created_at) VALUES (?, ?, ?, ?, NOW())";
            
            $analysis_summary = [
                'total_items_analyzed' => $item_count,
                'trending_topics_count' => count($trending_topics['topics']),
                'top_keywords' => array_slice($trending_topics['keywords'], 0, 10),
                'sources_analyzed' => array_keys($this->feeds)
            ];

            $this->db->execute($query, [
                'rss_analysis',
                'RSS Feed Analysis for AI Blog Generation',
                json_encode($analysis_summary),
                'success'
            ]);

            Logger::info("RSS analysis completed: {$item_count} items, " . count($trending_topics['topics']) . " trending topics");
            
        } catch (Exception $e) {
            Logger::error("Failed to log RSS analysis: " . $e->getMessage());
        }
    }

    /**
     * Get cached analysis (if recent)
     * @param int $max_age_hours
     * @return array|null
     */
    public function getCachedAnalysis($max_age_hours = 6) {
        try {
            $query = "SELECT response, created_at FROM ai_generation_log 
                     WHERE type = 'rss_analysis' AND status = 'success' 
                     AND created_at > DATE_SUB(NOW(), INTERVAL ? HOUR) 
                     ORDER BY created_at DESC LIMIT 1";
            
            $result = $this->db->query($query, [$max_age_hours]);
            
            if (!empty($result)) {
                return json_decode($result[0]['response'], true);
            }
            
        } catch (Exception $e) {
            Logger::error("Failed to get cached analysis: " . $e->getMessage());
        }
        
        return null;
    }
}
?>
