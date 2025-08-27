# Canvas-Homes: Complete CRM Schema & Workflow Documentation

## System Overview

Canvas-Homes operates as an end-to-end CRM system for real estate sales and marketing, encompassing lead generation, nurturing, conversion, and campaign management. The system manages the complete customer journey from initial marketing touchpoints through final property booking.

### Core Business Model
- **Lead Acquisition**: Website scraping, manual entry, bulk uploads, marketing campaigns
- **Lead Management**: Agent assignment, status tracking, activity logging
- **Conversion Process**: Structured follow-up workflow through multiple stages
- **Marketing Integration**: Campaign performance tracking and ROI analysis

---

## Data Architecture Schema

### Collections Overview
- **canvas_homes-users**: User profiles and contact information
- **canvas_homes-leads**: Core lead management and tracking
- **canvas_homes-campaigns**: Marketing campaign performance data
- **canvas_homes-enquiries**: Detailed enquiry tracking with full history
- **canvas_homes-tasks**: Agent task management and scheduling

---

## Collection Schemas

### 1. Users Collection (canvas_homes-users)

**Purpose**: Stores customer/lead contact information and profile data.

| Field        | Type        | Example              | Description                    |
|--------------|-------------|----------------------|--------------------------------|
| userId       | string      | "user_001"           | Unique user identifier         |
| name         | string      | "Anjali Sinha"       | Customer full name             |
| phoneNumber  | string      | "+919999999999"      | Primary contact number         |
| emailAddress | string      | "anjali@example.com" | Email address (nullable)       |
| label        | string      | null                 | User classification label      |
| added        | number (TS) | 1717833600000        | Creation timestamp             |
| lastModified | number (TS) | 1717916400000        | Last update timestamp          |

### 2. Leads Collection (canvas_homes-leads)

**Purpose**: Core lead tracking with status, assignment, and progression data.

| Field         | Type        | Example             | Options                                                                                    |
|---------------|-------------|---------------------|--------------------------------------------------------------------------------------------|
| leadId        | string      | "lead_001"          | Unique lead identifier                                                                     |
| agentId       | string      | "agent_123"         | Assigned agent ID                                                                          |
| agentName     | string      | "Rahul Mehta"       | Assigned agent name                                                                        |
| name          | string      | "Deepak"            | Lead name (from user record)                                                               |
| phoneNumber   | string      | "+91 9999999999"    | Lead contact number                                                                        |
| propertyName  | string      | "Sattva Hills"      | Property of interest                                                                       |
| tag           | string      | "hot"               | cold \| potential \| hot \| super hot                                                      |
| userId        | string      | "user_789"          | Reference to user record                                                                   |
| source        | string      | "META"              | Lead acquisition source                                                                    |
| stage         | string      | "lead registered"   | lead registered \| initial contacted \| site visited \| eoi collected \| booking confirmed |
| taskType      | string      | "lead registration" | Current/next task type                                                                     |
| scheduledDate | number (TS) | 1717833600000       | Next scheduled activity date                                                               |
| leadStatus    | string      | "interested"        | interested \| not interested \| not contact yet \| verified                               |
| state         | string      | "open"              | **fresh \| open \| closed \| dropped**                                                    |
| rnr           | boolean     | false               | Ring No Response flag                                                                      |
| rnrCount      | number      | 0                   | Count of consecutive RNR attempts                                                          |
| added         | number (TS) | 1717833600000       | Lead creation timestamp                                                                    |
| completionDate| number (TS) | null                | Lead closure/completion date                                                               |
| lastModified  | number (TS) | 1717916400000       | Last update timestamp                                                                      |

### 3. Campaigns Collection (canvas_homes-campaigns)

**Purpose**: Marketing campaign performance tracking and budget management.

