# 🤖 AI Blog Automation Setup Guide

## 🎯 Overview

This AI Blog Automation system analyzes RSS feeds from Microsoft Research, Fast.ai, and NVIDIA Blog, then uses OpenAI GPT-4 and DALL-E 3 to generate professional blog posts in multiple languages every 6 hours.

## 📋 Prerequisites

### Required Services:
- ✅ **XAMPP** (Apache + MySQL + PHP)
- ✅ **OpenAI API Account** with GPT-4 and DALL-E 3 access
- ✅ **Internet Connection** for RSS feeds and API calls

### API Costs (Estimated):
- **GPT-4 Content**: ~$200-300/month (4 posts/day)
- **DALL-E 3 Images**: ~$150-200/month (4 images/day)
- **Total**: ~$350-500/month for full automation

## 🚀 Installation Steps

### Step 1: Database Setup

1. **Open phpMyAdmin**: `http://localhost/phpmyadmin`
2. **Select hilyoon_saas database**
3. **Import Schema**: 
   - Go to Import tab
   - Choose `backend/sql/ai-automation-schema.sql`
   - Click Import

### Step 2: OpenAI API Configuration

1. **Get OpenAI API Key**:
   - Visit: https://platform.openai.com/api-keys
   - Create new secret key
   - Copy the key (starts with `sk-`)

2. **Update Configuration**:
   - Copy `.env.example` to `.env`
   - Update `OPENAI_API_KEY=sk-your-actual-key-here`

### Step 3: File Permissions

Create required directories:
```bash
mkdir -p backend/logs
mkdir -p backend/public/images/blog
chmod 755 backend/logs
chmod 755 backend/public/images/blog
```

### Step 4: Test the System

1. **Copy Files**: Copy entire `backend` folder to `C:/xampp/htdocs/hilyoon-backend/`
2. **Test Database**: Visit `http://localhost/hilyoon-backend/db-test.php`
3. **Admin Interface**: Visit `http://localhost/hilyoon-backend/admin/ai-automation.php`

## ⚙️ Configuration

### RSS Feed Sources:
- **Microsoft Research**: https://www.microsoft.com/en-us/research/feed/
- **Fast.ai NLP**: https://nlp.fast.ai/feed.xml
- **NVIDIA Blog**: https://feeds.feedburner.com/nvidiablog

### Generation Settings:
- **Frequency**: Every 6 hours (4 posts per day)
- **Languages**: English, Romanian, Arabic
- **Posts per Run**: 1 post (3 language versions)
- **Author**: Hily Teco
- **Images**: Professional DALL-E 3 generated

## 🎮 Using the System

### Manual Generation (Testing):

1. **Login to Admin**: `http://localhost/hilyoon-backend/admin/login.php`
2. **Go to AI Automation**: Click navigation or visit directly
3. **Click "Generate Blog Post Now"**: Test the system
4. **Monitor Output**: Watch live log for progress

### Automated Generation:

**Option 1: Web Cron (Recommended for XAMPP)**
- Visit: `http://localhost/hilyoon-backend/automation/cron-scheduler.php?cron_key=hilyoon_blog_automation_2024`
- Set up with online cron services like cron-job.org

**Option 2: System Cron (Linux/Mac)**
```bash
# Edit crontab
crontab -e

# Add this line for every 6 hours
0 */6 * * * /usr/bin/php /path/to/hilyoon-backend/automation/cron-scheduler.php
```

**Option 3: Windows Task Scheduler**
- Program: `C:\xampp\php\php.exe`
- Arguments: `C:\xampp\htdocs\hilyoon-backend\automation\cron-scheduler.php`
- Schedule: Every 6 hours

## 📊 Monitoring & Management

### Admin Dashboard Features:
- ✅ **Real-time Status**: See if automation is running
- ✅ **Manual Controls**: Generate posts on-demand
- ✅ **RSS Testing**: Verify feed analysis
- ✅ **Execution History**: Track successful generations
- ✅ **AI Statistics**: Monitor token usage and success rates
- ✅ **Settings Control**: Adjust posts per run, languages

