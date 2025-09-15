# Fashion Lookbook (Static S3 + CloudFront)

A simple, fast image lookbook. Images are optimized (≤1600px, lazy-loaded) and rendered from `data/data.json` with infinite scroll and a back-to-top button.

## Live Demo
[View site on CloudFront](https://d17hum138buw2o.cloudfront.net)
![Gallery screenshot](images/fashion-lookbook.png)

## Features
- Static site on **S3 + CloudFront**
- **Infinite scroll** (IntersectionObserver) with skeleton placeholders
- **Lazy-loaded** thumbnails (`loading="lazy"`) and fade-in on `load`
- Lightweight JSON data source

## Tech
HTML, CSS, JS (vanilla). Deployed on AWS S3 + CloudFront.

## Project Structure
/images/ # optimized jpgs  
/data/data.json # items: title, image, tags  
/index.html  
/styles.css  
/app.js  

## Local Dev
Open `index.html` (or use a simple Live Server extension).

## Deploy
1. Upload changed files to S3: `app.js`, `styles.css`, `data/data.json`, `images/*`, and `index.html` if changed.  
2. CloudFront → **Create Invalidation** for:
/app.js
/styles.css
/index.html (if changed)
/images/* (only if you replaced existing filenames)
3. Hard refresh the browser.

## Performance Notes
- Images ≤1600px long edge, ~70–85% JPEG quality  
- Lazy loading + small CSS/JS  
- Cache-busting via CloudFront invalidation  

## Roadmap
- Optional `srcset` for responsive images  
- Simple filter/search by tags  
- Dark mode  

## License
MIT