| Field            | Type        | Example        | Description                           |
|------------------|-------------|----------------|---------------------------------------|
| campaignId       | string      | "cmp_001"      | Unique campaign identifier            |
| campaignName     | string      | "March Promo"  | Campaign display name                 |
| propertyName     | string      | "Green Villas" | Target property                       |
| source           | string      | "Google"       | Marketing platform (Google/Meta/LinkedIn) |
| medium           | string      | "CPC"          | Campaign type/medium                  |
| startDate        | string      | "2024-06-07"   | Campaign start date                   |
| endDate          | string      | "2024-06-14"   | Campaign end date                     |
| activeDuration   | string      | "7 days"       | Campaign duration                     |
| totalCost        | string      | "15000"        | Total campaign spend                  |
| totalClicks      | number      | 1250           | Total clicks generated                |
| totalImpressions | number      | 45000          | Total impressions                     |
| totalConversions | string      | "240"          | Total leads/conversions               |
| ctr              | string      | "2.78"         | Click-through rate                    |
| averageCpc       | string      | "12.00"        | Average cost per click                |
| status           | string      | "Active"       | Campaign status                       |
| isPaused         | boolean     | false          | Campaign pause status                 |
| costPerDay       | string      | "2142.86"      | Daily spend rate                      |
| dailyAvgCost     | string      | "2142.86"      | Daily average cost                    |
| totalConversionsValue | string | "3600000"      | Total conversion value                |
| added            | number (TS) | 1717651200000  | Campaign creation timestamp           |
| lastModified     | number (TS) | 1717923600000  | Last update timestamp                 |

### 4. Enquiries Collection (canvas_homes-enquiries)

**Purpose**: Comprehensive enquiry tracking with complete interaction history and agent notes.

| Field                               | Type        | Example           | Options                                                                                                                                                      |
|-------------------------------------|-------------|-------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| enquiryId                           | string      | "enq_001"         | Unique enquiry identifier                                                                                                                                    |
| leadId                              | string      | "lead_123"        | Reference to lead record                                                                                                                                     |
| agentId                             | string      | "agent_456"       | Current assigned agent                                                                                                                                       |
| agentName                           | string      | "Rahul Mehta"     | Current agent name                                                                                                                                           |
| propertyId                          | string      | "prop_789"        | Property identifier                                                                                                                                          |
| propertyName                        | string      | "Green Villas"    | Property name                                                                                                                                                |
| source                              | string      | "Facebook Ads"    | Lead source                                                                                                                                                  |
| leadStatus                          | string      | "interested"      | interested \| follow up \| not interested \| not connected \| visit unsuccessful \| visit dropped \| eoi dropped \| booking dropped \| requirement collected |
| stage                               | string      | "lead registered" | lead registered \| initial contacted \| site visited \| eoi collected \| booking confirmed                                                                   |
| rnr                                 | boolean     | false             | Ring No Response status                                                                                                                                      |
| rnrCount                            | number      | 0                 | RNR attempt counter                                                                                                                                          |
| **agentHistory**                    | **array**   | **Array of objects** | **Agent assignment history**                                                                                                                              |
| ├─ agentHistory[].timestamp         | number (TS) | 1717905000000     | Assignment timestamp                                                                                                                                         |
| ├─ agentHistory[].agentId           | string      | "agent_456"       | Agent identifier                                                                                                                                             |
| ├─ agentHistory[].agentName         | string      | "Rahul Mehta"     | Agent name                                                                                                                                                   |
| └─ agentHistory[].lastStage         | string      | "site visited"    | Stage at time of assignment                                                                                                                                  |
| **notes**                           | **array**   | **Array of objects** | **Agent notes and communications**                                                                                                                        |
| ├─ notes[].timestamp                | number (TS) | 1717906000000     | Note creation time                                                                                                                                           |
| ├─ notes[].agentId                  | string      | "agent_456"       | Note author ID                                                                                                                                               |
| ├─ notes[].agentName                | string      | "Rahul Mehta"     | Note author name                                                                                                                                             |
| ├─ notes[].taskType                 | string      | "initial contact" | Associated task type                                                                                                                                         |
| └─ notes[].note                     | string      | "Follow up call"  | Note content                                                                                                                                                 |
| **activityHistory**                 | **array**   | **Array of objects** | **Complete activity log**                                                                                                                                 |
| ├─ activityHistory[].timestamp      | number (TS) | 1717907000000     | Activity timestamp                                                                                                                                           |
| ├─ activityHistory[].agentId        | string      | "agent_456"       | Agent performing activity                                                                                                                                    |
| ├─ activityHistory[].agentName      | string      | "Rahul Mehta"     | Agent name                                                                                                                                                   |
| ├─ activityHistory[].activityType   | string      | "call"            | Activity type (call, email, meeting, etc.)                                                                                                                  |
| ├─ activityHistory[].activityStatus | string      | "completed"       | Activity outcome                                                                                                                                             |
| └─ activityHistory[].activityNote   | string      | "Left voicemail"  | Activity details                                                                                                                                             |
| tag                                 | string      | "hot"             | cold \| potential \| hot \| super hot                                                                                                                        |
| documents                           | array       | []                | Attached documents                                                                                                                                           |
| state                               | string      | "fresh"           | **fresh \| open \| closed \| dropped**                                                                                                                      |
| requirements                        | array       | []                | Customer requirements                                                                                                                                        |
| added                               | number (TS) | 1717833600000     | Enquiry creation timestamp                                                                                                                                   |
| lastModified                        | number (TS) | 1717916400000     | Last update timestamp                                                                                                                                        |

