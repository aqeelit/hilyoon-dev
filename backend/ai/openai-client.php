<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/auth.php';

class OpenAIClient {
    private $api_key;
    private $api_base = 'https://api.openai.com/v1';
    private $db;

    public function __construct() {
        $this->api_key = (string)config('OPENAI_API_KEY', '');
        $this->db = getDB();
    }

    /**
     * Generate professional blog post content from trending topic
     * @param array $topic_data
     * @param string $language
     * @return array|false
     */
    public function generateBlogPost($topic_data, $language = 'en') {
        $system_prompt = $this->getBlogWritingPrompt($language);
        $user_prompt = $this->createUserPrompt($topic_data, $language);

        try {
            $response = $this->callOpenAI([
                'model' => 'gpt-4-turbo-preview',
                'messages' => [
                    ['role' => 'system', 'content' => $system_prompt],
                    ['role' => 'user', 'content' => $user_prompt]
                ],
                'max_tokens' => 2000,
                'temperature' => 0.7,
                'top_p' => 0.9
            ], '/chat/completions');

            if ($response && isset($response['choices'][0]['message']['content'])) {
                $content = $response['choices'][0]['message']['content'];
                $blog_post = $this->parseBlogPostContent($content, $topic_data, $language);
                
                // Log successful generation
                $this->logGeneration('blog_post', $user_prompt, $content, 'success', 
                                   $response['usage']['total_tokens'] ?? 0);

                return $blog_post;
            }

        } catch (Exception $e) {
            Logger::error("OpenAI blog generation failed: " . $e->getMessage());
            $this->logGeneration('blog_post', $user_prompt, null, 'failed', 0, $e->getMessage());
        }

        return false;
    }

    /**
     * Generate professional blog post image with DALL-E 3
     * @param string $title
     * @param array $keywords
     * @param string $category
     * @return array|false
     */
    public function generateBlogImage($title, $keywords, $category) {
        $image_prompt = $this->createImagePrompt($title, $keywords, $category);

        try {
            $response = $this->callOpenAI([
                'model' => 'dall-e-3',
                'prompt' => $image_prompt,
                'n' => 1,
                'size' => '1792x1024', // Professional blog header size
                'quality' => 'hd',
                'style' => 'natural'
            ], '/images/generations');

            if ($response && isset($response['data'][0]['url'])) {
                $image_url = $response['data'][0]['url'];
                $revised_prompt = $response['data'][0]['revised_prompt'] ?? $image_prompt;
                
                // Download and save image
                $image_data = $this->downloadAndSaveImage($image_url, $title);
                
                if ($image_data) {
                    // Log successful generation
                    $this->logGeneration('blog_image', $image_prompt, $image_url, 'success', 0);
                    
                    return [
                        'url' => $image_data['url'],
                        'path' => $image_data['path'],
                        'prompt' => $revised_prompt,
                        'original_prompt' => $image_prompt
                    ];
                }
            }

        } catch (Exception $e) {
            Logger::error("OpenAI image generation failed: " . $e->getMessage());
            $this->logGeneration('blog_image', $image_prompt, null, 'failed', 0, $e->getMessage());
        }

        return false;
    }

