const express = require('express');
const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const platforms = ['truestate', 'acn', 'vault', 'canvas-homes', 'restack'];

// Function to get microservices for a platform
function getMicroservices(platform) {
  const microservicesPath = path.join(__dirname, 'docs', 'platforms', platform, 'microservices');
  try {
    return fs.readdirSync(microservicesPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  } catch (error) {
    return [];
  }
}

app.get('/docs', (req, res) => {
  const platformSections = platforms.map(platform => {
    const displayName = platform.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    const microservices = getMicroservices(platform);
    const microserviceLinks = microservices.length > 0 
      ? microservices.map(service => 
          `<li style="margin-left: 20px;"><a href="/docs/${platform}/microservices/${service}">${service}</a></li>`
        ).join('')
      : '';
    
    return `
      <li>
        <strong>${displayName}</strong>
        <ul style="margin: 5px 0;">
          <li style="margin-left: 20px;"><a href="/docs/${platform}/schema">Platform Schema</a></li>
          ${microserviceLinks}
        </ul>
      </li>
    `;
  }).join('');

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>IQOL Service Group Documentation</title>
      <link rel="stylesheet" href="/css/docs.css">
    </head>
    <body>
      <h1>IQOL Service Group Documentation</h1>
      <p>Platform documentation and microservices:</p>
      <ul>
        ${platformSections}
      </ul>
    </body>
    </html>
  `);
});

app.get('/docs/:platform/schema', (req, res) => {
  const platform = req.params.platform;
  
  if (!platforms.includes(platform)) {
    return res.status(404).json({ error: 'Platform not found' });
  }
  
  const schemaPath = path.join(__dirname, 'docs', 'platforms', platform, 'schema.md');
  
  try {
    const markdownContent = fs.readFileSync(schemaPath, 'utf8');
    const htmlContent = md.render(markdownContent);
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${platform.charAt(0).toUpperCase() + platform.slice(1)} Schema Documentation</title>
        <link rel="stylesheet" href="/css/schema.css">
      </head>
      <body>
        ${htmlContent}
        <hr>
        <p><a href="/docs">← Back to API Documentation</a></p>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read schema file' });
  }
});

app.get('/docs/:platform/schema/raw', (req, res) => {
  const platform = req.params.platform;
  
  if (!platforms.includes(platform)) {
    return res.status(404).json({ error: 'Platform not found' });
  }
  
  const schemaPath = path.join(__dirname, 'docs', 'platforms', platform, 'schema.md');
  
  try {
    const markdownContent = fs.readFileSync(schemaPath, 'utf8');
    res.setHeader('Content-Type', 'text/markdown');
    res.send(markdownContent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read schema file' });
  }
});

app.get('/docs/:platform/microservices/:service', (req, res) => {
  const { platform, service } = req.params;
  
  if (!platforms.includes(platform)) {
    return res.status(404).json({ error: 'Platform not found' });
  }
  
  const readmePath = path.join(__dirname, 'docs', 'platforms', platform, 'microservices', service, 'README.md');
  
  try {
    const markdownContent = fs.readFileSync(readmePath, 'utf8');
    const htmlContent = md.render(markdownContent);
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${service.charAt(0).toUpperCase() + service.slice(1)} - ${platform.charAt(0).toUpperCase() + platform.slice(1)}</title>
        <link rel="stylesheet" href="/css/microservice.css">
      </head>
      <body>
        <div class="nav">
          <a href="/docs">← All Documentation</a>
          <a href="/docs/${platform}/schema">Platform Schema</a>
        </div>
        ${htmlContent}
      </body>
      </html>
    `);
  } catch (error) {
    res.status(404).json({ error: 'Microservice documentation not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});