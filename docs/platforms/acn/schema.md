# ACN Schema Documentation

## Overview

This TypeScript schema defines a unified, flexible data structure for ACN's comprehensive property management system. It uses a **single Property interface** that accommodates all property types (residential and commercial) and listing types (resale and rental) through optional fields and discriminated properties.

## Design Philosophy

The schema follows a **"single interface, optional fields"** approach where:
- All properties use the same `Property` interface
- Property-specific fields are optional and populated based on relevance
- Type safety is maintained through discriminated unions and conditional field validation
- Field names are unified across property types for consistency

## Core Type Definitions

### Asset and Property Types

```typescript
type assetType = 
  // Residential
  | "apartment" | "villa" | "villament" 
  | "independent house" | "row house" | "plot"
  // Commercial
  | "Office Space" | "Retail Space" | "Commercial Space";

type propertyType = "Residential" | "Commercial";
type listingType = "resale" | "rental";
```

### Residential Property Types

```typescript
type extraRooms = ["Servant Room" | "Study Room" | "Pooja Room" | "Other"] | null;
type noOfBedrooms = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type noOfBathrooms = 1 | 2 | 3 | 4 | 5 | "5+";
type noOfBalconies = 0 | 1 | 2 | 3 | 4 | 5 | "5+";
type balconyFacing = "Inside" | "Outside";
type apartmentType = "Simple" | "Duplex" | "Triplex" | "Penthouse";
type furnishing = "Unfurnished" | "Semi-Furnished" | "Furnished";

type amenities = [
  | "Gym" | "Lifts" | "Water Storage" | "Visitor Parking"
  | "Service Lifts" | "Pool" | "CCTV Surveillance" 
  | "Security" | "Power Backup" | "Club-House"
];
```

### Commercial Property Types

```typescript
type PropertyType = "Office Space" | "Retail Space" | "Commercial Space";

// Conditional commercial sub-types based on PropertyType
type commercialSubType = 
  | "Independent Office Space" | "IT Park" | "Co-Working Space"  // Office Space
  | "Commercial Shop" | "Showroom"                              // Retail Space
  | "PG/Guest-House" | "Warehouse" | "Commercial Plot"         // Commercial Space
  | "Industrial Shed" | "Factory" | "Other";

type furnishingCommercial = "Bare Shell" | "Warm Shell" | "Plug & Play";
type suitableWarehouse = "Godown" | "Dark Store" | "Industrial Warehouse" | "Cold Storage";

type commercialAmenities = [
  | "Power Backup" | "Security" | "Lifts" | "Water Storage"
  | "CCTV Surveillance" | "Visitor Parking" | "Cafeteria / Food Court"
  | "Maintenance Staff" | "ATM" | "Wheel-Chair Accessibility"
];
```

### Common Property Attributes

```typescript
type possession = "Ready to Move" | "Under Construction";
type ageOfTheBuilding = "New" | "1-5 years" | "6-10 years" | "11-15 years" | "15+ Years";
type direction = "North" | "South" | "East" | "West";
type communityType = "Gated" | "Independent";
type landKhata = "A" | "B";
type maintenance = "Included" | "Not Included";
type commissionType = "Side by Side" | "Commission Sharing";
type preferredTenants = ["Anyone", "Family", "Bachelor Female", "Bachelor Male"];
```

## The Unified Property Interface

### Core Identity Fields

```typescript
interface Property {
  // Primary Identifiers
  propertyId: string;
  listingType: "resale" | "rental";           // Transaction type
  propertyType: "residential" | "commercial";  // Property category
  assetType: assetType;                       // Specific property type
```

### Stakeholder Information

```typescript
  // Agent Details
  cpId: string;
  agentName: string;
  agentPhoneNumber: string;
  
  // KAM (Key Account Manager) Details
  kamId: string;
  kamName: string;
```

### System Metadata

```typescript
  // Timestamps and Status
  added: number;                              // Creation timestamp
  dateOfLastChecked: number;                  // Last verification
  lastModified: number;                       // Last update
  status: string;                             // Current status
  
  // Quality Control Workflow
  kamStatus: string;                          // KAM approval status
  dataStatus: string;                         // Data quality status
  stage: string;                              // Process stage
```

### Location and Geography

```typescript
  // Location Information
  propertyName: string;
  micromarket: string;                        // Local area
  area: string;                               // Broader area
  zone: string;                               // Zone classification
  communityType: communityType;               // Gated/Independent
  _geoloc: GeoLocation;                       // Coordinates
```

### Physical Characteristics

