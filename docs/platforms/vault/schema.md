# Vault Product: Schema and Workflow Documentation

## 1. Data Schema with Field Effects

### 1.1 Core Entities

#### User Schema
```typescript
interface User {
    // 🆔 Identification
    userId: string              // Unique identifier for the user - primary key
    userName: string            // Full name of the user - displayed in UI and search
    emailAddress: string | null // Email for communication - optional
    phoneNumber: string         // Primary phone for contact - used for user lookup
    phoneNos?: PhoneRecord[]    // Additional phone numbers with timestamps
    userSource: string          // How the user was acquired (e.g., "Inbound", "Referral")
    addressLine1s: string[]     // Society names - used for filtering
    addressLine2s: string[]     // Unit numbers
    addressLine3s: string[]     // Block numbers

    // 👤 Agent Info
    agentName: string           // Who added the user - for accountability
    acquisitionPOC: string      // Person who acquired the lead - for assignment and filtering
    salesPOC: string            // Sales point of contact - for assignment and filtering

    // 🔄 Lifecycle & Status
    lifecycle: string           // "lead" or "customer" - affects UI display and metrics
    userInterest: string        // "interested", "not interested", "pause" - affects service status
                                // CRITICAL: Changing to "not interested" moves service to closed
                                // CRITICAL: Changing to "pause" requires pausedUntil timestamp
    escalated: boolean          // Flagged for urgent attention - affects filtering and metrics
    onHoldUntil?: number        // Unix timestamp when hold expires - affects UI display
    lost: boolean               // Permanently lost lead - affects metrics and filtering

    // 📞 Contact Result Tracking
    callStatus: string          // Result of last call - affects UI display and follow-up
    ASLC: number                // Last call timestamp - used for filtering and age calculation
    ASLA: number                // Last answered call timestamp - used for filtering and age calculation

    // 📊 Counters & Metrics - CRITICAL: These are derived values updated by sync functions
    numberOfServices: number    // Total count of associated services
    activeSr?: number           // Count of services in "active" bucket
    pausedSr?: number           // Count of services with "paused" status
    dependencySr?: number       // Count of services paused due to dependency
    blockedSr?: number          // Count of services in "blocked" bucket
    preActiveSr: number         // Count of services in "pre active" bucket
    closedSr?: number           // Count of services in "closed" bucket
    archivedSr?: number         // Count of services in "archived" bucket
    prioritySr: number          // Count of services with priority flag
    docSubmittedSr: number      // Count of services with documents submitted
    qualifiedCount?: number     // Count of services with "qualified" stage
    unqualifiedCount: number    // Count of services with "unqualified" stage
    lostSr?: number             // Count of services with "lost" status
    totalPaidAmount: number     // Sum of all payments for this user's services

    // 🔗 Associations
    serviceIds: string[]        // IDs of all associated services - for lookup and counts
    paymentIds?: string[]       // IDs of all associated payments - for lookup

    // 📝 Notes
    notes: NoteEntry[]          // History of notes added by agents - displayed in UI

    // 📅 Timestamps
    added: number               // When user was created - for age calculation
    lastModified: number        // When user was last updated - for change tracking

    // 🧾 Audit / Last Update Info
    updateBy?: {                // Who last updated each critical field - for accountability
        userInterest?: string
        escalated?: string
        acquisitionPOC?: string
        salesPOC?: string
    }

    address?: string            // Legacy field - use addressLine fields instead
    activity: Activity[]        // History of all changes - for audit trail
}
```

