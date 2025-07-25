#!/usr/bin/env node

/**
 * Blog Post Creator for The Chatbot Genius
 * 
 * This script creates a new blog post with the consistent header and structure
 * used across the website.
 * 
 * Usage: node create-blog-post.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Helper function to ask questions
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Function to create URL-friendly slug
function createSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .replace(/--+/g, '-')      // Replace multiple hyphens with single hyphen
        .trim();
}

// Function to get current date in ISO format
function getCurrentDateISO() {
    return new Date().toISOString().split('T')[0];
}

// Function to format date for display
function formatDateDisplay(date) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    const d = new Date(date);
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

// Blog post template
function getBlogPostTemplate(data) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title} | The Chatbot Genius</title>
    <meta name="description" content="${data.metaDescription}">
    <meta name="keywords" content="${data.keywords}">
    <meta name="author" content="Jay Tarzwell">
    
    <!-- Open Graph for social sharing -->
    <meta property="og:title" content="${data.title}">
    <meta property="og:description" content="${data.metaDescription}">
    <meta property="og:image" content="https://thechatbotgenius.com/blog/images/${data.imageFilename}">
    <meta property="og:url" content="https://thechatbotgenius.com/blog/${data.filename}">
    <meta property="og:type" content="article">
    
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-R76R0B7J9B"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-R76R0B7J9B');
    </script>
    
    <style>
        /* Core styles from main site */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
        }
        
        /* Top Banner */
        .top-banner {
            background: #0a0f51;
            color: white;
            padding: 12px 0;
            text-align: center;
            width: 100%;
            position: relative;
            z-index: 1001;
        }
        
        .banner-content {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            gap: 15px;
        }
        
        .banner-item {
            font-size: 0.95rem;
            font-weight: 500;
        }
        
        .banner-separator {
            color: #4c5fd5;
            font-weight: bold;
        }
        
        /* Navigation */
        .navbar {
            background: linear-gradient(135deg, #1a1f71 0%, #4c5fd5 100%);
            color: white;
            padding: 0;
            position: sticky;
            width: 100%;
            top: 0;
            z-index: 1000;
            transition: all 0.3s ease;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        .nav-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 70px;
        }
        
        .nav-brand {
            font-size: 1.5rem;
            font-weight: bold;
            text-decoration: none;
            color: white;
        }
        
        .nav-brand:hover {
            opacity: 0.9;
        }
        
        /* Mobile Menu Button */
        .mobile-menu-toggle {
            display: none;
            background: none;
            border: 2px solid white;
            color: white;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 1rem;
            border-radius: 4px;
            margin: auto 0;
        }
        
        .mobile-menu-toggle:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .nav-links {
            display: flex;
            gap: 30px;
            list-style: none;
            align-items: center;
            height: 100%;
        }
        
        .nav-links li {
            display: flex;
            align-items: center;
            height: 100%;
        }
        
        .nav-links a:not(.btn) {
            color: white;
            text-decoration: none;
            padding: 5px 10px;
            border-radius: 4px;
            transition: background 0.3s;
            display: flex;
            align-items: center;
            height: 100%;
        }
        
        .nav-links a:not(.btn):hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .btn {
            display: inline-block;
            padding: 12px 30px;
            margin: 0 10px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 600;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .btn-book {
            background: #ff8c42;
            color: white;
            font-weight: bold;
            border: 2px solid #ff8c42;
        }
        
        .btn-book:hover {
            background: #ff7329;
            border-color: #ff7329;
        }
        
        /* Main content area */
        main {
            max-width: 800px;
            margin: 4rem auto 2rem;
            padding: 0 2rem;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        article {
            padding: 3rem 2rem;
        }
        
        .article-header {
            margin-bottom: 3rem;
            text-align: center;
        }
        
        h1 {
            font-size: 2.5rem;
            color: #2c3e50;
            margin-bottom: 1rem;
            line-height: 1.2;
        }
        
        .meta {
            color: #7f8c8d;
            font-size: 1rem;
            margin-bottom: 2rem;
        }
        
        .hero-image {
            width: 100%;
            height: auto;
            border-radius: 10px;
            margin-bottom: 3rem;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        /* Blog content styles */
        h2 {
            font-size: 2rem;
            color: #2c3e50;
            margin: 3rem 0 1.5rem;
            padding-top: 2rem;
        }
        
        h3 {
            font-size: 1.5rem;
            color: #34495e;
            margin: 2rem 0 1rem;
        }
        
        p {
            margin-bottom: 1.5rem;
            color: #555;
            line-height: 1.8;
        }
        
        ul, ol {
            margin-bottom: 1.5rem;
            padding-left: 2rem;
            color: #555;
        }
        
        li {
            margin-bottom: 0.5rem;
            line-height: 1.8;
        }
        
        a {
            color: #3498db;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
        
        strong {
            color: #2c3e50;
            font-weight: 600;
        }
        
        em {
            color: #e74c3c;
            font-style: italic;
        }
        
        /* Table of Contents */
        .toc {
            background-color: #f8f9fa;
            border-radius: 10px;
            padding: 2rem;
            margin-bottom: 3rem;
        }
        
        .toc h2 {
            margin-top: 0;
            padding-top: 0;
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }
        
        .toc ul {
            list-style: none;
            padding-left: 0;
        }
        
        .toc li {
            margin-bottom: 0.75rem;
        }
        
        .toc a {
            color: #2c3e50;
            text-decoration: none;
            display: block;
            padding: 0.25rem 0;
            border-bottom: 1px solid transparent;
            transition: all 0.3s;
        }
        
        .toc a:hover {
            color: #3498db;
            border-bottom-color: #3498db;
            text-decoration: none;
        }
        
        /* Special sections */
        .highlight-box {
            background-color: #e8f4fd;
            border-left: 4px solid #3498db;
            padding: 1.5rem;
            margin: 2rem 0;
            border-radius: 5px;
        }
        
        .conclusion {
            background-color: #f8f9fa;
            border-radius: 10px;
            padding: 2rem;
            margin-top: 3rem;
        }
        
        .cta {
            background-color: #3498db;
            color: white;
            padding: 1rem 2rem;
            border-radius: 5px;
            display: inline-block;
            text-decoration: none;
            margin-top: 1rem;
            transition: background-color 0.3s;
        }
        
        .cta:hover {
            background-color: #2980b9;
            text-decoration: none;
        }
        
        /* Footer */
        .footer {
            background: #1a1f71;
            color: white;
            text-align: center;
            padding: 2rem 0;
            margin-top: 4rem;
        }
        
        /* Mobile responsive */
        @media (max-width: 768px) {
            .banner-content {
                font-size: 0.85rem;
            }
            
            .banner-separator {
                display: none;
            }
            
            .banner-item {
                width: 100%;
                padding: 2px 0;
            }
            
            .mobile-menu-toggle {
                display: block;
            }
            
            .nav-links {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: #1a1f71;
                flex-direction: column;
                padding: 20px;
                gap: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                height: auto;
            }
            
            .nav-links li {
                width: 100%;
                height: auto;
            }
            
            .nav-links a:not(.btn) {
                width: 100%;
                justify-content: center;
                padding: 10px;
            }
            
            .nav-links.show {
                display: flex;
            }
            
            h1 {
                font-size: 2rem;
            }
            
            h2 {
                font-size: 1.5rem;
            }
            
            article {
                padding: 2rem 1rem;
            }
        }
    </style>
</head>
<body>
    <!-- Top Banner -->
    <div class="top-banner">
        <div class="container">
            <div class="banner-content">
                <span class="banner-item">
                    <span aria-hidden="true">✍️</span> Writer & Publisher
                </span>
                <span class="banner-separator" aria-hidden="true">•</span>
                <span class="banner-item">
                    <span aria-hidden="true">🤖</span> Custom GPT & App Vibe Coder
                </span>
                <span class="banner-separator" aria-hidden="true">•</span>
                <span class="banner-item">
                    <span aria-hidden="true">🎓</span> Generative AI Trainer
                </span>
            </div>
        </div>
    </div>

    <!-- Navigation -->
    <nav class="navbar" role="navigation" aria-label="Main navigation">
        <div class="container">
            <div class="nav-content">
                <a href="/" class="nav-brand">
                    <span aria-hidden="true">🤖</span> The Chatbot Genius
                </a>
                <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-expanded="false" aria-controls="nav-links" aria-label="Toggle navigation menu">
                    Menu
                </button>
                <ul class="nav-links" id="nav-links">
                    <li><a href="/">Home</a></li>
                    <li><a href="/about.html">About</a></li>
                    <li><a href="/ai-news.html">AI News</a></li>
                    <li><a href="/books.html">Books</a></li>
                    <li><a href="/blog.html">Blog</a></li>
                    <li><a href="/#contact">Contact</a></li>
                    <li><a href="https://calendly.com/jay-barkerhrs/30min" class="btn btn-book" style="padding: 8px 20px; border-radius: 5px;" target="_blank" aria-label="Book a consultation call - opens in new window">Book a Call</a></li>
                </ul>
            </div>
        </div>
    </nav>
    
    <main>
        <article>
            <div class="article-header">
                <h1>${data.title}</h1>
                <div class="meta">
                    <time datetime="${data.dateISO}">${data.dateDisplay}</time> • By Jay Tarzwell
                </div>
            </div>
            
            <img src="images/${data.imageFilename}" alt="${data.imageAlt}" class="hero-image">
            
            <!-- Blog content starts here -->
            <p>Your opening paragraph goes here. Make it compelling and include your primary keyword naturally.</p>
            
            <div class="toc">
                <h2>Table of Contents</h2>
                <ul>
                    <li><a href="#section-1">Section 1</a></li>
                    <li><a href="#section-2">Section 2</a></li>
                    <li><a href="#section-3">Section 3</a></li>
                    <li><a href="#conclusion">Conclusion</a></li>
                </ul>
            </div>
            
            <h2 id="section-1">Section 1</h2>
            <p>Your content here...</p>
            
            <h2 id="section-2">Section 2</h2>
            <p>Your content here...</p>
            
            <h2 id="section-3">Section 3</h2>
            <p>Your content here...</p>
            
            <div class="conclusion">
                <h2 id="conclusion">Conclusion</h2>
                <p>Your conclusion here...</p>
                <p><strong>Ready to explore more?</strong> Check out my <a href="/books.html">books on AI and chatbots</a> or browse through our <a href="/blog.html">AI insights blog</a> for more experiments and discoveries.</p>
            </div>
            <!-- Blog content ends here -->
        </article>
    </main>
    
    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 The Chatbot Genius. All rights reserved.</p>
            <p>Building the future of conversational AI, one chatbot at a time.</p>
        </div>
    </footer>
    
    <script>
        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const navLinks = document.getElementById('nav-links');
        
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('show');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav-content') && navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close mobile menu when pressing Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mobileMenuToggle.focus();
            }
        });
    </script>
</body>
</html>`;
}

// Main function
async function createBlogPost() {
    console.log('\n🤖 The Chatbot Genius - Blog Post Creator\n');
    console.log('This tool will help you create a new blog post with consistent styling.\n');

    try {
        // Gather information
        const title = await question('Blog post title: ');
        const metaDescription = await question('Meta description (150-160 chars): ');
        const excerpt = await question('Excerpt for blog listing (1-2 sentences): ');
        const keywords = await question('Keywords (comma-separated): ');
        const imageAlt = await question('Image alt text: ');
        
        // Generate filenames
        const slug = createSlug(title);
        const filename = `${slug}.html`;
        const imageFilename = `${slug}-header.svg`;
        const dateISO = getCurrentDateISO();
        const dateDisplay = formatDateDisplay(dateISO);
        
        // Prepare data
        const data = {
            title,
            metaDescription,
            excerpt,
            keywords,
            imageAlt,
            filename,
            imageFilename,
            dateISO,
            dateDisplay
        };
        
        // Generate the blog post
        const blogPostContent = getBlogPostTemplate(data);
        
        // Save the file
        const blogPath = path.join(__dirname, 'blog', filename);
        fs.writeFileSync(blogPath, blogPostContent);
        
        console.log(`\n✅ Blog post created successfully!`);
        console.log(`📄 File: blog/${filename}`);
        console.log(`🖼️  Image placeholder: blog/images/${imageFilename}`);
        
        // Generate the blog-posts-data.js entry
        const blogDataEntry = `    {
        title: "${title}",
        excerpt: "${excerpt}",
        date: "${formatDateDisplay(dateISO)}",
        image: "blog/images/${imageFilename}",
        imageAlt: "${imageAlt}",
        url: "blog/${filename}",
        sortDate: new Date("${dateISO}")
    },`;
        
        console.log('\n📝 Add this to the beginning of the blogPostsData array in blog-posts-data.js:');
        console.log(blogDataEntry);
        
        console.log('\n🎨 Don\'t forget to:');
        console.log('1. Create the header image and save it as: blog/images/' + imageFilename);
        console.log('2. Add the blog post data to blog-posts-data.js');
        console.log('3. Write your content in the HTML file');
        console.log('4. Commit and push to publish');
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        rl.close();
    }
}

// Run the script
createBlogPost();
