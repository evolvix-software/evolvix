# 💰 Fund Management Page

## Overview

The Fund Management page allows providers to track fund transfers to Evolvix, monitor disbursements to scholars, view financial reports, and manage payment methods. It provides complete visibility into the financial flow from provider pledges to scholar disbursements.

## Route

```
/portal/provider/funds
/portal/provider/funds/transfers
/portal/provider/funds/disbursements
/portal/provider/funds/reports
```

## Page Layout

### Header Section
- Page title: "Fund Management"
- Current balance display
- Quick stats (Total Pledged, Total Transferred, Total Disbursed)
- Transfer Funds button
- Export button

### Tabs
- Overview
- Transfers
- Disbursements
- Reports
- Payment Methods

## Components

### 1. Fund Overview Tab

#### Balance Widget
**Displays:**
- **Current Balance**: Available funds
- **In-Transit**: Funds being transferred
- **Reserved**: Funds reserved for awards
- **Total Pledged**: Total amount pledged
- **Total Transferred**: Total transferred to Evolvix
- **Total Disbursed**: Total disbursed to scholars
- **Pending Disbursements**: Scheduled disbursements

**Visual Design:**
- Large balance display
- Color-coded sections
- Progress bars
- Trend indicators

**Quick Actions:**
- Transfer Funds
- View Transfer History
- View Disbursements
- Generate Report

---

#### Financial Summary Cards
**Cards:**
- Total Investment
- Funds Available
- Funds Reserved
- Funds Disbursed
- Funds Pending
- ROI Percentage

**Features:**
- Click to drill down
- Period comparison
- Trend indicators
- Export options

---

#### Recent Activity
**Displays:**
- Recent transfers
- Recent disbursements
- Recent reservations
- Upcoming disbursements

**Actions:**
- View all transfers
- View all disbursements
- Filter by date
- Export activity

---

### 2. Transfers Tab

#### Transfer List
**Displays:**
- Transfer ID
- Amount
- Date
- Status (Initiated, In-Transit, Confirmed, Failed)
- Campaign (if campaign-specific)
- Transaction Reference
- Confirmation Date
- Actions

**Filters:**
- Status filter
- Campaign filter
- Date range
- Amount range

**Sorting:**
- By date (newest/oldest)
- By amount (highest/lowest)
- By status

---

#### Transfer Details Modal
**Displays:**
- Transfer information
- Payment method
- Transaction reference
- Proof documents
- Status timeline
- Confirmation details

**Actions:**
- View proof
- Download receipt
- Retry transfer (if failed)
- Cancel transfer (if pending)

---

#### Initiate Transfer Form
**Fields:**
- Amount* (number input)
- Campaign (optional dropdown)
- Payment Method* (Bank Transfer, UPI, Credit Card, PayPal)
- Transaction Reference* (text input)
- Notes (textarea)
- Proof Document* (file upload)

**Validation:**
- Amount must be positive
- Amount cannot exceed available balance
- Proof document required
- Transaction reference required

**Process:**
1. Enter transfer details
2. Upload proof document
3. Review transfer
4. Submit transfer
5. Wait for Evolvix confirmation

**Status Tracking:**
- Initiated → Transfer submitted
- In-Transit → Evolvix reviewing
- Confirmed → Funds confirmed received
- Failed → Transfer failed (with reason)

---

### 3. Disbursements Tab

#### Disbursement List
**Displays:**
- Disbursement ID
- Scholar Name
- Amount
- Date
- Status (Scheduled, Disbursed, Cancelled, Refunded)
- Campaign
- Receipt Link
- Actions

**Filters:**
- Status filter
- Scholar filter
- Campaign filter
- Date range

**Grouping:**
- By scholar
- By campaign
- By status
- By date

---

#### Disbursement Details
**Displays:**
- Scholar information
- Disbursement amount
- Disbursement date
- Status and timeline
- Related transfer
- Receipt download
- Disbursement schedule

**Actions:**
- View receipt
- Download receipt
- View scholar profile
- View transfer details

---

#### Disbursement Schedule
**Displays:**
- Upcoming disbursements
- Scheduled dates
- Amounts
- Milestones
- Status

**Features:**
- Calendar view
- List view
- Filter by date range
- Export schedule

---

### 4. Reports Tab

#### Report Types
**Available Reports:**
- Balance Summary
- Transfer History Report
- Disbursement Report
- Campaign Financial Report
- ROI Report
- Scholar Payment Report

**Report Configuration:**
- Select report type
- Choose date range
- Select campaigns (optional)
- Choose format (PDF, CSV, Excel)
- Include/exclude fields

---