#### Service Schema
```typescript
interface Service {
    // 🆔 Identification
    serviceId: string           // Unique identifier - primary key, displayed as SR ID
    serviceName: string         // Type of service (e.g., "E-Khata", "Bescom") - affects default amount
    userId: string              // Reference to parent user - for relationship
    userName: string            // Duplicated from User for display - must stay in sync
    phoneNumber: string         // Duplicated from User for display - must stay in sync
    serviceSource: string       // How the service was acquired - for filtering

    // 👤 Agent Info
    agentName: string           // Who added the service - for accountability
    acquisitionPOC: string      // Person who acquired the lead - for assignment and filtering
    serviceSalesPOC: string     // Sales POC for the service - may differ from user salesPOC
    servicePOC?: string         // Person responsible for converting - for assignment
    blockerPOC?: string         // Person who handles if blocked - for assignment

    // 🔄 Lifecycle & Status - CRITICAL FIELDS THAT CONTROL PAGE VISIBILITY
    lifecycle: string           // "lead" or "customer" - affects metrics
    bucket: 'pre active' | 'active' | 'blocked' | 'closed' | 'archived'  
                                // CRITICAL: Controls which page the service appears on
                                // Changing bucket requires bucketTransitions update
    serviceStatus: string       // "open", "paused", "lost", "closed" - affects filtering
                                // CRITICAL: Changing to "paused" requires pauseMetadata
                                // CRITICAL: Changing to "lost" requires confirmation
    serviceStage: string        // Workflow stage - changes available substages
                                // Pre-active: "unqualified", "qualified"
                                // Active: "Doc", "Filing", "Awaiting", "Correction", "To Close"
    subStage: string            // Current substep within stage - changes based on serviceStage
                                // CRITICAL: Final substage of each stage auto-advances to next stage
                                // CRITICAL: Setting to "Blocked" moves to blocked bucket
    escalated: boolean          // Flagged for urgent attention - affects filtering and metrics
    priority: boolean           // High priority service - affects filtering and metrics
    pauseMetadata?: PauseMetadata  // Details about pause - required when serviceStatus is "paused"
    onHoldUntil?: number        // Unix timestamp when hold expires - for UI display

    // 📞 Contact Result Tracking
    callStatus: string          // Result of last call - affects UI display and follow-up
    ASLC: number                // Last call timestamp - for filtering and age calculation
    ASLA: number                // Last answered call timestamp - for filtering and age calculation

    // 📍 Address
    addressLine1: string        // Society name - for filtering and display
    addressLine2: string        // Unit number - for display
    addressLine3: string        // Block number - for display
    address?: string            // Legacy field - use addressLine fields instead

    // 📊 Financials
    serviceAmount: number       // Total amount for the service - set from servicePrices
    amountPaid: number          // Sum of all payments - updated when payments added/edited

    // 📄 Process Tracking
    docummentSubmissionStatus: boolean  // Whether docs are submitted
                                        // CRITICAL: Required for moving to active
    summaryEmailSentStatus: boolean     // Whether summary email was sent - for tracking
    blockerReason: string       // Why service is blocked - required for blocked bucket
    awaitingUntil?: number      // Unix timestamp for awaiting status - for UI display

    // 🔗 Associations
    paymentIds: string[]        // IDs of all associated payments - for lookup

    // 📝 Notes & Communication
    notes: NoteEntry[]          // History of notes added by agents - displayed in UI
    communicationTasks: CommunicationTask[]  // Pending communication tasks - displayed in UI

    // 📅 Timestamps
    added: number               // When service was created - for age calculation
    lastModified: number        // When service was last updated - for change tracking
    completionTime?: number     // When service was completed - set when moved to closed
    blockerResolutionTime?: number  // When blocker was resolved - set when unblocked
    bucketTransitions?: BucketTransition[]  // History of bucket changes with timestamps
                                            // CRITICAL: Must be updated whenever bucket changes
    appliedDate?: number        // When service was applied - set at specific stages

    // 🧾 Audit / Last Update Info
    updateBy?: {                // Who last updated each critical field - for accountability
        serviceStatus?: string
        servicePOC?: string
        bucket?: string
        priority?: string
        serviceStage?: string
        blockerPOC?: string
        acquisitionPOC?: string
        serviceSalesPOC?: string
        docummentSubmissionStatus?: string
        escalated?: string
        substage?: string
    }
}
```

#### Payment Schema
```typescript
interface Payment {
    // Identification
    paymentId: string           // Unique identifier - primary key
    userId: string              // Reference to parent user - for relationship
    serviceId: string           // Reference to parent service - for relationship
    transactionId: string | null // External payment reference - for reconciliation

    // Payment Info
    paymentType: string         // Type of payment - affects UI display
    paymentAmount: number       // Amount paid - added to service.amountPaid
                                // CRITICAL: Triggers update of user.totalPaidAmount
    serviceAmount: number       // Total service amount - for reference
    paymentMethod: string | null // How payment was made - for tracking

    // Status / Timing
    paymentStatus: string       // Status of payment - affects metrics
    paymentDate: number | null  // When payment was made - for filtering
    dueDate: number | null      // When payment is due - for reminders

    // Notes
    notes: NoteEntry | null     // Additional information about payment

    // Timestamps
    added: number               // When payment record was created - for tracking

    // Flags / Admin
    isDeleted?: boolean         // Soft delete flag - affects filtering
    agentName?: string          // Who recorded the payment - for accountability
}
```

### 1.2 Supporting Types with Field Effects