### 5. Tasks Collection (canvas_homes-tasks)

**Purpose**: Agent task scheduling, tracking, and completion management.

| Field          | Type        | Example             | Options                                                                         |
|----------------|-------------|---------------------|---------------------------------------------------------------------------------|
| taskId         | string      | "task_001"          | Unique task identifier                                                          |
| enquiryId      | string      | "enq_123"           | Reference to enquiry                                                            |
| agentId        | string      | "agent_456"         | Assigned agent                                                                  |
| agentName      | string      | "Rahul Mehta"       | Agent name                                                                      |
| name           | string      | "Deepak"            | Lead/customer name                                                              |
| leadAddDate    | number (TS) | 1717833600000       | Original lead creation date                                                     |
| propertyName   | string      | "Green Villas"      | Target property                                                                 |
| type           | string      | "lead registration" | lead registration \| initial contact \| site visit \| eoi collection \| booking |
| eventName      | string      | "Follow up call"    | Specific task description                                                       |
| status         | string      | "open"              | **open \| complete**                                                            |
| stage          | string      | "initial contacted" | Current lead stage                                                              |
| leadStatus     | string      | "interested"        | Current lead status                                                             |
| tag            | string      | "hot"               | Lead priority tag                                                               |
| taskResult     | string      | null                | eoi collected \| eoi not collected \| change property                           |
| scheduledDate  | number (TS) | 1717833600000       | Task due date                                                                   |
| added          | number (TS) | 1717651200000       | Task creation timestamp                                                         |
| completionDate | number (TS) | 1717923600000       | Task completion timestamp                                                       |
| lastModified   | number (TS) | 1717927200000       | Last update timestamp                                                           |

---

## Complete Business Workflow

### 1. Lead Acquisition Phase

**Lead Sources:**
- Website scraping (primary method)
- Manual lead entry via Add Lead modal
- Bulk CSV/Excel uploads
- Marketing campaign conversions

#### Manual Lead Addition Process (Add Lead Modal)

The Add Lead Modal supports two methods of lead creation:

**Method 1: Manual Entry**
1. **Lead Information Collection:**
   - Lead Name (required, min 2 characters, max 50 characters)
   - Phone Number with Country Code (required, validated by country-specific rules)
   - Property Selection (searchable dropdown with existing properties + facet properties)
   - Source Selection (Google, LinkedIn, Facebook, Instagram, Classified, WhatsApp, Referral, Society Campaign)
   - Agent Assignment (searchable dropdown with active sales agents)

2. **Validation Rules:**
   - Phone number format validation per country code
   - Duplicate detection: phone number + property name combination
   - Required field validation for all mandatory fields
   - Phone number length validation (8-15 digits based on country)

3. **Data Processing Flow:**
```
Form Submission → Duplicate Check → User Creation → Lead Creation → Enquiry Creation → Success Response
```

**Method 2: Bulk Upload**
1. **File Upload Support:**
   - Accepts CSV, XLSX, XLS file formats
   - Drag-and-drop or click-to-upload interface
   - File validation and preview
   
2. **Bulk Processing:**
   - Batch validation of all records
   - Duplicate detection across entire upload
   - Error reporting for invalid entries
   - Success metrics: processed, duplicates, errors

#### Detailed Lead Creation Workflow

**Step 1: Duplicate Detection**
```javascript
const duplicate = await leadService.checkDuplicateLead(
    formattedPhoneNumber,
    formData.propertyName.toLowerCase()
)
// Prevents duplicate leads with same phone + property combination
```

**Step 2: User Record Creation**
```javascript
const userData = {
    name: formData.name.trim().toLowerCase(),          // Normalized name
    phoneNumber: formatPhoneNumber(countryCode, phoneNumber), // Full international format
    emailAddress: null,                                // Optional field
    label: null,                                       // User classification
    added: getUnixDateTime(),                          // Unix timestamp
    lastModified: getUnixDateTime()
}
userId = await userService.create(userData)
```