```typescript
  // Area Measurements (unified naming)
  sbua: number;                               // Super Built-up Area
  carpetArea?: number;                        // Usable area
  plotArea?: number;                          // Land area
  
  // Orientation
  facing: direction;                          // Property orientation
```

### Property Classification

```typescript
  // Category-Specific Fields
  propertyCategory?: propertyType;            // Additional categorization
  commercialPropertyType?: PropertyType;      // Commercial main type
  commercialSubType?: commercialSubType;      // Commercial sub-category
```

### Residential-Specific Fields

```typescript
  // Apartment Details
  apartmentType?: apartmentType;              // Simple/Duplex/etc.
  structure?: string;                         // Building structure (e.g., "G+1")
  
  // Room Configuration
  noOfBedrooms?: noOfBedrooms;
  extraRooms?: extraRooms;
  noOfBathrooms?: noOfBathrooms;
  noOfBalconies?: noOfBalconies;
  balconyFacing?: balconyFacing;
```

### Floor Information (Unified)

```typescript
  // Floor Details
  floorNumber?: number;                       // Numeric floor number
  referredFloorNumber?: string;               // Descriptive floor reference
  totalFloors?: number;                       // Total floors in building
```

**Floor Naming Examples:**
- `floorNumber: 0, referredFloorNumber: "Ground Floor"`
- `floorNumber: -1, referredFloorNumber: "Basement"`
- `floorNumber: 1.5, referredFloorNumber: "Mezzanine"`

### Commercial-Specific Fields

```typescript
  // Office/Commercial Details
  noOfSeats?: number;                         // For office spaces
  totalRooms?: number;                        // For PG/Guest houses
  waterSupply?: boolean;                      // Water availability
  typeOfWaterSupply?: "Borewell" | "Cauvery"; // Water source type
```

### Plot-Specific Fields

```typescript
  // Land/Plot Details
  plotNo?: string;                            // Plot identification
  plotLength?: number;                        // Plot dimensions
  plotBreadth?: number;
  oddSized?: boolean;                         // Irregular plot shape
```

### Furnishing and Building Details

```typescript
  // Furnishing (supports both residential and commercial)
  furnishing?: furnishing | furnishingCommercial;
  
  // Building Information
  ageOfTheBuilding?: ageOfTheBuilding;
  possession?: possession;
  availableFrom?: number;                     // Availability timestamp
  readyToMove?: boolean;
  handOverDate?: number;                      // Handover timestamp
```

### Financial Information

```typescript
  // Pricing (for resale properties)
  pricing?: {
    totalAskPrice?: number;                   // Total sale price
    pricePerSqft?: number;                    // Rate per square foot
  };
```

### Unified Rental Information

```typescript
  // Comprehensive Rental Details
  rentalInfo?: {
    // Primary rental terms
    rent: number;                             // Monthly rent
    deposit: number;                          // Security deposit
    maintenance: maintenance;                 // Maintenance inclusion
    maintenanceAmount: number;                // Maintenance cost
    commissionType: commissionType;           // Commission structure
    
    // For resale properties currently rented out
    rentalIncome?: number;                    // Current rental income
    currentDeposit?: number;                  // Existing tenant deposit
    startDate?: number;                       // Current lease start
    endDate?: number;                         // Current lease end
  };
```

### Tenant Preferences (Rental Properties)

```typescript
  // Rental Preferences
  tenantPreferences?: {
    preferredTenants: preferredTenants;       // Tenant type preference
    petsAllowed: boolean;                     // Pet policy
    nonVegAllowed: boolean;                   // Non-vegetarian policy
  };
```

### Property Features

```typescript
  // Special Features
  features?: {
    cornerUnit: boolean;                      // Corner unit status
    exclusive: boolean;                       // Exclusive listing
    ocReceived?: boolean;                     // Occupancy Certificate
  };
```

### Legal Documentation

```typescript
  // Legal and Compliance
  legalInfo?: {
    landKhata?: landKhata;                    // Land classification
    buildingKhata?: landKhata;                // Building classification
    eKhata: boolean;                          // Electronic Khata
    biappaApproved: boolean;                  // BIAPPA approval
    bdaApproved: boolean;                     // BDA approval
  };
```

### Amenities and Additional Features

```typescript
  // Facilities (unified for residential and commercial)
  amenities: amenities | commercialAmenities | [];
  
  // Additional Features
  parking?: number;                           // Number of parking spaces
  uds?: number;                               // Undivided share percentage
  suitableFor?: string | suitableWarehouse;  // Usage suitability
```

### Media and Documentation