```typescript
interface PauseMetadata {
    pausedUntil?: number        // Unix timestamp when pause expires - affects UI display
                                // CRITICAL: Required when service is paused
    pausedBy?: string           // Who paused the service - for accountability
    dueToDependency?: boolean   // Whether pause is due to dependency - affects metrics
    dependencyServiceId?: string // ID of service this depends on - for relationship
                                // CRITICAL: Required when dueToDependency is true
}

interface BucketTransition {
    bucket: 'pre active' | 'active' | 'blocked' | 'closed' | 'archived'
                                // Which bucket service moved to - for tracking
    enteredAt: number           // Unix timestamp of transition - for age calculation
                                // CRITICAL: Used to calculate bucket age
}

interface CommunicationTask {
    taskId: string              // Unique identifier - primary key
    srId: string                // Service ID reference - for relationship
    title: string               // Task title - for display
    detail: string              // Task details - for display
    message: string             // Message to send - for communication
    status: 'pending' | 'done'  // Task status - affects UI display
                                // CRITICAL: Pending tasks show red dot in Communication tab
    assignedTo: string          // Who should complete the task - for assignment
    createdAt: number           // When task was created - for tracking
    dueDate: number             // When task is due - for prioritization
    triggerEvent: string        // What triggered the task - for tracking
}

interface NoteEntry {
    noteContent: string         // Text of the note - for display
    noteEntryDateTime: number   // When note was added - for sorting
    noteId?: string             // Optional unique identifier - for reference
    agentName: string           // Who added the note - for accountability
    type?: string               // Category of note - for filtering
}

interface Activity {
    id?: number                 // Optional unique identifier - for reference
    time: number                // When activity occurred - for sorting
    user: string                // Who performed the action - for accountability
    action: string              // What was done - for display
    target?: string             // What was affected - for display
    note?: string               // Additional information - for display
    from?: string               // Previous value - for tracking changes
    to?: string                 // New value - for tracking changes
    changes?: string            // Description of changes - for display
    status?: string             // Status after action - for tracking
    serviceId?: string          // Related service - for filtering
    label?: string              // Category label - for filtering
    details?: string[]          // Additional details - for display
}

type PhoneRecord = {
    number: string              // Phone number - for contact
    addedOn: number             // When number was added - for tracking
}
```

## 2. Page Structure and Workflow with Field Dependencies

### 2.1 User Level Pages

#### Intake Page
- **Purpose**: Initial entry point for leads and new users
- **Key Features and Field Dependencies**:
  - **Add Lead Functionality**:
    - Checks `phoneNumber` in User schema to determine if user exists
    - If user exists: Creates new Service for existing User and updates `serviceIds` array
    - If user doesn't exist: Creates new User and Service records
    - Sets `userSource` to track how lead was acquired

  - **Interest Field Effects**:
    - Changes to `userInterest` have critical effects:
      - Setting to "interested": Default state for active leads
      - Setting to "not interested": Moves service to closed bucket, sets `serviceStatus: 'closed'`
      - Setting to "pause": Opens modal to set `onHoldUntil` timestamp, sets `userInterest: 'on hold'`

  - **Filters**:
    - Interest: Filters by `userInterest` field
    - Acquisition POC: Filters by `acquisitionPOC` field
    - Sales POC: Filters by `salesPOC` field
    - Priority: Filters by services with `priority: true`
    - Service Stage: Filters by services with specific `serviceStage`
    - Escalated: Filters by `escalated: true`
    - Date: Filters by `added` timestamp

  - **Metrics Calculations**:
    - Total Leads: Count of all users
    - Escalated Leads: Count of users with `escalated: true`
    - Qualified: Count based on service `serviceStage: 'qualified'`
    - Total SRs: Sum of `numberOfServices` across all users
    - Priority SRs: Count of services with `priority: true`
    - Stale: Count of users with `added` timestamp older than 15 days

- **Key Transitions and Trigger Conditions**:
  - **Pre-active to Active**:
    - Triggered when any service for a user has:
      - `serviceStage: 'qualified'`
      - `serviceStatus: 'open'`
      - `docummentSubmissionStatus: true`
    - Effect: Service `bucket` changes to 'active', adds new entry to `bucketTransitions`

  - **Interest Status Change**:
    - Changing `userInterest` to "not interested":
      - Sets service `serviceStatus: 'closed'`
      - Updates `userInterest` in User record
      - Logs activity in User and Service `activity` arrays
    - Changing `userInterest` to "on hold":
      - Opens pause modal to set `onHoldUntil` timestamp
      - Updates `userInterest` in User record
      - Logs activity in User and Service `activity` arrays

### 2.2 Service Level Pages

#### Pre-Active Page
- **Purpose**: Manages services in initial qualification stage
- **Data Filtering**: Shows services with `bucket: 'pre active'`
- **Key Features and Field Dependencies**:
  - **Document Submission Toggle**:
    - Toggles `docummentSubmissionStatus` boolean
    - Required to be `true` before moving to active bucket
    - Disabled if `serviceStage: 'unqualified'`

  - **Service Stage Dropdown**:
    - Options: "Unqualified", "Qualified"
    - Changes `serviceStage` field
    - Affects metrics and ability to move to active

  - **Move to Active Action**:
    - Requires:
      - `serviceStage: 'qualified'`
      - `serviceStatus: 'open'`
      - `docummentSubmissionStatus: true`
    - Effects:
      - Changes `bucket` to 'active'
      - Adds entry to `bucketTransitions` array with current timestamp
      - Updates counters in User record (`preActiveSr`, `activeSr`)
      - Logs activity in Service `activity` array

  - **Metrics Calculations**:
    - Total SRs: Count of all services in pre-active bucket
    - Qualified SRs: Count of services with `serviceStage: 'qualified'`
    - Unqualified SRs: Count of services with `serviceStage: 'unqualified'`
    - Docs Submitted: Count of services with `docummentSubmissionStatus: true`
    - Escalated SRs: Count of services with `escalated: true`
    - Priority SRs: Count of services with `priority: true`
    - Stale: Count of services with `added` older than 15 days