    /**
     * Create system prompt for blog writing
     * @param string $language
     * @return string
     */
    private function getBlogWritingPrompt($language) {
        $prompts = [
            'en' => "You are Hily Teco, a professional AI and technology writer for Hilyoon, a cutting-edge SaaS platform. Your expertise includes artificial intelligence, machine learning, automation, and emerging technologies.

WRITING STYLE:
- Professional yet accessible tone
- Engaging and informative content
- SEO-optimized with natural keyword integration
- Clear structure with actionable insights
- Forward-thinking perspective on technology trends

CONTENT REQUIREMENTS:
- Write original, unique content (never copy source material)
- Focus on practical implications and business value
- Include technical depth without overwhelming non-experts
- Add your expert analysis and predictions
- Maintain consistent brand voice for Hilyoon

OUTPUT FORMAT:
Return a JSON object with these fields:
{
  \"title\": \"Compelling, SEO-friendly title (50-60 characters)\",
  \"excerpt\": \"Engaging summary (150-160 characters)\",
  \"content\": \"Full article content (1200-1500 words, HTML formatted with <p>, <h2>, <h3>, <ul>, <li> tags)\",
  \"meta_title\": \"SEO meta title (50-60 characters)\",
  \"meta_description\": \"SEO meta description (150-160 characters)\",
  \"tags\": [\"tag1\", \"tag2\", \"tag3\", \"tag4\", \"tag5\"],
  \"category\": \"Primary category (AI Trends, Machine Learning, Automation, etc.)\",
  \"read_time\": 7
}",
            
            'ro' => "Ești Hily Teco, un scriitor profesionist în domeniul AI și tehnologiei pentru Hilyoon, o platformă SaaS de vârf. Expertiza ta include inteligența artificială, învățarea automată, automatizarea și tehnologiile emergente.

STILUL DE SCRIERE:
- Ton profesional dar accesibil
- Conținut captivant și informativ
- Optimizat SEO cu integrarea naturală a cuvintelor cheie
- Structură clară cu perspective acționabile
- Perspectivă progresistă asupra tendințelor tehnologice

CERINȚE PENTRU CONȚINUT:
- Scrie conținut original și unic (niciodată să nu copiezi materialul sursă)
- Concentrează-te pe implicațiile practice și valoarea comercială
- Include profunzime tehnică fără să îi copleșești pe neexperți
- Adaugă analiza ta de expert și predicții
- Menține o voce de brand consistentă pentru Hilyoon

FORMAT DE IEȘIRE:
Returnează un obiect JSON cu aceste câmpuri:
{
  \"title\": \"Titlu convingător, SEO-friendly (50-60 caractere)\",
  \"excerpt\": \"Rezumat captivant (150-160 caractere)\",
  \"content\": \"Conținutul complet al articolului (1200-1500 cuvinte, formatat HTML cu <p>, <h2>, <h3>, <ul>, <li>)\",
  \"meta_title\": \"Titlul meta SEO (50-60 caractere)\",
  \"meta_description\": \"Descrierea meta SEO (150-160 caractere)\",
  \"tags\": [\"tag1\", \"tag2\", \"tag3\", \"tag4\", \"tag5\"],
  \"category\": \"Categoria principală (Tendințe AI, Machine Learning, Automatizare, etc.)\",
  \"read_time\": 7
}",

            'ar' => "أنت هيلي تيكو، كاتب محترف في مجال الذكاء الاصطناعي والتكنولوجيا لمنصة Hilyoon، منصة SaaS متطورة. خبرتك تشمل الذكاء الاصطناعي، والتعلم الآلي، والأتمتة، والتقنيات الناشئة.

أسلوب الكتابة:
- نبرة مهنية ولكن مفهومة
- محتوى جذاب ومفيد
- محسن لمحركات البحث مع تكامل طبيعي للكلمات المفتاحية
- هيكل واضح مع رؤى قابلة للتطبيق
- منظور تقدمي حول اتجاهات التكنولوجيا

متطلبات المحتوى:
- اكتب محتوى أصلي وفريد (لا تنسخ أبداً المواد المصدرية)
- ركز على التطبيقات العملية والقيمة التجارية
- أدرج العمق التقني دون إرباك غير المتخصصين
- أضف تحليلك الخبير والتوقعات
- حافظ على صوت العلامة التجارية المتسق لـ Hilyoon

تنسيق الإخراج:
أرجع كائن JSON بهذه الحقول:
{
  \"title\": \"عنوان جذاب، محسن لمحركات البحث (50-60 حرف)\",
  \"excerpt\": \"ملخص جذاب (150-160 حرف)\",
  \"content\": \"محتوى المقال الكامل (1200-1500 كلمة، مُنسق بـ HTML مع علامات <p>, <h2>, <h3>, <ul>, <li>)\",
  \"meta_title\": \"عنوان تحسين محركات البحث (50-60 حرف)\",
  \"meta_description\": \"وصف تحسين محركات البحث (150-160 حرف)\",
  \"tags\": [\"تاغ1\", \"تاغ2\", \"تاغ3\", \"تاغ4\", \"تاغ5\"],
  \"category\": \"الفئة الرئيسية (اتجاهات الذكاء الاصطناعي، التعلم الآلي، الأتمتة، إلخ)\",
  \"read_time\": 7
}"
        ];

        return $prompts[$language] ?? $prompts['en'];
    }

