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

// Function to get workflows for a platform
function getWorkflows(platform) {
  const workflowsPath = path.join(__dirname, 'docs', 'platforms', platform, 'workflows');
  try {
    return fs.readdirSync(workflowsPath, { withFileTypes: true })
      .filter(dirent => dirent.isFile() && dirent.name.endsWith('.md'))
      .map(dirent => dirent.name.replace('.md', ''));
  } catch (error) {
    return [];
  }
}

app.get('/', (req, res) => {
  const platformLinks = platforms.map(platform => {
    const displayName = platform.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    return `<li><a href="/platform/${platform}">${displayName}</a></li>`;
  }).join('');

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>IQOL's Tech Documentation</title>
      <style>
 body {
  font-family: Arial, sans-serif;
  margin: 30px auto;
  max-width: 700px;
}
        a { color: #007bff; text-decoration: underline; }
        ul { list-style-type: none; padding: 0; }
        li { margin: 10px 0; }
      </style>
    </head>
    <body>

    
      <h1>IQOL's Tech Documentation</h1>
      <ul>
        ${platformLinks}
      </ul>
    </body>
    </html>
  `);
});

app.get('/docs', (req, res) => {
  res.redirect('/');
});

app.get('/platform/:platform', (req, res) => {
  const platform = req.params.platform;
  
  if (!platforms.includes(platform)) {
    return res.status(404).json({ error: 'Platform not found' });
  }
  
  const displayName = platform.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  const microservices = getMicroservices(platform);
  const workflows = getWorkflows(platform);
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${displayName} Platform Documentation</title>
      <style>
  body {
  font-family: Arial, sans-serif;
  margin: 30px auto;
  max-width: 700px;
}
        a { color: #007bff; text-decoration: underline; }
        ul { list-style-type: none; padding: 0; }
        li { margin: 10px 0; }
        h2 { margin-top: 30px; margin-bottom: 15px; }
      </style>
    </head>
    <body>
      <a href="/">← Back to Platforms</a>
      
      <h1>${displayName}</h1>
      
      <h2>Platform Schema</h2>
      <ul>
        <li><a href="/docs/${platform}/schema">View Platform Schema</a></li>
      </ul>
      
      ${workflows.length > 0 ? `
        <h2>Workflows</h2>
        <ul>
          ${workflows.map(workflow => `
            <li><a href="/docs/${platform}/workflows/${workflow}">${workflow.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</a></li>
          `).join('')}
        </ul>
      ` : `
        <h2>Workflows</h2>
        <p>No workflow documentation available for this platform yet.</p>
      `}
      
      ${microservices.length > 0 ? `
        <h2>Microservices</h2>
        <ul>
          ${microservices.map(service => `
            <li><a href="/docs/${platform}/microservices/${service}">${service.charAt(0).toUpperCase() + service.slice(1)}</a></li>
          `).join('')}
        </ul>
      ` : `
        <h2>Microservices</h2>
        <p>No microservices documentation available for this platform yet.</p>
      `}
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
        <div style="margin-bottom: 20px;">
          <a href="/">← All Platforms</a> | 
          <a href="/platform/${platform}">← ${platform.charAt(0).toUpperCase() + platform.slice(1)} Platform</a>
        </div>
        ${htmlContent}
        <hr>
        <p><a href="/platform/${platform}">← Back to ${platform.charAt(0).toUpperCase() + platform.slice(1)} Platform</a></p>
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

app.get('/docs/:platform/workflows/:workflow', (req, res) => {
  const { platform, workflow } = req.params;
  
  if (!platforms.includes(platform)) {
    return res.status(404).json({ error: 'Platform not found' });
  }
  
  const workflowPath = path.join(__dirname, 'docs', 'platforms', platform, 'workflows', `${workflow}.md`);
  
  try {
    const markdownContent = fs.readFileSync(workflowPath, 'utf8');
    const htmlContent = md.render(markdownContent);
    
    const displayName = platform.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    const workflowDisplayName = workflow.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${workflowDisplayName} - ${displayName}</title>
        <link rel="stylesheet" href="/css/schema.css">
      </head>
      <body>
        <div style="margin-bottom: 20px;">
          <a href="/">← All Platforms</a> | 
          <a href="/platform/${platform}">← ${displayName} Platform</a> |
          <a href="/docs/${platform}/schema">Platform Schema</a>
        </div>
        ${htmlContent}
        <hr>
        <p><a href="/platform/${platform}">← Back to ${displayName} Platform</a></p>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(404).json({ error: 'Workflow documentation not found' });
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
          <a href="/">← All Platforms</a>
          <a href="/platform/${platform}">← ${platform.charAt(0).toUpperCase() + platform.slice(1)} Platform</a>
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