- **Key Field Validations**:
  - Cannot mark documents as submitted if `serviceStage: 'unqualified'`
  - Cannot move to active without documents submitted
  - Service must be qualified to move to active

#### Active Page
- **Purpose**: Main workspace for active service processing
- **Data Filtering**: Shows services with `bucket: 'active'` and either:
  - Open tab: `serviceStatus: 'open'`
  - Paused tab: `serviceStatus: 'paused'`
- **Key Features and Field Dependencies**:
  - **Open/Paused Toggle**:
    - Filters between services with:
      - `serviceStatus: 'open'` (Open tab)
      - `serviceStatus: 'paused'` (Paused tab)

  - **Service Stage Workflow**:
    - Progression through stages:
      - Doc → Filing → Awaiting → Correction → To Close
    - Each stage change:
      - Updates `serviceStage` field
      - Resets `subStage` to first option for new stage
      - Logs activity in Service `activity` array

  - **SubStage Progression**:
    - Each stage has specific substages:
      - Doc: "To Validate" → "Incomplete" → "Verified"
      - Filing: "In Queue" → "In Process" → "Submitted"
      - Awaiting: "Awaiting" → "Re-Apply" → "Approved"
      - Correction: "Verifying" → "To Correct" → "Cancelled" → "Completed"
      - To Close: "Doc Shared" → "Invoiced" → "Paid"
    - When reaching final substage:
      - Automatically advances to next stage
      - Updates `serviceStage` and resets `subStage`
      - Logs activity in Service `activity` array
    - Special substage effects:
      - Setting `subStage: 'Blocked'` moves service to blocked bucket
      - Setting `subStage: 'Submitted'` in Filing stage sets `appliedDate` to current timestamp
      - Setting `subStage: 'Re-Apply'` changes stage back to "Filing" with `subStage: 'In Queue'`

  - **Pause Functionality**:
    - Regular Pause:
      - Sets `serviceStatus: 'paused'`
      - Creates `pauseMetadata` with `pausedUntil` timestamp
      - Sets `pausedBy` to current agent
      - Updates user counters (`activeSr`, `pausedSr`)
      - Logs activity in Service `activity` array
    
    - Dependency Pause:
      - Same as regular pause, plus:
      - Sets `pauseMetadata.dueToDependency: true`
      - Sets `pauseMetadata.dependencyServiceId` to dependent service
      - May trigger creation of follow-up service
      - Updates user counters (`dependencySr`)
      - Logs activity in Service `activity` array

  - **Move to Close Action**:
    - Requires:
      - Service has completed all stages to "To Close"
      - Final payment (if applicable) has been recorded
    - Effects:
      - Changes `bucket` to 'closed'
      - Sets `completionTime` to current timestamp
      - Adds entry to `bucketTransitions` array
      - Updates user counters (`activeSr`, `closedSr`)
      - Logs activity in Service `activity` array

  - **Move to Block Action**:
    - Triggered by:
      - Legal issues discovered
      - Document issues that block progress
      - Blocker issues found during calls
    - Required fields:
      - `blockerReason` must be set with specific issue
      - `blockerPOC` must be assigned
    - Effects:
      - Changes `bucket` to 'blocked'
      - Adds entry to `bucketTransitions` array
      - Updates user counters (`activeSr`, `blockedSr`)
      - Logs activity in Service `activity` array

  - **Mark as Lost Action**:
    - Effects:
      - Sets `serviceStatus: 'lost'`
      - Updates user counters (`lostSr`)
      - Logs activity in Service `activity` array

  - **Metrics Calculations**:
    - Doc: Count of services with `serviceStage: 'Doc'`
    - Filing: Count of services with `serviceStage: 'Filing'`
    - Awaiting: Count of services with `serviceStage: 'Awaiting'`
    - Correction: Count of services with `serviceStage: 'Correction'`
    - Escalated SRs: Count of services with `escalated: true`
    - Payment Pending: Count of services with `subStage: 'Invoiced'`

- **Key Field Validations**:
  - Cannot move to blocked without setting `blockerReason` and `blockerPOC`
  - Cannot mark as lost without confirmation
  - Changing stage automatically updates available substages
  - Final substage in a stage automatically advances to next stage