**Step 3: Lead Record Creation**
```javascript
const leadData = {
    agentId: formData.agentId,                        // Selected agent ID
    agentName: formData.agentName.toLowerCase(),      // Agent name (normalized)
    name: formData.name.trim().toLowerCase(),         // Lead name (normalized)  
    phoneNumber: formattedPhoneNumber,                // Full phone with country code
    propertyName: formData.propertyName.toLowerCase(), // Property name (normalized)
    tag: null,                                        // Priority tag (set later)
    userId: userId,                                   // Reference to user record
    source: formData.source.toLowerCase(),            // Lead source (normalized)
    stage: null,                                      // No initial stage
    taskType: null,                                   // No initial task
    scheduledDate: null,                              // No scheduled activity
    leadStatus: null,                                 // Not contacted yet
    state: 'fresh',                                   // Initial state - not contacted
    rnr: false,                                       // No Ring No Response
    rnrCount: 0,                                      // RNR counter starts at 0
    added: getUnixDateTime(),                         // Creation timestamp
    completionDate: null,                             // Not completed
    lastModified: getUnixDateTime()                   // Last update timestamp
}
leadId = await leadService.create(leadData)
```

**Step 4: Enquiry Record Creation**
```javascript
const enquiryData = {
    leadId: leadId,                                   // Reference to lead record
    agentId: formData.agentId,                       // Assigned agent
    agentName: formData.agentName,                   // Agent name (display format)
    propertyId: formData.propertyId,                 // Property ID (can be null)
    propertyName: formData.propertyName.toLowerCase(), // Property name (normalized)
    source: formData.source.toLowerCase(),            // Lead source (normalized)
    leadStatus: null,                                // No status yet
    stage: null,                                     // No stage progression
    rnr: false,                                      // No RNR initially
    rnrCount: 0,                                     // RNR counter
    
    // Agent assignment history
    agentHistory: [{
        agentId: formData.agentId,
        agentName: formData.agentName.toLowerCase(),
        timestamp: getUnixDateTime(),
        lastStage: null                              // No previous stage
    }],
    
    notes: [],                                       // Empty notes array
    
    // Activity tracking starts with lead creation
    activityHistory: [{
        activityType: 'lead added',                  // Initial activity
        timestamp: getUnixDateTime(),
        agentName: currentUser.displayName.toLowerCase(), // Creator name
        data: {}                                     // Additional data
    }],
    
    tag: null,                                       // No priority tag initially
    documents: [],                                   // Empty documents array
    state: 'fresh',                                  // Initial state - not contacted
    requirements: [],                                // Empty requirements
    added: getUnixDateTime(),                        // Creation timestamp
    lastModified: getUnixDateTime()                  // Last update timestamp
}
await enquiryService.create(enquiryData)
```

**Key Business Rules in Lead Creation:**

1. **Data Normalization**: All names and text fields converted to lowercase for consistency
2. **Phone Formatting**: Country code + number formatted to international standard
3. **Duplicate Prevention**: Phone + property combination must be unique
4. **State Initialization**: All new leads start in 'fresh' state
5. **Activity Logging**: Lead creation event logged in enquiry activity history
6. **Agent Assignment**: Agent selected during creation, logged in agent history
7. **Property Linking**: Properties can be from pre-launch database or facet-derived names

**Property Selection Logic:**
- Pre-launch properties: Have propertyId from database
- Facet properties: Have propertyId = null, name from search facets
- Combined dropdown with capitalized display names
- Value format: "propertyId|propertyName" for processing

**Agent Selection Process:**
- Agents fetched from internal service with role filtering
- Only sales agents or admins shown in dropdown
- Default agents provided as fallback
- Value format: "agentId|agentName" for processing

**Post-Creation State:**
- **Lead State**: `fresh` (newly created, awaiting first contact)
- **Lead Status**: `null` (no contact attempted)
- **Stage**: `null` (no progression started)
- **Next Action**: Agent must initiate first contact to progress lead
- **Task Creation**: No automatic task creation (manual process initiation)

### 2. Lead Management Workflow

#### State Progression Model
```
FRESH → OPEN → CLOSED
   ↓      ↓       ↑
   ↓   DROPPED ←  ↑
   ↓      ↓       ↑
   → DROPPED ←────┘
```

**State Definitions:**
- **Fresh**: New leads, not yet contacted
- **Open**: Active leads with agent engagement
- **Closed**: Successfully converted (booking confirmed)
- **Dropped**: Lost interest or unqualified at any stage

#### Lead Status Evolution
```
not contact yet → interested/not interested → verified → booking confirmed
```