    /**
     * Create user prompt for blog generation
     * @param array $topic_data
     * @param string $language
     * @return string
     */
    private function createUserPrompt($topic_data, $language) {
        $source_info = "SOURCE: {$topic_data['source']} - {$topic_data['category']}\n";
        $source_info .= "ORIGINAL TITLE: {$topic_data['title']}\n";
        $source_info .= "DESCRIPTION: " . substr($topic_data['description'], 0, 500) . "\n";
        $source_info .= "KEYWORDS: " . implode(', ', array_slice($topic_data['keywords'], 0, 10)) . "\n";
        $source_info .= "PUBLICATION DATE: {$topic_data['published']}\n\n";

        $prompts = [
            'en' => $source_info . "Create a professional blog post based on this trending topic. DO NOT copy the original content - instead, provide your expert analysis and insights on this technology trend. Focus on:\n\n1. What this development means for businesses and developers\n2. Practical applications and real-world impact\n3. Future implications and predictions\n4. Actionable insights for readers\n\nWrite an engaging, SEO-optimized article that establishes Hilyoon as a thought leader in AI and technology.",

            'ro' => $source_info . "Creează o postare profesională pe blog bazată pe acest subiect în tendință. NU copia conținutul original - în schimb, oferă analiza ta de expert și perspective asupra acestei tendințe tehnologice. Concentrează-te pe:\n\n1. Ce înseamnă această dezvoltare pentru afaceri și dezvoltatori\n2. Aplicații practice și impact în lumea reală\n3. Implicații viitoare și predicții\n4. Perspective acționabile pentru cititori\n\nScrie un articol captivant, optimizat SEO, care stabilește Hilyoon ca lider de opinie în AI și tehnologie.",

            'ar' => $source_info . "أنشئ مقالة مدونة مهنية بناءً على هذا الموضوع الرائج. لا تنسخ المحتوى الأصلي - بدلاً من ذلك، قدم تحليلك الخبير ورؤاك حول هذا الاتجاه التقني. ركز على:\n\n1. ما تعنيه هذه التطورات للشركات والمطورين\n2. التطبيقات العملية والتأثير في العالم الحقيقي\n3. التداعيات المستقبلية والتنبؤات\n4. الرؤى القابلة للتطبيق للقراء\n\nاكتب مقالاً جذاباً، محسناً لمحركات البحث، يرسخ Hilyoon كرائد فكري في الذكاء الاصطناعي والتكنولوجيا."
        ];

        return $prompts[$language] ?? $prompts['en'];
    }

    /**
     * Create image generation prompt
     * @param string $title
     * @param array $keywords
     * @param string $category
     * @return string
     */
    private function createImagePrompt($title, $keywords, $category) {
        $tech_keywords = implode(', ', array_slice($keywords, 0, 5));
        
        return "Create a professional, modern blog header image for an article titled '{$title}'. The image should be suitable for a technology and AI blog. Style: Clean, modern, professional with a tech aesthetic. Color palette: Blues, purples, and teals with white accents. Include abstract representations of: {$tech_keywords}. The image should convey innovation, technology, and professionalism. No text overlay needed. Aspect ratio: 16:9 for blog header. High quality, publication-ready image.";
    }

    /**
     * Parse blog post content from OpenAI response
     * @param string $content
     * @param array $topic_data
     * @param string $language
     * @return array
     */
    private function parseBlogPostContent($content, $topic_data, $language) {
        try {
            // Try to parse JSON response
            $parsed = json_decode($content, true);
            
            if ($parsed && isset($parsed['title']) && isset($parsed['content'])) {
                return array_merge($parsed, [
                    'author_name' => 'Hily Teco',
                    'author_email' => 'hily.teco@hilyoon.com',
                    'source_title' => $topic_data['title'],
                    'source_link' => $topic_data['link'],
                    'source_name' => $topic_data['source'],
                    'language' => $language,
                    'generated_at' => date('Y-m-d H:i:s'),
                    'slug' => $this->generateSlug($parsed['title'])
                ]);
            }
        } catch (Exception $e) {
            Logger::warning("Failed to parse JSON blog content: " . $e->getMessage());
        }

        // Fallback: extract content manually
        return $this->extractBlogContentManually($content, $topic_data, $language);
    }