#### Blocked Page
- **Purpose**: Manages services with blocker issues requiring resolution
- **Data Filtering**: Shows services with `bucket: 'blocked'`
- **Key Features and Field Dependencies**:
  - **Blocker Reason Field**:
    - Required when service moves to blocked bucket
    - Displays reason service is blocked
    - Options include legal issues, document issues, and other blockers
  
  - **Blocker POC Assignment**:
    - Required when service moves to blocked bucket
    - Sets `blockerPOC` field to person responsible for resolution
  
  - **Unblock Service Action**:
    - Effects:
      - Changes `bucket` back to 'active'
      - Sets `blockerResolutionTime` to current timestamp
      - Clears or archives `blockerReason`
      - Adds entry to `bucketTransitions` array
      - Updates user counters (`blockedSr`, `activeSr`)
      - Logs activity in Service `activity` array
  
  - **Move to Closed Action**:
    - Used when blocker cannot be resolved and service must be abandoned
    - Effects:
      - Changes `bucket` to 'closed'
      - Sets `completionTime` to current timestamp
      - Adds entry to `bucketTransitions` array
      - Updates user counters (`blockedSr`, `closedSr`)
      - Logs activity in Service `activity` array
  
  - **Mark as Lost Action**:
    - Used when blocker leads to complete loss of the service
    - Effects:
      - Sets `serviceStatus: 'lost'`
      - Updates user counters (`lostSr`)
      - Logs activity in Service `activity` array

- **Key Field Validations**:
  - Cannot unblock without notes explaining resolution
  - Must have `blockerPOC` assigned at all times
  - `blockerReason` must be specific and descriptive

#### Closed Page
- **Purpose**: Final stage for completed services, tracks revenue
- **Data Filtering**: Shows services with `bucket: 'closed'`
- **Key Features and Field Dependencies**:
  - **Archive Functionality**:
    - Used for long-term storage of completed services
    - Requirements:
      - Service must be in closed bucket for at least 30 days
      - OR manual archiving for services with no contact/no calls attended
    - Effects:
      - Changes `bucket` to 'archived'
      - Adds entry to `bucketTransitions` array
      - Updates user counters (`closedSr`, `archivedSr`)
      - Logs activity in Service `activity` array
  
  - **Revenue Tracking**:
    - Displays `serviceAmount` and `amountPaid` for financial tracking
    - Calculates total revenue across all closed services
  
  - **Filters and Sorting**:
    - Service type (`serviceName`)
    - Society (`addressLine1`)
    - Acquisition POC (`acquisitionPOC`)
    - Service POC (`servicePOC`)
    - Source (`serviceSource`)
    - Age calculations based on `added` and `completionTime`

  - **Metrics Calculations**:
    - Total Closed: Count of services in closed bucket
    - Total Revenue: Sum of `serviceAmount` across all services
    - Archived SRs: Count of services with `bucket: 'archived'`
    - Lost SRs: Count of services with `serviceStatus: 'lost'`

- **Key Field Validations**:
  - Cannot modify core service details once closed
  - Payments can still be recorded against closed services

### 2.3 Service Details Panel (Side Panel)

- **Purpose**: Universal detailed view for services across all pages
- **Key Components and Field Dependencies**:
  - **Header Section**:
    - Displays core service info: `serviceId`, `userName`, `phoneNumber`, `serviceName`
    - WhatsApp integration using `phoneNumber`
    - Quick actions vary by current `bucket` and `serviceStatus`

  - **Details Tab**:
    - Shows all service fields in organized sections
    - Edit capabilities for most fields
    - Field updates trigger activity logging
    - Shows address information from `addressLine1`, `addressLine2`, `addressLine3`
    - Shows financial information from `serviceAmount` and `amountPaid`
    - Shows process tracking from `docummentSubmissionStatus` and `summaryEmailSentStatus`

  - **Payment Tab**:
    - Lists all payments from `paymentIds` references
    - Add payment functionality:
      - Creates new `Payment` record
      - Links payment to service and user
      - Updates `amountPaid` in Service record
      - Updates `totalPaidAmount` in User record
    - Edit payment functionality:
      - Updates existing `Payment` record
      - Recalculates `amountPaid` and `totalPaidAmount`
    - Invoice generation:
      - Creates invoice from payment records
      - Uses service and user details for contact info

  - **Communication Tab**:
    - Lists all `communicationTasks` for the service
    - Red dot indicator when `status: 'pending'` tasks exist
    - Add task functionality:
      - Creates new `CommunicationTask` record
      - Sets `status: 'pending'`
      - Sets `assignedTo` field
      - Sets `dueDate` field
    - Mark complete functionality:
      - Updates task `status: 'done'`
      - Logs activity in Service `activity` array

  - **Activity Tab**:
    - Chronological display of `activity` array
    - Formatted entries showing all changes
    - Time-based sorting by `activity.time`
    - Filtered display based on activity type

  - **Notes Functionality** (across tabs):
    - Add note:
      - Creates new `NoteEntry` record
      - Sets `noteEntryDateTime` to current timestamp
      - Sets `agentName` to current user
      - Adds to Service `notes` array
    - Notes are visible in relevant contexts across tabs

## 3. Detailed Workflows and Critical Field Effects

### 3.1 Lead to Customer Conversion Workflow

