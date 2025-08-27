# Property Auction Data Pipeline Documentation

This document outlines the end-to-end automated workflow for scraping, consolidating, processing, and storing property auction data. The pipeline is orchestrated by a single shell script that manages environment setup, data scraping, consolidation, AI-based enrichment, and persistence.

## 1. Environment Setup & Dependency Management

The pipeline is managed by a central shell script that ensures all dependencies are installed and the environment is properly configured.

- **Script Name and Location**: `run_scrapers.sh`
- **Purpose**: Automates the entire scraping and processing workflow.
- **Execution**: 
  ```bash
  chmod +x run_scrapers.sh && ./run_scrapers.sh
  ```

## 2. Data Scraping Phase

Dedicated scrapers extract data from multiple auction websites, running sequentially to produce raw JSON datasets.

### 2.1 Target Sources
- Eauction
- FindAuction
- Auction Dekho
- BankNet
- Tiger Auction

### 2.2 Scrapers

#### 2.2.1 Eauction
- **Script**: `Eauction/eauctionnew.py`
- **Output**: JSON dataset
- **Example Output**:
  ```json
  [
    {
      "auction_id": "12345",
      "title": "Property Auction in Bengaluru",
      "auction_date": "2024-01-15",
      "reserve_price": "10,00,000",
      "detail_url": "https://www.eauctionsindia.com/auction/12345",
      "scraped_at": "2024-01-08T12:00:00",
      "borrower_name": "ABC Corp",
      "asset_category": "Real Estate",
      "auction_type": "Online Auction",
      "property_type": "Commercial Property",
      "auction_start_date": "2024-01-15",
      "auction_end_time": "14:00",
      "application_submission_date": "2024-01-10",
      "description": "A commercial property located in the heart of Bengaluru."
    }
  ]
  ```

#### 2.2.2 FindAuction
- **Script**: `findauction/main.py`
- **Output**: JSON dataset
- **Example Output**:
  ```json
  [
    {
      "title": "Property Auction in Bangalore",
      "url": "https://findauction.in/property/123",
      "bank": "SBI",
      "price": "₹1,00,00,000",
      "auction_date": "Aug 2025",
      "area": "1200 Sq Ft",
      "emd": "₹10,00,000",
      "possession": "Physical",
      "detailed_title": "Property Details",
      "detailed_reserve_price": "₹1,00,00,000",
      "property_id": "123",
      "location": "Bangalore",
      "category": "Residential",
      "emd_amount": "₹10,00,000",
      "auction_date_and_time": "Aug 2025",
      "property_area": "1200 Sq Ft"
    }
  ]
  ```

#### 2.2.3 Auction Dekho
- **Script**: `auction-dekho/main.py`
- **Output**: JSON dataset
- **Example Output**:
  ```json
  [
    {
      "url": "https://www.eauctiondekho.com/auctions/property-123",
      "extracted_at": "2024-01-08T12:00:00",
      "extraction_method": "requests",
      "title": "Property Auction",
      "property_description": "Description of the property",
      "bank": "SBI",
      "branch_name": "Bangalore Branch",
      "property_type": "Commercial",
      "area": "1200 Sq Ft",
      "city": "Bangalore",
      "contact": "9876543210",
      "reserved_price": "₹1,00,00,000",
      "service_provider": "Service Provider Name",
      "emd_amount": "₹10,00,000",
      "emd_submission_deadline": "2024-01-10",
      "auction_start_datetime": "2024-01-15 10:00",
      "auction_end_datetime": "2024-01-15 14:00",
      "property_id": "123"
    }
  ]
  ```

#### 2.2.4 BankNet
- **Script**: `banknet/main.py`
- **Output**: JSON dataset
- **Example Output**:
  ```json
  [
    {
      "url": "https://baanknet.com/property/12345",
      "auction_id": "AUC123456",
      "auction_start_date": "2024-02-15",
      "auction_end_date": "2024-02-15",
      "emd_amount": "₹5,00,000",
      "emd_words": "Five Lakh Only",
      "reserve_price": "₹50,00,000",
      "reserve_price_words": "Fifty Lakh Only",
      "title_deed_type": "Sale Deed",
      "borrower_name": "ABC Private Limited",
      "borrower_address": "Bengaluru, Karnataka",
      "ownership_type": "Individual",
      "property_address": "123, MG Road, Bengaluru, Karnataka - 560001",
      "state": "Karnataka",
      "district": "Bengaluru Urban",
      "pin_code": "560001",
      "bank_property_id": "SBI123456",
      "possession_type": "Physical",
      "nearest_transport": "MG Road Metro Station",
      "property_ownership": "Freehold",
      "property_views": "1250",
      "scraped_at": "2024-01-08 12:00:00"
    }
  ]
  ```