```typescript
  // Media Files
  media?: {
    photos: string[];                         // Photo URLs
    videos: string[];                         // Video URLs  
    documents: string[];                      // Document URLs
  };
```

### Additional Information

```typescript
  // Extra Details
  extraDetails?: string;                      // Additional notes
  unitNumber?: string;                        // Unit identifier
}
```

## Usage Examples

### Residential Apartment (Resale)

```typescript
const resaleApartment: Property = {
  // Core identity
  propertyId: "RES-APT-001",
  listingType: "resale",
  propertyType: "residential",
  assetType: "apartment",
  
  // Agent information
  cpId: "CP001",
  agentName: "Rajesh Kumar",
  agentPhoneNumber: "+91-9876543210",
  
  // Location
  propertyName: "Prestige Lakeside Habitat",
  micromarket: "Varthur",
  area: "East Bangalore",
  zone: "East",
  communityType: "Gated",
  
  // Physical characteristics
  sbua: 1450,
  carpetArea: 1200,
  facing: "North",
  
  // Residential specifics
  apartmentType: "Simple",
  noOfBedrooms: 3,
  noOfBathrooms: 2,
  noOfBalconies: 2,
  floorNumber: 8,
  totalFloors: 15,
  
  // Furnishing and building
  furnishing: "Semi-Furnished",
  ageOfTheBuilding: "1-5 years",
  possession: "Ready to Move",
  
  // Financial information
  pricing: {
    totalAskPrice: 12500000,
    pricePerSqft: 8620
  },
  
  // Features and legal
  features: {
    cornerUnit: false,
    exclusive: true,
    ocReceived: true
  },
  
  legalInfo: {
    landKhata: "A",
    eKhata: true,
    biappaApproved: true,
    bdaApproved: true
  },
  
  // Amenities and parking
  amenities: ["Gym", "Pool", "Security", "Power Backup"],
  parking: 1,
  uds: 0.85,
  
  // Media
  media: {
    photos: ["photo1.jpg", "photo2.jpg"],
    videos: ["video1.mp4"],
    documents: ["khata.pdf", "agreement.pdf"]
  },
  
  // System metadata
  added: Date.now(),
  dateOfLastChecked: Date.now(),
  lastModified: Date.now(),
  status: "Available",
  kamStatus: "Approved",
  dataStatus: "Verified",
  stage: "Active"
};
```

### Commercial Office Space (Rental)

```typescript
const rentalOffice: Property = {
  // Core identity
  propertyId: "COM-OFF-001",
  listingType: "rental",
  propertyType: "commercial", 
  assetType: "Office Space",
  
  // Commercial specifics
  commercialPropertyType: "Office Space",
  commercialSubType: "Independent Office Space",
  
  // Physical characteristics
  sbua: 2500,
  carpetArea: 2200,
  facing: "East",
  
  // Office details
  noOfSeats: 60,
  floorNumber: 4,
  totalFloors: 12,
  furnishing: "Warm Shell",
  
  // Rental information
  rentalInfo: {
    rent: 175000,
    deposit: 1050000,
    maintenance: "Not Included",
    maintenanceAmount: 25000,
    commissionType: "Side by Side"
  },
  
  // Commercial amenities
  amenities: ["Power Backup", "Security", "Lifts", "CCTV Surveillance"],
  parking: 8,
  
  // Other required fields...
};
```

### Residential Villa (Rental)

```typescript
const rentalVilla: Property = {
  // Core identity
  propertyId: "RES-VIL-001",
  listingType: "rental",
  propertyType: "residential",
  assetType: "villa",
  
  // Physical characteristics
  sbua: 3200,
  carpetArea: 2800,
  plotArea: 4800,
  facing: "South",
  
  // Villa specifics
  structure: "G+1",
  noOfBedrooms: 4,
  noOfBathrooms: 4,
  noOfBalconies: 3,
  
  // Rental terms
  rentalInfo: {
    rent: 85000,
    deposit: 850000,
    maintenance: "Included",
    maintenanceAmount: 0,
    commissionType: "Side by Side"
  },
  
  // Tenant preferences
  tenantPreferences: {
    preferredTenants: ["Family"],
    petsAllowed: true,
    nonVegAllowed: true
  },
  
  // Other required fields...
};
```

## Type Safety and Validation

### Field Population Guidelines

**Always populate these fields:**
```typescript
// Core fields (required for all properties)
propertyId, listingType, propertyType, assetType
cpId, agentName, agentPhoneNumber, kamId, kamName
propertyName, micromarket, area, zone
sbua, facing, amenities
```

