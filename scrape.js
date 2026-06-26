const fs = require('fs');
fetch('https://ganpatis.in/')
  .then(res => res.text())
  .then(html => {
    const urls = new Set();
    const regex = /<img[^>]+src=["']([^"']+)["']/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      if(match[1].includes('.jpg') || match[1].includes('.png') || match[1].includes('.webp')) {
         urls.add(match[1]);
      }
    }
    const srcsetRegex = /srcset=["']([^"']+)["']/g;
    while ((match = srcsetRegex.exec(html)) !== null) {
       const sets = match[1].split(',');
       sets.forEach(s => {
           const url = s.trim().split(' ')[0];
           if(url.includes('.jpg') || url.includes('.png') || url.includes('.webp')) urls.add(url);
       });
    }
    fs.writeFileSync('urls.txt', Array.from(urls).join('\n'));
  });