#### 2.2.5 Tiger Auction
- **Script**: `tiger-auction/new.py`
- **Output**: JSON dataset
- **Example Output**:
  ```json
  [
    {
      "listing_id": "78901",
      "auction_bank": "HDFC Bank",
      "auction_description": "Residential property located in Bengaluru with 2BHK configuration",
      "city": "Bengaluru",
      "state": "KARNATAKA",
      "reserve_price": "₹25,00,000",
      "auction_date": "Feb 20, 2024",
      "property_url": "https://www.auctiontiger.in/details-page/78901/",
      "detail_fetched": true
    }
  ]
  ```

## 3. Data Consolidation & Processing

The `merge-data.js` script combines data from all sources into a standardized format with common field mappings.

- **Script**: `./merge-data.js`
- **Key Features**:
  - Maps different field names to a common schema.
  - Formats dates consistently.
  - Generates unique IDs for each record.
  - Parses prices and extracts numeric values.
  - Preserves source-specific data in `extra_fields`.

### 3.1 Common Schema Fields
- `id`: Unique identifier combining source and original ID.
- `source`: Data source identifier (e.g., eauction, find_auction).
- `url`: Property detail page URL.
- `bank`: Financial institution conducting the auction.
- `description`: Property description.
- `property_type`: Type of property (Residential, Commercial, etc.).
- `city`, `state`, `pincode`: Location information.
- `reserved_price`: Reserve price amount.
- `emd_amount`: Earnest Money Deposit amount.
- `auction_start_date`, `auction_end_date`: Auction timing.
- `address`: Full property address.
- `extra_fields`: Source-specific additional data.

### 3.2 Common Schema Example
```json
{
  "id": "auction_dekho_https:__www_eauctiondekho_com_auctions_union-bank-of-india-auctions-for-land-in-devanahalli-bengaluru-92u79u61fc",
  "source": "auction_dekho",
  "url": "https://www.eauctiondekho.com/auctions/union-bank-of-india-auctions-for-land-in-devanahalli-bengaluru-92u79u61fc",
  "bank": "Union Bank of India",
  "description": "Vacant land admeasuring 5300 Sq.Ft situated in Sy No 128/3, Khata No 1042/451, Old Khata No 617/4, Palanahalli, Kattigenahalli Dhakale, Devanahalli Taluk, Bangalore belonging to Mr G Balaraju S/O Mr B. Gopalappa",
  "property_type": "Residential - Land",
  "area": "Devanahalli, Bengaluru, Karnataka",
  "city": "Bengaluru",
  "state": "Karnataka",
  "pincode": "",
  "address": "Devanahalli, Bengaluru, Karnataka",
  "reserved_price": "₹ 1.59 Cr",
  "emd_amount": "₹ 15.90 Lakh",
  "price_per_sqft": "",
  "submission_emd": 1748604600,
  "auction_start_date": 1748586600,
  "auction_end_date": 1748604600,
  "carpet_area": "",
  "super_built_area": "",
  "floor": "",
  "unit_configuration": "",
  "asset_type": "Land",
  "undivided_share": "",
  "contact": "Mobile No : 9003223669 9003223669",
  "extracted_at": 1755636430,
  "extraction_method": "requests",
  "title": "Union Bank of India Auctions for Land in Devanahalli, Bengaluru",
  "branch_name": "ASSET RECOVERY BRANCH, BENGALURU NORTH",
  "reserved_price_numeric": "1.59",
  "service_provider": "BAANKNET",
  "emd_amount_numeric": "15.90"
}
```

### 3.3 Date Filtering and Sorting
- **Script**: `sort_by_auction_date.py`
- **Features**:
  - Filters out past auctions, keeping only future auction dates.
  - Considers auction start date and EMD submission deadline.
  - Outputs to `data/final-data.json` for production use.