1. **Lead Creation** (Intake Page):
   - **Manual Entry**:
     - Create User record:
       - Set `userId` (auto-generated)
       - Set `userName`, `phoneNumber`, `emailAddress` from form
       - Set `userSource` based on selection
       - Set `agentName` to current user
       - Set `acquisitionPOC` and `salesPOC` from selections
       - Set `lifecycle: 'lead'`
       - Set `userInterest: 'interested'`
       - Set `added` to current timestamp
     - Create initial Service record:
       - Set `serviceId` (auto-generated)
       - Set `serviceName` based on selection
       - Link to User with `userId`
       - Copy `userName` and `phoneNumber` from User
       - Set `serviceSource` from User `userSource`
       - Set `agentName` from User `agentName`
       - Set `acquisitionPOC` from User `acquisitionPOC`
       - Set `serviceSalesPOC` from User `salesPOC`
       - Set `lifecycle: 'lead'`
       - Set `bucket: 'pre active'`
       - Set `serviceStatus: 'open'`
       - Set `serviceStage: 'unqualified'`
       - Set `subStage` to first substage
       - Set `serviceAmount` based on `serviceName` pricing
       - Set `docummentSubmissionStatus: false`
       - Set `added` to current timestamp
       - Add entry to `bucketTransitions` with `bucket: 'pre active'` and current timestamp
     - Update User `serviceIds` array with new `serviceId`
     - Increment User `numberOfServices` and `preActiveSr`

   - **Bulk Upload**:
     - Similar to manual entry, but processes multiple leads at once
     - All fields set through mapping from upload file
     - Same validation rules apply

2. **Qualification Process** (Pre-Active Page):
   - **Initial Contact**:
     - Record call result:
       - Update Service `callStatus` with result
       - Update Service `ASLC` with current timestamp
       - If answered, update `ASLA` with current timestamp
     - Add notes about interaction
     - Based on call, update qualification:
       - If qualified lead:
         - Update Service `serviceStage: 'qualified'`
         - Increment User `qualifiedCount`
         - Decrement User `unqualifiedCount`
       - If not qualified, keep as `serviceStage: 'unqualified'`

   - **Document Collection**:
     - When documents received:
       - Update Service `docummentSubmissionStatus: true`
       - Increment User `docSubmittedSr`
       - This enables the "Move to Active" option

   - **Move to Active** (critical transition):
     - Requirements check:
       - `serviceStage: 'qualified'`
       - `serviceStatus: 'open'`
       - `docummentSubmissionStatus: true`
     - Execute transition:
       - Update Service `bucket: 'active'`
       - Add new entry to `bucketTransitions` with `bucket: 'active'` and current timestamp
       - Decrement User `preActiveSr`
       - Increment User `activeSr`
       - Log activity in Service `activity` array

3. **Active Service Processing** (Active Page):
   - **Doc Stage Processing**:
     - Initial substage: `subStage: 'To Validate'`
     - Document validation:
       - If incomplete, update `subStage: 'Incomplete'` and add notes
       - If complete, update `subStage: 'Verified'`
     - When reaching `subStage: 'Verified'` (final substage):
       - Automatically update `serviceStage: 'Filing'`
       - Set `subStage: 'In Queue'` (first substage of Filing)
       - Log activity in Service `activity` array

   - **Filing Stage Processing**:
     - Initial substage: `subStage: 'In Queue'`
     - Document filing:
       - Update to `subStage: 'In Process'` when actively filing
       - When filed, update to `subStage: 'Submitted'`
       - When updating to `subStage: 'Submitted'`, also set `appliedDate` to current timestamp
     - When reaching `subStage: 'Submitted'` (final substage):
       - Trigger Awaiting modal for setting `awaitingUntil` timestamp
       - Update `serviceStage: 'Awaiting'`
       - Set `subStage: 'Awaiting'` (first substage of Awaiting)
       - Log activity in Service `activity` array

   - **Awaiting Stage Processing**:
     - Initial substage: `subStage: 'Awaiting'`
     - Check status:
       - If need to reapply, update `subStage: 'Re-Apply'`
         - This special substage moves back to `serviceStage: 'Filing'` with `subStage: 'In Queue'`
       - If approved, update `subStage: 'Approved'`
     - When reaching `subStage: 'Approved'` (final substage):
       - Update `serviceStage: 'Correction'`
       - Set `subStage: 'Verifying'` (first substage of Correction)
       - Log activity in Service `activity` array

   - **Correction Stage Processing**:
     - Initial substage: `subStage: 'Verifying'`
     - Correction process:
       - If corrections needed, update `subStage: 'To Correct'`
       - If corrections impossible, update `subStage: 'Cancelled'`
       - If no corrections needed or all corrected, update `subStage: 'Completed'`
     - When reaching `subStage: 'Completed'` (final substage):
       - Update `serviceStage: 'To Close'`
       - Set `subStage: 'Doc Shared'` (first substage of To Close)
       - Log activity in Service `activity` array

   - **To Close Stage Processing**:
     - Initial substage: `subStage: 'Doc Shared'`
     - Closing process:
       - Update to `subStage: 'Invoiced'` when invoice sent
       - Update to `subStage: 'Paid'` when payment received
     - When reaching `subStage: 'Paid'` (final substage):
       - Ready for "Move to Close" action

   - **Move to Close Action** (critical transition):
     - Requirements check:
       - `serviceStage: 'To Close'`
       - `subStage: 'Paid'` or final substage
     - Execute transition:
       - Update Service `bucket: 'closed'`
       - Set `completionTime` to current timestamp
       - Add new entry to `bucketTransitions` with `bucket: 'closed'` and current timestamp
       - Decrement User `activeSr`
       - Increment User `closedSr`
       - Log activity in Service `activity` array