#### Report Preview
**Features:**
- Preview before export
- Customize fields
- Add filters
- Format options

**Export Options:**
- Download PDF
- Download CSV
- Download Excel
- Email report
- Schedule report

---

### 5. Payment Methods Tab

#### Payment Methods List
**Displays:**
- Payment method type
- Last 4 digits / Account details
- Default indicator
- Status
- Actions

**Actions:**
- Set as Default
- Edit Payment Method
- Remove Payment Method
- Add New Payment Method

---

#### Add Payment Method Form
**Fields:**
- Payment Method Type* (Bank Transfer, UPI, Credit Card, PayPal)
- Account Details* (masked input)
- Default Payment Method (checkbox)
- Verification Documents (file upload)

**Security:**
- Mask sensitive information
- Encrypt payment data
- Secure storage
- PCI compliance

---

## Data Requirements

### API Endpoints
- `GET /api/provider/funds/balance`
- `GET /api/provider/funds/transfers`
- `POST /api/provider/funds/transfers`
- `GET /api/provider/funds/transfers/:transferId`
- `GET /api/provider/funds/disbursements`
- `GET /api/provider/funds/disbursements/:disbursementId`
- `GET /api/provider/funds/reports`
- `POST /api/provider/funds/reports/generate`
- `GET /api/provider/funds/payment-methods`
- `POST /api/provider/funds/payment-methods`

### Data Structure
```typescript
interface FundBalance {
  currentBalance: number;
  inTransit: number;
  reserved: number;
  totalPledged: number;
  totalTransferred: number;
  totalDisbursed: number;
  pendingDisbursements: number;
}

interface Transfer {
  id: string;
  amount: number;
  status: 'initiated' | 'in-transit' | 'confirmed' | 'failed';
  campaignId?: string;
  transferMethod: string;
  transactionReference: string;
  proofFileUrl: string;
  createdAt: Date;
  confirmedAt?: Date;
}
```

## User Interactions

### 1. Transfer Funds
- Click "Transfer Funds" → Open form
- Enter details → Upload proof
- Submit → Transfer initiated
- Track status → Wait for confirmation

### 2. View Transfers
- Navigate to Transfers tab
- Filter and search transfers
- View transfer details
- Download receipts

### 3. Monitor Disbursements
- Navigate to Disbursements tab
- View disbursement schedule
- Track disbursement status
- Download receipts

### 4. Generate Reports
- Select report type
- Configure report
- Preview report
- Export report

### 5. Manage Payment Methods
- Add payment method
- Set default method
- Edit payment details
- Remove payment method

## Responsive Design

### Desktop (>1024px)
- Multi-column layout
- Side-by-side details
- Full feature set
- Data tables

### Tablet (768px - 1024px)
- 2-column layout
- Stacked details
- Touch-optimized
- Responsive tables

### Mobile (<768px)
- Single column
- Card-based layout
- Bottom navigation
- Simplified tables

## Loading States

### Initial Load
- Skeleton loaders
- Progressive loading
- Smooth transitions

### Transfer Processing
- Loading indicator
- Progress bar
- Status updates

## Error Handling

### Transfer Errors
- Show error message
- Retry option
- Contact support
- Fallback options

### Validation Errors
- Inline validation
- Error messages
- Prevent submission
- Guidance text

### API Errors
- Error notifications
- Retry buttons
- Fallback data
- Support contact

## Performance Considerations

### Optimization
- Paginate lists
- Lazy load details
- Cache balance data
- Debounce search

### Data Fetching
- Parallel API calls
- React Query caching
- Background refresh
- Manual refresh

## Accessibility

### Keyboard Navigation
- Tab through forms
- Enter to submit
- Escape to cancel
- Arrow keys for navigation

### Screen Readers
- ARIA labels
- Status announcements
- Form validation announcements
- Amount announcements

## Security Considerations

### Data Protection
- Mask sensitive data
- Encrypt payment info
- Secure file uploads
- Audit logging

### Access Control
- Role-based permissions
- Transaction limits
- Approval workflows
- Audit trails

## Future Enhancements

1. **Payment Integration**
   - Direct payment gateway
   - Automated transfers
   - Payment scheduling
   - Recurring transfers

2. **Advanced Reporting**
   - Custom report builder
   - Scheduled reports
   - Report templates
   - Dashboard widgets

3. **Financial Analytics**
   - Spending trends
   - Budget forecasting
   - Cost analysis
   - ROI optimization

4. **Automation**
   - Auto-transfer on threshold
   - Auto-disbursement rules
   - Payment reminders
   - Budget alerts

5. **Integration**
   - Accounting software integration
   - Bank API integration
   - Payment gateway integration
   - Financial reporting tools

