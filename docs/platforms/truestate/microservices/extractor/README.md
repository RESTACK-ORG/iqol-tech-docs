# Real Estate Data Extractor API

Node.js Express API that extracts structured real estate data from auction descriptions using Gemini AI.

## Features

- 🤖 AI-powered extraction using Gemini 2.5 Flash & 1.5 Flash
- 📍 Automatic Bangalore micromarket and zone identification  
- 🔧 Intelligent carpet vs super built-up area processing
- 📊 22-field standardized JSON output
- ⚡ Built-in retry logic and rate limiting

## Quick Start

```bash
# Install dependencies
npm install

# Set API key in src/config/config.js
# Edit: apiKey: "your_gemini_api_key_here"

# Start server
npm run dev

# Test API
node test-api.js
```

## API Usage

**POST /api/process**

Send JSON with `description` field:

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "id": "property_1",
  "description": "Residential Apartment Bearing No. 17192, Situated On 19 Floor, Flat Measuring 977 Sq. Ft. Of Carpet Area And 1376 Sq.Ft. Of Super Built Up Area...",
  "source": "auction_dekho",
  "bank": "Canara Bank",
  "reserved_price": "₹ 1.18 Cr"
}' http://localhost:3000/api/process
```

**Response:**
```json
{
  "success": true,
  "data": [{
    "id": "property_1",
    "source": "auction_dekho", 
    "bank": "Canara Bank",
    "description": "Residential Apartment Bearing...",
    "area": "Lalbagh, Central",
    "city": "Bangalore",
    "state": "Karnataka", 
    "pincode": "560027",
    "carpet_area": "977",
    "super_built_area": "1376", 
    "floor": "19",
    "unit_configuration": "2BHK",
    "address": "Clean formatted address",
    "asset_type": "Apartment",
    "undivided_share": "1376 sq.ft",
    "price_per_sqft": "₹8,600"
  }],
  "summary": {
    "processed_records": 1,
    "total_records": 1
  }
}
```

## What it Extracts

### From Description Text (AI-Powered)
- **Areas**: Carpet area, super built-up area with unit conversion
- **Property Details**: Floor, unit configuration (2BHK, 3BHK), asset type
- **Pricing**: Price per sqft with ₹ formatting
- **Location**: Clean address stopping at Bangalore + pincode
- **Legal**: UDS (Undivided Share) details

### Location Intelligence  
- **Micromarket**: Maps to specific Bangalore localities
- **Zone**: Central/East/North/South/West classification
- **Coverage**: 200+ micromarkets across Bangalore

## Output Schema (22 Fields)

```json
{
  "id": "string",
  "source": "string", 
  "url": "string",
  "bank": "string",
  "description": "string",
  "property_type": "string",
  "area": "Micromarket, Zone",
  "city": "Bangalore",
  "state": "Karnataka",
  "contact": "string",
  "reserved_price": "string",
  "emd_amount": "string", 
  "submission_emd": "string",
  "auction_start_date": "string",
  "auction_end_date": "string",
  "pincode": "extracted from address",
  "carpet_area": "in sq.ft",
  "super_built_area": "in sq.ft", 
  "floor": "number only",
  "unit_configuration": "2BHK/3BHK/etc",
  "address": "clean formatted",
  "asset_type": "Flat/Apartment/Villa/etc",
  "undivided_share": "UDS details",
  "price_per_sqft": "₹ formatted"
}
```

## Project Structure

```
/
├── src/
│   ├── config/           # Configuration and constants
│   ├── controllers/      # Request handlers  
│   ├── services/         # Gemini AI integration
│   ├── utils/           # Data processing utilities
│   └── routes/          # API routes
├── app.js               # Express server
├── test-api.js         # API testing script
└── package.json        # Dependencies
```

## Configuration

Edit `src/config/config.js`:
```javascript
gemini: {
  apiKey: process.env.GEMINI_API_KEY || "your_api_key_here",
  mainModel: "gemini-2.5-flash",      // Main extraction
  micromarketModel: "gemini-1.5-flash" // Location intelligence
}
```

## Error Handling

- Invalid JSON format validation
- Missing `description` field detection  
- Gemini API failure with graceful fallbacks
- Rate limiting with 3-second delays
- 3 retry attempts with exponential backoff


## License

MIT