#### Stage Progression
```
lead registered → initial contacted → site visited → eoi collected → booking confirmed
```

### 3. Task Management System

**Task Types & Sequence:**
1. **Lead Registration**: Initial lead setup
2. **Initial Contact**: First outreach attempt
3. **Site Visit**: Property viewing scheduled/completed
4. **EOI Collection**: Expression of Interest documentation
5. **Booking**: Final conversion process

**Task Status Flow:**
```
OPEN → COMPLETE
  ↓       ↓
MISSED → RESCHEDULE → OPEN
```

**Task Outcomes:**
- **Connected Tasks**: 
  - Interested → Next stage task created
  - Not Interested → Lead marked dropped
  - Reschedule → New task with future date
- **Not Connected Tasks**:
  - Reschedule Task → RNR count incremented
  - Close Lead → Lead marked dropped

### 4. Agent Interaction Patterns

**Call Result Handling:**
- **Connected + Interested**: Progress to next stage
- **Connected + Not Interested**: Mark as dropped
- **Connected + Reschedule**: Create follow-up task
- **Not Connected**: Increment RNR counter, reschedule
- **RNR Limit Reached**: Auto-drop or reassign

**Activity Tracking:**
- All interactions logged in enquiry activityHistory
- Agent notes captured with timestamps
- Task completion triggers stage progression
- Document attachments linked to enquiries

### 5. Marketing Integration

**Campaign Performance Tracking:**
- Cost per lead (CPL) calculation
- Lead attribution to specific campaigns
- Source tracking throughout conversion funnel
- ROI analysis by property and campaign

**Lead Attribution Model:**
```
Campaign → Lead Source → Lead Creation → Conversion → Revenue Attribution
```

### 6. Data Flow Architecture

#### Lead Creation Flow
```
1. Lead Source Identified
2. User Record Created/Updated (canvas_homes-users)
3. Lead Record Created (canvas_homes-leads) - state: 'fresh'
4. Enquiry Record Created (canvas_homes-enquiries) - state: 'fresh'
5. Initial Task Created (canvas_homes-tasks) - type: 'lead registration'
```

#### Task Completion Flow
```
1. Agent Completes Task
2. Task Status Updated (canvas_homes-tasks) - status: 'complete'
3. Lead Stage Updated (canvas_homes-leads)
4. Enquiry Status Updated (canvas_homes-enquiries)
5. Activity Logged in enquiry.activityHistory
6. Next Task Created (if progression continues)
7. Lead State Updated (fresh→open, open→closed)
```

#### State Change Triggers
- **Fresh → Open**: First agent contact attempt
- **Open → Closed**: Successful booking completion
- **Any → Dropped**: Loss of interest at any stage
- **RNR Management**: Automated after threshold reached

### 7. Business Rules & Validations

**Duplicate Prevention:**
- Phone number + Property name uniqueness check
- Cross-reference existing leads before creation

**Task Scheduling Rules:**
- Maximum RNR attempts before auto-drop
- Minimum gap between follow-up attempts
- Escalation rules for missed tasks

**Agent Assignment Logic:**
- Workload balancing algorithms
- Property specialization matching
- Geographic territory assignment

**Data Integrity Rules:**
- Required field validations
- State transition validations
- Cross-collection referential integrity

### 8. Reporting & Analytics

**Key Performance Indicators:**
- Lead conversion rates by source
- Agent performance metrics
- Task completion rates
- Campaign ROI analysis
- Stage-wise conversion funnels

**Dashboard Metrics:**
- Daily/weekly/monthly lead volumes
- Pipeline velocity analysis
- Cost per acquisition tracking
- Agent productivity measurements

---

## Integration Points

### External System Connections
- **Marketing Platforms**: Google Ads, Facebook Ads, LinkedIn
- **Communication**: WhatsApp, Email, SMS
- **Document Management**: File storage and retrieval
- **Reporting**: Analytics and BI tools

### API Endpoints
- Lead creation and management
- Task scheduling and updates
- Campaign data synchronization
- Real-time status updates

---

## Security & Compliance

### Data Protection
- Personal information encryption
- Access control by role/permission
- Audit trails for all modifications
- Data retention policies

### Business Continuity
- Regular data backups
- System redundancy
- Disaster recovery procedures
- Performance monitoring

This comprehensive schema and workflow documentation provides the complete framework for the Canvas-Homes CRM system, covering all aspects from initial lead acquisition through final conversion and ongoing relationship management.