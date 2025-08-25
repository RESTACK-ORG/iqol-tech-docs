# IQOL Service Group Documentation

A centralized documentation service for all IQOL platforms and their microservices.

## Overview

This Node.js application serves documentation for multiple platforms:
- **TrueState** - Real estate data management
- **ACN** - Agent Communication Network
- **Vault** - Secure document storage
- **Canvas Homes** - Home design platform
- **Restack** - Infrastructure orchestration

## Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start

# View documentation
open http://localhost:3000/docs
```

## Project Structure

```
/
├── docs/
│   └── platforms/
│       ├── truestate/
│       │   ├── schema.md
│       │   └── microservices/
│       │       └── extractor/
│       │           └── README.md
│       ├── acn/
│       │   └── schema.md
│       ├── vault/
│       │   └── schema.md
│       ├── canvas-homes/
│       │   └── schema.md
│       └── restack/
│           └── schema.md
├── public/
│   └── css/
│       ├── docs.css
│       ├── schema.css
│       └── microservice.css
├── index.js
└── package.json
```

## Adding New Documentation

### Platform Schema
Add platform schema documentation:
```bash
docs/platforms/{platform-name}/schema.md
```

### Microservices
Add microservice documentation:
```bash
docs/platforms/{platform-name}/microservices/{service-name}/README.md
```

The system automatically discovers and serves new documentation files.

## Available Routes

- `GET /docs` - Main documentation index
- `GET /docs/:platform/schema` - Platform schema documentation
- `GET /docs/:platform/schema/raw` - Raw markdown schema
- `GET /docs/:platform/microservices/:service` - Microservice documentation

## Features

- ✅ Automatic service discovery
- ✅ Markdown to HTML rendering
- ✅ Clean, minimal styling
- ✅ Responsive design
- ✅ Navigation breadcrumbs
- ✅ Static CSS files

## Dependencies

- **Express.js** - Web server framework
- **markdown-it** - Markdown parser and renderer

## License

MIT