4. **Closed Service Management** (Closed Page):
   - **Financial Reconciliation**:
     - Verify all payments recorded correctly
     - Ensure `amountPaid` matches expected `serviceAmount`
     - Generate final invoice if needed

   - **Archive Action** (after 30 days or manually):
     - Execute transition:
       - Update Service `bucket: 'archived'`
       - Add new entry to `bucketTransitions` with `bucket: 'archived'` and current timestamp
       - Decrement User `closedSr`
       - Increment User `archivedSr`
       - Log activity in Service `activity` array

### 3.2 Issue Handling Workflows

1. **Pausing a Service** (Active Page):
   - **Regular Pause**:
     - Open Pause modal
     - Set pause duration, creating `pausedUntil` timestamp
     - Execute pause:
       - Update Service `serviceStatus: 'paused'`
       - Create `pauseMetadata` object with:
         - `pausedUntil` set to expiry timestamp
         - `pausedBy` set to current agent
       - Decrement User `activeSr`
       - Increment User `pausedSr`
       - Log activity in Service `activity` array

   - **Dependency Pause**:
     - Open Pause modal with dependency option
     - Set pause duration and dependent service
     - Execute pause:
       - Same as regular pause, plus:
       - Set `pauseMetadata.dueToDependency: true`
       - Set `pauseMetadata.dependencyServiceId` to selected service
       - Increment User `dependencySr`
       - Optionally create follow-up service to track dependency
       - Log activity in Service `activity` array

   - **Unpause Process**:
     - When `pausedUntil` timestamp passes or manual unpause:
       - Update Service `serviceStatus: 'open'`
       - Clear `pauseMetadata` object
       - Increment User `activeSr`
       - Decrement User `pausedSr`
       - If dependency pause, decrement User `dependencySr`
       - Log activity in Service `activity` array

2. **Blocking a Service** (Active Page to Blocked Page):
   - **Move to Block Action**:
     - Open Block modal
     - Set `blockerReason` from predefined list or custom entry
     - Assign `blockerPOC` responsible for resolution
     - Execute transition:
       - Update Service `bucket: 'blocked'`
       - Set `blockerReason` and `blockerPOC`
       - Add new entry to `bucketTransitions` with `bucket: 'blocked'` and current timestamp
       - Decrement User `activeSr`
       - Increment User `blockedSr`
       - Log activity in Service `activity` array

   - **Unblock Process** (Blocked Page):
     - Resolve blocker issue
     - Document resolution in notes
     - Execute unblock:
       - Update Service `bucket: 'active'`
       - Set `blockerResolutionTime` to current timestamp
       - Add new entry to `bucketTransitions` with `bucket: 'active'` and current timestamp
       - Increment User `activeSr`
       - Decrement User `blockedSr`
       - Log activity in Service `activity` array

3. **Marking Service as Lost** (Any Page):
   - **Lost Action**:
     - Open Lost modal
     - Provide reason for loss
     - Execute marking as lost:
       - Update Service `serviceStatus: 'lost'`
       - Update source counter based on current bucket:
         - If `bucket: 'pre active'`: Decrement User `preActiveSr`
         - If `bucket: 'active'`: Decrement User `activeSr`
         - If `bucket: 'blocked'`: Decrement User `blockedSr`
       - Increment User `lostSr`
       - Log activity in Service `activity` array

### 3.3 Activity Tracking System

- **Cloud Function Triggers**:
  - Listens to changes in Service collection
  - Listens to changes in User collection
  - Listens to changes in Payment collection

- **For Service Changes**:
  - Captures before and after states
  - Creates Activity record with:
    - `time` set to current timestamp
    - `user` set to current agent
    - `action` describing the change type
    - `target` set to affected field or entity
    - `from` capturing previous value
    - `to` capturing new value
    - `serviceId` linking to affected service
  - Appends Activity to Service `activity` array

- **For User Changes**:
  - Similar to Service changes
  - Captures user-level field changes
  - Appends Activity to User `activity` array

- **For Payment Changes**:
  - Captures payment creation, updates, deletions
  - Links Activity to both Service and User

