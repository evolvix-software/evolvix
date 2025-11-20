# 🎨 Employer Portal - UI/UX Guidelines

## Design System

### Color Palette

#### Primary Colors
```css
--primary: #635bff;
--primary-hover: #4f48cc;
--primary-foreground: #ffffff;
```

#### Secondary Colors
```css
--secondary: #f5f5f7;
--secondary-foreground: #1d1d1f;
```

#### Semantic Colors
```css
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;
```

#### Neutral Colors
```css
--background: #ffffff;
--foreground: #1d1d1f;
--muted: #f5f5f7;
--muted-foreground: #6b7280;
--border: #e5e7eb;
--card: #ffffff;
```

### Typography

#### Font Families
- **Primary**: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
- **Monospace**: "SF Mono", Monaco, "Cascadia Code", monospace

#### Font Sizes
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;  /* 14px */
--text-base: 1rem;    /* 16px */
--text-lg: 1.125rem;  /* 18px */
--text-xl: 1.25rem;   /* 20px */
--text-2xl: 1.5rem;   /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem;  /* 36px */
```

#### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Spacing

#### Spacing Scale
```css
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
--spacing-12: 3rem;    /* 48px */
--spacing-16: 4rem;    /* 64px */
```

### Border Radius

```css
--radius-sm: 0.25rem;  /* 4px */
--radius-md: 0.5rem;   /* 8px */
--radius-lg: 0.75rem;  /* 12px */
--radius-xl: 1rem;     /* 16px */
--radius-full: 9999px;
```

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

---

## Component Library

### Buttons

#### Primary Button
```tsx
<Button variant="primary" size="md">
  Post Job
</Button>
```

#### Secondary Button
```tsx
<Button variant="secondary" size="md">
  Cancel
</Button>
```

#### Outline Button
```tsx
<Button variant="outline" size="md">
  View Details
</Button>
```

#### Button Sizes
- `sm`: Small (height: 32px)
- `md`: Medium (height: 40px)
- `lg`: Large (height: 48px)

### Forms

#### Input Field
```tsx
<Input
  label="Job Title"
  placeholder="Enter job title"
  required
  error="This field is required"
/>
```

#### Textarea
```tsx
<Textarea
  label="Job Description"
  placeholder="Enter job description"
  rows={6}
/>
```

#### Select Dropdown
```tsx
<Select
  label="Employment Type"
  options={[
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" }
  ]}
/>
```

#### Checkbox
```tsx
<Checkbox
  label="Remote work available"
  checked={isRemote}
  onChange={setIsRemote}
/>
```

#### Radio Group
```tsx
<RadioGroup
  label="Job Status"
  options={[
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" }
  ]}
/>
```

### Cards

#### Basic Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Job Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content
  </CardContent>
</Card>
```

#### Job Card
```tsx
<JobCard
  job={job}
  onView={() => {}}
  onEdit={() => {}}
  onDelete={() => {}}
/>
```

#### Applicant Card
```tsx
<ApplicantCard
  applicant={applicant}
  matchScore={85}
  onView={() => {}}
  onMove={() => {}}
/>
```

### Tables

#### Data Table
```tsx
<DataTable
  columns={columns}
  data={data}
  pagination={true}
  sorting={true}
  filtering={true}
/>
```

### Modals

#### Basic Modal
```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
>
  Modal content
</Modal>
```

#### Confirmation Modal
```tsx
<ConfirmModal
  isOpen={isOpen}
  onConfirm={handleConfirm}
  onCancel={() => setIsOpen(false)}
  title="Delete Job?"
  message="This action cannot be undone."
/>
```

### Badges

```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Rejected</Badge>
<Badge variant="info">New</Badge>
```

### Tooltips

```tsx
<Tooltip content="This is a tooltip">
  <Button>Hover me</Button>
</Tooltip>
```

### Dropdowns

```tsx
<Dropdown
  trigger={<Button>Actions</Button>}
  items={[
    { label: "Edit", onClick: () => {} },
    { label: "Delete", onClick: () => {}, variant: "danger" }
  ]}
/>
```

### Loading States

#### Spinner
```tsx
<Spinner size="md" />
```

#### Skeleton Loader
```tsx
<Skeleton height={100} />
```

#### Loading Button
```tsx
<Button loading={isLoading}>
  Submit
</Button>
```

---

## Layout Patterns

### Dashboard Layout

```
┌─────────────────────────────────────────┐
│  Header (Logo, Nav, User Menu)         │
├─────────────────────────────────────────┤
│  Sidebar │  Main Content Area          │
│          │                              │
│  - Nav   │  - Stats Cards              │
│  - Links │  - Charts                   │
│          │  - Recent Activity          │
│          │  - Quick Actions             │
└─────────────────────────────────────────┘
```

### Two-Column Layout

```
┌─────────────────────────────────────────┐
│  Header                                  │
├──────────┬──────────────────────────────┤
│  Left    │  Right Panel                 │
│  Panel   │                              │
│          │  - Details                   │
│  - List  │  - Actions                   │
│  - Cards │  - Related Info             │
│          │                              │
└──────────┴──────────────────────────────┘
```

### Full-Width Layout