**Populate based on property type:**
```typescript
// Residential properties
if (propertyType === "residential") {
  // Always include: noOfBedrooms, noOfBathrooms, furnishing
  // Villa types: structure, plotArea
  // Apartments: floorNumber, totalFloors, apartmentType
}

// Commercial properties  
if (propertyType === "commercial") {
  // Always include: commercialPropertyType, commercialSubType
  // Offices: noOfSeats, floorNumber, furnishing
  // Warehouses: suitableFor, plotArea
}
```

**Populate based on listing type:**
```typescript
// Resale properties
if (listingType === "resale") {
  // Always include: pricing.totalAskPrice, pricing.pricePerSqft
}

// Rental properties
if (listingType === "rental") {
  // Always include: rentalInfo.rent, rentalInfo.deposit
  // Residential rentals: tenantPreferences
}
```

### Runtime Type Checking

```typescript
// Type guard functions
function isResidential(property: Property): boolean {
  return property.propertyType === "residential";
}

function isCommercial(property: Property): boolean {
  return property.propertyType === "commercial";
}

function isResale(property: Property): boolean {
  return property.listingType === "resale";
}

function isRental(property: Property): boolean {
  return property.listingType === "rental";
}

// Property type validators
function validateResidential(property: Property): boolean {
  return !!(
    isResidential(property) &&
    property.noOfBedrooms &&
    property.noOfBathrooms &&
    property.furnishing
  );
}

function validateCommercial(property: Property): boolean {
  return !!(
    isCommercial(property) &&
    property.commercialPropertyType &&
    property.commercialSubType
  );
}
```

### Property Processing Example

```typescript
function processProperty(property: Property) {
  // Type-safe property handling
  if (isResidential(property) && isResale(property)) {
    const bedrooms = property.noOfBedrooms; // TypeScript knows this exists
    const price = property.pricing?.totalAskPrice;
    console.log(`${bedrooms} BHK villa for ₹${price}`);
  }
  
  if (isCommercial(property) && isRental(property)) {
    const rent = property.rentalInfo?.rent;
    const seats = property.noOfSeats;
    console.log(`Office with ${seats} seats for ₹${rent}/month`);
  }
}
```

## Migration and Best Practices

### Field Mapping from Legacy Systems

```typescript
// Legacy to unified field mapping
const fieldMapping = {
  // Unified naming
  "name" → "propertyName",
  "doorFacing" → "facing",
  "floorNo" → "floorNumber",
  "exactFloorNo" → "floorNumber",
  "handOverData" → "handOverDate",
  
  // Grouped fields  
  "photos/videos/documents" → "media.{photos/videos/documents}",
  "totalAskPrice/pricePerSqft" → "pricing.{totalAskPrice/pricePerSqft}",
  "rent details" → "rentalInfo.{...}",
  "tenant preferences" → "tenantPreferences.{...}",
  "khata details" → "legalInfo.{...}",
  "property features" → "features.{...}"
};
```

### Data Validation Rules

```typescript
// Validation schema example
const PropertyValidation = {
  // Required for all properties
  required: ['propertyId', 'listingType', 'propertyType', 'assetType', 'sbua'],
  
  // Conditional requirements
  conditionalRequired: {
    residential: ['noOfBedrooms', 'noOfBathrooms'],
    commercial: ['commercialPropertyType', 'commercialSubType'],
    resale: ['pricing.totalAskPrice'],
    rental: ['rentalInfo.rent', 'rentalInfo.deposit']
  },
  
  // Field constraints
  constraints: {
    sbua: { min: 1, type: 'number' },
    noOfBedrooms: { in: [1,2,3,4,5,6,7] },
    floorNumber: { type: 'number' },
    parking: { min: 0, type: 'number' }
  }
};
```

## Benefits of the Unified Approach

### 1. **Flexibility**
- Single interface handles all property variations
- Easy to add new property types without schema changes
- Accommodates diverse property characteristics

### 2. **Consistency**
- Unified field names across property types
- Consistent data structure for similar concepts
- Standardized optional field patterns

### 3. **Maintainability**
- Single source of truth for property structure
- Centralized validation and business logic
- Easy to modify shared properties

### 4. **Developer Experience**
- IntelliSense support for all property fields
- Type safety with optional field handling
- Clear field organization and grouping

### 5. **Database Efficiency**
- Single collection/table for all properties
- Efficient indexing on discriminator fields
- Simplified querying and aggregation

This unified schema provides maximum flexibility while maintaining type safety and data consistency across ACN's diverse property portfolio.