- **Activity Viewing**:
  - Activity tab in Service Details Panel shows chronological history
  - Filters allow focusing on specific activity types
  - Each entry shows:
    - Timestamp
    - Agent who made the change
    - Field that changed
    - Previous and new values
    - Any notes or context

## 4. Advanced Workflow Considerations and Edge Cases

### 4.1 Document Submission Rules

- **Pre-Active Stage**:
  - Cannot mark documents as submitted if `serviceStage: 'unqualified'`
  - Document submission is a prerequisite for moving to active

- **Active Stage Document Handling**:
  - Doc stage involves validation of submitted documents
  - If documents found incomplete during validation, service can move back in substage

### 4.2 Service Stage and SubStage Progression

- **Normal Progression Path**:
  ```
  Pre-Active:
  - Unqualified -> Qualified
  
  Active:
  - Doc: To Validate -> Incomplete -> Verified
  - Filing: In Queue -> In Process -> Submitted
  - Awaiting: Awaiting -> (Re-Apply) -> Approved
  - Correction: Verifying -> (To Correct) -> (Cancelled) -> Completed
  - To Close: Doc Shared -> Invoiced -> Paid
  ```

- **Special Transitions**:
  - `subStage: 'Re-Apply'` moves back to Filing stage
  - `subStage: 'Blocked'` moves to blocked bucket
  - `subStage: 'Cancelled'` may lead to closing or marking as lost

### 4.3 Synchronization Functions

- **Service Status Updates**:
  - When `serviceStatus` changes:
    - Function `updateServiceStatusAndSyncCounts` triggers
    - Updates corresponding counters in User record
    - Ensures User and Service stay in sync

- **Service Stage Updates**:
  - When `serviceStage` changes:
    - Function `updateServiceStageAndSyncCounts` triggers
    - Updates `qualifiedCount` and `unqualifiedCount` in User record
    - Ensures User and Service stay in sync

- **Document Submission Updates**:
  - When `docummentSubmissionStatus` changes:
    - Updates `docSubmittedSr` in User record
    - Ensures User and Service stay in sync

- **Payment Updates**:
  - When payments are added or edited:
    - Updates `amountPaid` in Service record
    - Updates `totalPaidAmount` in User record
    - Ensures all financial fields stay in sync

### 4.4 Key Business Logic Requirements

- **Qualification Logic**:
  - Lead must be qualified before moving to active
  - Qualification requires initial contact and assessment

- **Document Submission Logic**:
  - Documents must be submitted before moving to active
  - Document status can be toggled only if service is qualified

- **Bucket Transition Logic**:
  - Every bucket change must update `bucketTransitions` array
  - Every bucket change must update corresponding counters in User record
  - Bucket entry time is used to calculate "Bucket Age"

- **Stage Advancement Logic**:
  - Final substage of each stage triggers advancement to next stage
  - Cannot skip stages in normal workflow
  - Special substages can trigger specific transitions

- **Activity Logging Logic**:
  - All significant changes must be logged in `activity` array
  - Activity entries must capture who, what, when, and how of each change
  - Activity logs are critical for audit and debugging

## 5. Common Bugfix Scenarios

### 5.1 User Counter Sync Issues

**Problem**: User counters (e.g., `activeSr`, `preActiveSr`) don't match actual service counts.

**Fix Approach**:
1. Verify all Service records for the User with mismatched counters
2. Count services in each bucket and status
3. Update User record with correct counts
4. Check for missing sync function calls in relevant service update methods

### 5.2 Bucket Transition History Gaps

**Problem**: `bucketTransitions` array missing entries or has incorrect timestamps.

**Fix Approach**:
1. Review Service `activity` array to find actual transition times
2. Reconstruct missing `bucketTransitions` entries
3. Ensure all bucket change functions properly update this array
4. Add validation to prevent future bucket changes without transition recording

### 5.3 Stage/SubStage Inconsistencies

**Problem**: Service has incompatible `serviceStage` and `subStage` values.

**Fix Approach**:
1. Identify correct stage based on service history
2. Set appropriate substage for the current stage
3. Verify that stage change functions properly reset substage
4. Add validation to prevent incompatible stage/substage combinations

### 5.4 Pause Metadata Corruption

**Problem**: Service is paused but has incomplete or inconsistent `pauseMetadata`.

**Fix Approach**:
1. Check if service is actually paused (`serviceStatus: 'paused'`)
2. Verify `pauseMetadata` has required fields:
   - `pausedUntil` timestamp
   - `pausedBy` agent reference
3. For dependency pauses, verify:
   - `dueToDependency: true`
   - Valid `dependencyServiceId`
4. Fix missing fields or reset pause status if metadata cannot be recovered

### 5.5 Activity Tracking Gaps

**Problem**: `activity` array missing entries for known changes.

**Fix Approach**:
1. Identify missing activities through timestamp analysis
2. Recreate missing activity entries based on known changes
3. Verify cloud function triggers are working properly
4. Add redundancy in critical update functions to ensure activity logging