```
┌─────────────────────────────────────────┐
│  Header                                  │
├─────────────────────────────────────────┤
│  Breadcrumbs                             │
├─────────────────────────────────────────┤
│  Page Title + Actions                    │
├─────────────────────────────────────────┤
│  Main Content                            │
│                                          │
│  - Forms                                 │
│  - Tables                                │
│  - Cards                                 │
└─────────────────────────────────────────┘
```

---

## Responsive Design

### Breakpoints

```css
--breakpoint-sm: 640px;   /* Mobile */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large Desktop */
--breakpoint-2xl: 1536px; /* Extra Large */
```

### Mobile-First Approach

```css
/* Mobile (default) */
.component {
  padding: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .component {
    padding: 1.5rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .component {
    padding: 2rem;
  }
}
```

### Mobile Navigation

- **Bottom Navigation**: Fixed bottom bar on mobile
- **Hamburger Menu**: Collapsible sidebar
- **Touch Targets**: Minimum 44x44px
- **Swipe Gestures**: Support swipe actions

---

## Accessibility Guidelines

### Keyboard Navigation

- **Tab Order**: Logical tab sequence
- **Focus Indicators**: Visible focus states
- **Keyboard Shortcuts**: Common shortcuts (Ctrl+S, Esc, etc.)
- **Skip Links**: Skip to main content

### Screen Readers

- **ARIA Labels**: Proper ARIA attributes
- **Alt Text**: Descriptive alt text for images
- **Semantic HTML**: Use proper HTML elements
- **Live Regions**: Announce dynamic updates

### Color Contrast

- **Text**: Minimum 4.5:1 contrast ratio
- **Large Text**: Minimum 3:1 contrast ratio
- **Interactive Elements**: Minimum 3:1 contrast ratio

### Focus Management

```tsx
// Focus trap in modals
<FocusTrap>
  <Modal>...</Modal>
</FocusTrap>

// Focus return after modal close
useEffect(() => {
  if (!isOpen) {
    previousFocusRef.current?.focus();
  }
}, [isOpen]);
```

---

## Animation Guidelines

### Transitions

```css
--transition-fast: 150ms;
--transition-base: 200ms;
--transition-slow: 300ms;
```

### Easing Functions

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Common Animations

#### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

#### Slide In
```css
@keyframes slideIn {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

#### Loading Spinner
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

## Icon System

### Icon Library
- **Lucide Icons**: Primary icon library
- **Custom Icons**: Brand-specific icons

### Icon Sizes
- `xs`: 12px
- `sm`: 16px
- `md`: 20px
- `lg`: 24px
- `xl`: 32px

### Icon Usage

```tsx
import { Briefcase, Users, MessageSquare } from 'lucide-react';

<Briefcase className="w-5 h-5" />
```

---

## Form Design Patterns

### Multi-Step Forms

```tsx
<MultiStepForm
  steps={[
    { id: 'basic', title: 'Basic Info' },
    { id: 'details', title: 'Details' },
    { id: 'review', title: 'Review' }
  ]}
  currentStep={currentStep}
  onNext={handleNext}
  onPrevious={handlePrevious}
/>
```

### Inline Validation

- Show errors immediately after blur
- Show success state for valid fields
- Prevent submission if errors exist

### Auto-Save

- Auto-save drafts every 30 seconds
- Show "Saving..." indicator
- Show "Saved" confirmation

---

## Data Visualization

### Charts

#### Line Chart
```tsx
<LineChart
  data={data}
  xKey="date"
  yKey="value"
  color="#635bff"
/>
```

#### Bar Chart
```tsx
<BarChart
  data={data}
  xKey="category"
  yKey="value"
/>
```

#### Pie Chart
```tsx
<PieChart
  data={data}
  labelKey="name"
  valueKey="value"
/>
```

### Metrics Cards

```tsx
<MetricCard
  title="Total Applications"
  value={1250}
  change={+12.5}
  trend="up"
  icon={<Briefcase />}
/>
```

---

## Empty States

### Empty State Pattern

```tsx
<EmptyState
  icon={<Briefcase />}
  title="No jobs posted yet"
  description="Get started by posting your first job"
  action={
    <Button onClick={handlePostJob}>
      Post a Job
    </Button>
  }
/>
```

---

## Error States

### Error Message Pattern

```tsx
<ErrorMessage
  title="Something went wrong"
  message="We couldn't load the data. Please try again."
  action={
    <Button onClick={handleRetry}>
      Try Again
    </Button>
  }
/>
```

---

## Loading States

### Skeleton Screens

```tsx
<div className="space-y-4">
  <Skeleton height={60} />
  <Skeleton height={200} />
  <Skeleton height={100} />
</div>
```

### Progressive Loading

- Show skeleton while loading
- Load critical content first
- Lazy load non-critical content

---

## Best Practices

### 1. Consistency
- Use consistent spacing, colors, and typography
- Follow established patterns
- Maintain design system

### 2. Clarity
- Clear labels and instructions
- Obvious call-to-actions
- Intuitive navigation

### 3. Feedback
- Loading states for async operations
- Success/error messages
- Confirmation dialogs for destructive actions

### 4. Performance
- Optimize images
- Lazy load components
- Minimize re-renders

### 5. Mobile-First
- Design for mobile first
- Test on real devices
- Optimize touch interactions