    /**
     * Extract blog content manually if JSON parsing fails
     * @param string $content
     * @param array $topic_data
     * @param string $language
     * @return array
     */
    private function extractBlogContentManually($content, $topic_data, $language) {
        $lines = explode("\n", $content);
        $title = $topic_data['title'];
        $excerpt = substr($topic_data['description'], 0, 160);
        
        // Try to find title in content
        foreach ($lines as $line) {
            $line = trim($line);
            if (strlen($line) > 10 && strlen($line) < 100 && !strpos($line, ':')) {
                $title = $line;
                break;
            }
        }

        return [
            'title' => $title,
            'excerpt' => $excerpt,
            'content' => $content,
            'meta_title' => substr($title, 0, 60),
            'meta_description' => $excerpt,
            'tags' => array_slice($topic_data['keywords'], 0, 5),
            'category' => $topic_data['category'],
            'read_time' => max(3, min(10, round(str_word_count(strip_tags($content)) / 200))),
            'author_name' => 'Hily Teco',
            'author_email' => 'hily.teco@hilyoon.com',
            'source_title' => $topic_data['title'],
            'source_link' => $topic_data['link'],
            'source_name' => $topic_data['source'],
            'language' => $language,
            'generated_at' => date('Y-m-d H:i:s'),
            'slug' => $this->generateSlug($title)
        ];
    }

    /**
     * Generate URL slug from title
     * @param string $title
     * @return string
     */
    private function generateSlug($title) {
        $slug = strtolower($title);
        $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
        $slug = preg_replace('/\s+/', '-', $slug);
        $slug = trim($slug, '-');
        
        return substr($slug, 0, 100);
    }

    /**
     * Download and save generated image
     * @param string $image_url
     * @param string $title
     * @return array|false
     */
    private function downloadAndSaveImage($image_url, $title) {
        try {
            $image_data = file_get_contents($image_url);
            
            if (!$image_data) {
                return false;
            }

            // Create images directory if it doesn't exist
            $images_dir = __DIR__ . '/../public/images/blog';
            if (!is_dir($images_dir)) {
                mkdir($images_dir, 0755, true);
            }

            $filename = $this->generateSlug($title) . '-' . time() . '.jpg';
            $filepath = $images_dir . '/' . $filename;
            
            if (file_put_contents($filepath, $image_data)) {
                return [
                    'url' => '/images/blog/' . $filename,
                    'path' => $filepath
                ];
            }

        } catch (Exception $e) {
            Logger::error("Failed to download image: " . $e->getMessage());
        }

        return false;
    }

    /**
     * Make OpenAI API call
     * @param array $data
     * @param string $endpoint
     * @return array|false
     */
    private function callOpenAI($data, $endpoint) {
        $ch = curl_init();
        
        curl_setopt_array($ch, [
            CURLOPT_URL => $this->api_base . $endpoint,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($data),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $this->api_key
            ],
            CURLOPT_TIMEOUT => 60
        ]);

        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        
        curl_close($ch);

        if ($http_code !== 200) {
            throw new Exception("OpenAI API error: HTTP {$http_code} - {$response}");
        }

        $decoded = json_decode($response, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Invalid JSON response from OpenAI API");
        }

        if (isset($decoded['error'])) {
            throw new Exception("OpenAI API error: " . $decoded['error']['message']);
        }

        return $decoded;
    }

    /**
     * Log generation attempt
     * @param string $type
     * @param string $prompt
     * @param string|null $response
     * @param string $status
     * @param int $tokens
     * @param string|null $error
     */
    private function logGeneration($type, $prompt, $response, $status, $tokens = 0, $error = null) {
        try {
            $query = "INSERT INTO ai_generation_log (type, prompt, response, status, tokens_used, error_message, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())";
            
            $this->db->execute($query, [
                $type,
                substr($prompt, 0, 1000), // Limit prompt length
                $response ? substr($response, 0, 2000) : null, // Limit response length
                $status,
                $tokens,
                $error
            ]);

        } catch (Exception $e) {
            Logger::error("Failed to log AI generation: " . $e->getMessage());
        }
    }
}
?>