### Database Tables:
- `ai_generation_log` - Tracks all AI generations
- `ai_used_topics` - Prevents duplicate topics
- `automation_schedule` - Controls timing
- `automation_execution_log` - Execution history

## 🔧 Customization

### Adding More RSS Sources:
Edit `automation/rss-analyzer.php`:
```php
private $feeds = [
    'your_source' => [
        'url' => 'https://yoursite.com/feed.xml',
        'name' => 'Your Source Name',
        'category' => 'Your Category'
    ],
    // ... existing feeds
];
```

### Changing Generation Prompts:
Edit `ai/openai-client.php` in the `getBlogWritingPrompt()` method to customize:
- Writing style
- Content requirements  
- Output format
- Author voice

### Modifying Schedule:
Update `automation/cron-scheduler.php`:
```php
// Change from 6 hours to desired interval
$six_hours_ago = time() - (YOUR_HOURS * 3600);
```

## 🚨 Troubleshooting

### Common Issues:

#### "No OpenAI API Key"
- Verify `.env` file exists with correct key
- Check key has GPT-4 and DALL-E 3 access
- Ensure billing is set up on OpenAI account

#### "RSS Feed Parsing Failed"
- Check internet connection
- Verify RSS URLs are accessible
- Look for SSL certificate issues

#### "Database Connection Failed"
- Ensure MySQL is running in XAMPP
- Verify database credentials in config
- Check if hilyoon_saas database exists

#### "Permission Denied" Errors
- Check folder permissions (755 for directories)
- Ensure Apache can write to logs/ and images/
- Verify PHP file execution permissions

#### "Generation Taking Too Long"
- OpenAI API can be slow (30-60 seconds)
- Check API rate limits
- Monitor token usage

### Debug Mode:
Set in `.env`:
```
DEBUG_MODE=true
LOG_LEVEL=DEBUG
```

Then check logs in `backend/logs/` directory.

## 📈 Expected Results

### Content Quality:
- ✅ **Original Articles**: 1200-1500 words each
- ✅ **SEO Optimized**: Meta titles, descriptions, keywords
- ✅ **Professional Images**: DALL-E 3 generated visuals
- ✅ **Multiple Languages**: EN, RO, AR versions
- ✅ **Consistent Branding**: Hily Teco authorship

### Automation Reliability:
- ✅ **99% Uptime**: Robust error handling
- ✅ **Duplicate Prevention**: Smart topic filtering
- ✅ **Rate Limit Compliance**: Respects API limits
- ✅ **Comprehensive Logging**: Full audit trail

## 💰 Cost Management

### Optimize Costs:
1. **Reduce Frequency**: Generate every 12 hours instead of 6
2. **Fewer Languages**: Generate only EN version initially
3. **Token Limits**: Set daily/monthly limits in OpenAI dashboard
4. **Image Reuse**: Cache and reuse similar images

### Monitor Usage:
- Check OpenAI dashboard regularly
- Set up billing alerts
- Monitor token consumption in admin panel

## 🔐 Security

### API Security:
- Never commit `.env` file to version control
- Use unique cron secret keys
- Limit admin access to authorized users
- Regular security updates

### Content Security:
- All generated content is original (not copied)
- Proper source attribution
- Compliance with copyright laws
- Quality control mechanisms

## 📞 Support

### Getting Help:
1. **Check Logs**: `backend/logs/` directory
2. **Admin Dashboard**: Monitor status and errors
3. **Database Logs**: Check `ai_generation_log` table
4. **OpenAI Status**: Check OpenAI API status page

### Success Indicators:
- ✅ Admin dashboard shows "Running" status
- ✅ Recent executions show "Success"
- ✅ New posts appear in blog_posts table
- ✅ Images saved in public/images/blog/
- ✅ No errors in execution logs

**Your AI Blog Automation is now ready to generate professional content 24/7! 🚀**