### 3.4 Usage Notes
- **Date Fields**: Unix timestamps can be converted to readable dates using standard libraries.
- **Price Fields**: Includes formatted strings (e.g., with ₹ symbol) and numeric values for calculations.
- **Location Fields**: May be empty if extraction fails; check `area`, `address`, and `description`.
- **Extra Fields**: Stores source-specific data not mapped to the common schema.

## 4. Data Extraction & Enrichment

### 4.1 Extractor: Data Input & Validation
- **Entry Point**: `POST /api/process`
- **Controller**: `src/controllers/processController.js`
- **Steps**:
  1. Validate request body (`description` required).
  2. Map fields via `DataProcessor.loadJsonData()` using `JSON_FIELD_MAPPING`.
  3. Initialize missing fields with `"NA"`.
- **Mapping Example**:
  ```javascript
  'description' → 'auction_description',
  'carpet_area' → 'Carpet Area',
  'asset_type' → 'Asset_Type',
  'plot_area' → 'Plot_Area'
  ```

### 4.2 Gemini - Data Extraction
- **Service**: `src/services/geminiService.js`
- **Models**:
  - Primary: Gemini 2.5 Flash
  - Fallback: Gemini 1.5 Flash
- **Extracted Fields** (11 total):
  - Price per sqft, Carpet Area, Super Built-up Area, Floor
  - Unit Configuration, Undivided Share (UDS)
  - Address, Asset Type, Plot Area
  - Zone, Micromarket
- **Processing Rules**:
  - Convert sqm to sqft (×10.764), guntas to sqft (×1089).
  - Enforce: Carpet Area < Super Built-up Area.
  - Standardize asset types (e.g., Apartment, 2BHK, Studio).
- **Location Extraction**:
  - Function: `extractMicromarketAndZone(address)`
  - Matches 180+ Bangalore micromarkets to 5 zones: Central, East, North, South, West.

### 4.3 Data Processing
- **Service**: `src/utils/dataProcessor.js`
- **Key Logic**:
  - Regex-based extraction for area, floor, and configurations.
  - Asset type normalization.
  - **Address Cleaning**:
    - Removes noise (e.g., plot references, boundaries).
    - Standardizes endings: `Bangalore, Karnataka, Pincode`.

## 5. Data Transformation
- **Service**: `src/services/auctionTransformService.js`
- **Transformations**:
  1. Auction overview (dates, bank, reserve price, EMD).
  2. Unit details (areas, floors, configurations).
  3. Location & verification (zone, micromarket, geodata).
- **Price Handling**:
  - Converts Crore/Lakh to numeric values.
  - Normalizes price formats.

## 6. Distance Calculation
- **Service**: `src/services/distanceService.js`
- **Details**:
  - Uses Google Places API.
  - Calculates distance from Vidhana Soudha (Bangalore center) using the Haversine formula.

## 7. Data Persistence
- **Service**: `src/services/firebaseService.js`
- **Duplicate Detection**:
  - Compares: asset type, auction date, bank, reserve price.
  - Uses fuzzy matching and scoring.
- **Collections**:
  - `truEstateAuctions`: Clean, verified properties.
  - `duplicateAuctionProperties`: Flagged duplicate entries.
- **Enrichments**:
  - Adds distance, timestamps, unique IDs, and modification history.

## 8. Final Processing
- **Sorting**:
  - Executes `sort_by_auction_date.py`.
  - Orders properties chronologically by auction date.
  - Produces the final unified dataset in `data/final-data.json`.

## 9. Response Generation
- **Sample Response**:
  ```json
  {
    "success": true,
    "message": "Processing completed successfully",
    "result": "success",
    "timestamp": "2025-08-27T10:30:00.000Z"
  }
  ```

## 10. Error Handling & Recovery
- **AI Failures**: Retries with fallback model, handles timeouts, and ensures rate-limit safety.
- **Validation Errors**: Field-by-field fallback logic.
- **Storage Errors**: Firebase retry, duplicate flagging, and data integrity checks.

## 11. Configuration Management
- **Environment Variables**:
  - `PORT`: API server port (default: 3000).
  - `CORS_ORIGIN`: Allowed origins.
  - `GEMINI_API_KEY`: Google AI key.
  - Firebase credentials.