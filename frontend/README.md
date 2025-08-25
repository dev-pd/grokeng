# 📱 Grok SDR Frontend

A modern React TypeScript frontend for the Grok SDR system, featuring AI-powered lead management with an intuitive, responsive interface.

## 🚀 Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **Heroicons** for consistent iconography
- **Axios** for API communication
- **React Hooks** for state management

## ✨ Features

### 🎯 Lead Management

- **Advanced Lead Table** with real-time updates and sorting
- **Smart Search & Filtering** across multiple fields
- **Bulk Operations** for efficient lead processing
- **Responsive Design** that works on all devices

### 🤖 AI Integration

- **Real-time AI Scoring** with visual feedback
- **Interactive Analysis Modal** showing detailed insights
- **Message Generation** with multiple output formats
- **Auto-qualification** with status updates

### 🎨 Modern UI/UX

- **Component-based Architecture** for maintainability
- **Loading States** and smooth animations
- **Error Handling** with user-friendly messages
- **Empty States** with helpful call-to-actions
- **Edge Case Handling** for missing or invalid data

## 📁 Project Structure

```
src/
├── components/                 # Reusable UI components
│   ├── common/                # Shared components
│   │   ├── ErrorAlert.tsx     # Error handling component
│   │   └── Pagination.tsx     # Table pagination
│   ├── dashboard/             # Dashboard-specific components
│   │   ├── DashboardHeader.tsx
│   │   ├── StatsGrid.tsx
│   │   ├── ScoreDistributionChart.tsx
│   │   ├── TopLeads.tsx
│   │   └── RecentLeads.tsx
│   └── leads/                 # Lead management components
│       ├── LeadsTable.tsx     # Main data table
│       ├── LeadRow.tsx        # Individual table row
│       ├── LeadsFilters.tsx   # Search and filter controls
│       ├── AddLeadModal.tsx   # Lead creation modal
│       ├── AnalysisModal.tsx  # AI analysis display
│       └── MessageModal.tsx   # Generated message display
├── pages/                     # Main application pages
│   ├── Dashboard.tsx          # Dashboard overview
│   └── LeadsPage.tsx          # Lead management page
├── services/                  # API integration
│   ├── api.ts                 # Axios configuration
│   └── leadService.ts         # Lead-related API calls
├── types/                     # TypeScript definitions
│   └── index.ts               # All type definitions
├── styles/                    # Styling files
│   └── globals.css            # Global styles and Tailwind
└── App.tsx                    # Main application component
```

## 🛠️ Development Setup

### Prerequisites

- **Node.js 20+** (for optimal Vite compatibility)
- **npm** or **yarn** package manager

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
open http://localhost:5173
```

### Environment Configuration

Create a `.env` file in the frontend directory:

```bash
# frontend/.env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Grok SDR System
```

## 🏗️ Build & Deployment

### Development Build

```bash
# Development server with hot reload
npm run dev
```

### Production Build

```bash
# TypeScript compilation + Vite build
npm run build

# Preview production build locally
npm run preview
```

### Docker Build

```bash
# Build Docker image
docker build -t grok-sdr-frontend .

# Run container
docker run -p 5173:80 grok-sdr-frontend
```

## 📊 Component Architecture

### Design Principles

1. **Single Responsibility**: Each component has one clear purpose
2. **Composition over Inheritance**: Build complex UIs from simple components
3. **Props-based Communication**: Clear data flow between components
4. **Error Boundaries**: Graceful handling of component failures
5. **Accessibility**: Proper ARIA labels and keyboard navigation

### Component Categories

#### 🔧 Common Components

- **ErrorAlert**: Reusable error display with dismiss functionality
- **Pagination**: Smart pagination with page numbers and navigation
- **LoadingSpinner**: Consistent loading indicators

#### 📊 Dashboard Components

- **DashboardHeader**: Welcome section with quick actions
- **StatsGrid**: Metrics cards with trend indicators
- **ScoreDistributionChart**: Visual score breakdown with progress bars
- **TopLeads**: Ranked list of highest-scoring leads
- **RecentLeads**: Latest lead preview cards

#### 👥 Lead Components

- **LeadsTable**: Main data table with sorting and actions
- **LeadRow**: Individual row with AI action buttons
- **LeadsFilters**: Advanced search and filtering controls
- **AddLeadModal**: Lead creation form with validation
- **AnalysisModal**: Detailed AI analysis display
- **MessageModal**: Generated message preview and editing

## 🎨 Styling Guidelines

### Tailwind CSS Usage

```typescript
// Color Palette
const colors = {
  primary: 'blue-600',     // Main brand color
  success: 'green-600',    // Success states
  warning: 'yellow-600',   // Warning states
  danger: 'red-600',       // Error states
  gray: 'gray-600'         // Neutral states
}

// Common Patterns
<button className="btn-primary">           // Primary action button
<button className="btn-outline">           // Secondary action button
<div className="card">                     // Standard card container
<input className="input">                  // Form input styling
```

### Responsive Design

- **Mobile-first** approach with progressive enhancement
- **Breakpoints**: `sm:`, `md:`, `lg:`, `xl:` for different screen sizes
- **Flexible layouts** using CSS Grid and Flexbox
- **Touch-friendly** controls for mobile devices

## 🔌 API Integration

### Service Layer Architecture

```typescript
// services/leadService.ts
export class LeadService {
  // Standard CRUD operations
  static async getLeads(
    params?: GetLeadsParams
  ): Promise<PaginatedResponse<Lead>>;
  static async createLead(leadData: LeadCreate): Promise<Lead>;
  static async updateLead(id: number, leadData: Partial<Lead>): Promise<Lead>;
  static async deleteLead(id: number): Promise<void>;

  // AI-powered operations
  static async generateLeadScore(leadId: number): Promise<Lead>;
  static async analyzeLeadWithGrok(
    leadId: number
  ): Promise<GrokAnalysisResponse>;
  static async generatePersonalizedMessage(
    leadId: number,
    type: MessageType
  ): Promise<GrokMessageResponse>;
  static async autoQualifyLead(
    leadId: number
  ): Promise<GrokQualificationResponse>;
}
```

### Error Handling Strategy

```typescript
// Centralized error handling
try {
  const result = await LeadService.generateLeadScore(leadId);
  // Handle success
} catch (error: any) {
  setError(`Failed to generate score: ${error.message || "Unknown error"}`);
  console.error("API Error:", error);
}
```

### Loading States

```typescript
// Individual operation tracking
const [processingLeads, setProcessingLeads] = useState<Set<number>>(new Set());

// Per-lead loading states
const handleGenerateScore = async (leadId: number) => {
  setProcessingLeads((prev) => new Set([...prev, leadId]));
  try {
    // API call
  } finally {
    setProcessingLeads((prev) => {
      const newSet = new Set(prev);
      newSet.delete(leadId);
      return newSet;
    });
  }
};
```

## 🛡️ Edge Case Handling

### Data Validation & Fallbacks

```typescript
// Safe accessors for lead data
const getFullName = (lead: Lead) => {
  const firstName = lead.first_name?.trim() || "";
  const lastName = lead.last_name?.trim() || "";

  if (!firstName && !lastName) return "Unknown Name";
  if (!firstName) return lastName;
  if (!lastName) return firstName;
  return `${firstName} ${lastName}`;
};

const getEmail = (lead: Lead) => {
  const email = lead.email?.trim();
  if (!email) return "No email provided";

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? email : `${email} ⚠️`;
};
```

### International Support

```typescript
// Handle international characters and names
const getInitials = (lead: Lead) => {
  const firstName = lead.first_name?.trim() || "";
  const lastName = lead.last_name?.trim() || "";

  if (!firstName && !lastName) return "??";

  // Support for international characters
  const firstInitial = firstName.charAt(0).toUpperCase() || "?";
  const lastInitial = lastName.charAt(0).toUpperCase() || "";

  return `${firstInitial}${lastInitial}`;
};
```

## 🧪 Testing Strategy

### Component Testing

```bash
# Unit tests for components
npm run test

# Test coverage report
npm run test:coverage

# Visual regression testing
npm run test:visual
```

### Manual Testing Checklist

#### 🔍 Lead Management

- [ ] Load leads with pagination
- [ ] Search and filter functionality
- [ ] Create new leads with validation
- [ ] Edit existing lead information
- [ ] Delete leads with confirmation

#### 🤖 AI Features

- [ ] Generate AI scores for different lead types
- [ ] View detailed analysis modal
- [ ] Generate messages for various channels
- [ ] Auto-qualify leads and status updates

#### 📱 Responsive Design

- [ ] Mobile layout (320px+)
- [ ] Tablet layout (768px+)
- [ ] Desktop layout (1024px+)
- [ ] Large screen layout (1440px+)

#### 🛡️ Edge Cases

- [ ] Empty names display properly
- [ ] Missing company information
- [ ] Invalid email formats
- [ ] Suspicious domain warnings
- [ ] International characters (Chinese, Spanish names)
- [ ] Very long company names and titles

## 📊 Performance Optimization

### Bundle Optimization

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist

# Check for unused dependencies
npm run deps:check
```

### Code Splitting

```typescript
// Lazy load heavy components
const AnalysisModal = React.lazy(
  () => import("./components/leads/AnalysisModal")
);
const MessageModal = React.lazy(
  () => import("./components/leads/MessageModal")
);

// Wrap in Suspense
<Suspense fallback={<LoadingSpinner />}>
  <AnalysisModal />
</Suspense>;
```

### API Optimization

```typescript
// Debounced search to reduce API calls
const debouncedSearch = useMemo(
  () =>
    debounce((searchTerm: string) => {
      setFilters((prev) => ({ ...prev, search: searchTerm }));
    }, 300),
  []
);
```

## 🔧 Customization

### Theming

```css
/* styles/globals.css */
:root {
  --color-primary: #2563eb;
  --color-success: #059669;
  --color-warning: #d97706;
  --color-danger: #dc2626;
  --border-radius: 0.5rem;
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}
```

### Component Variants

```typescript
// Button component with variants
interface ButtonProps {
  variant?: "primary" | "outline" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center font-medium rounded-lg transition-colors";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={loading}
      {...props}>
      {loading && <Spinner className="mr-2" />}
      {children}
    </button>
  );
};
```

## 🐛 Troubleshooting

### Common Issues

#### Build Errors

```bash
# TypeScript errors
Error: 'React' is declared but its value is never read
Solution: Remove unused React import in newer React versions

# Vite build failures
Error: Could not resolve dependencies
Solution: Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### API Connection Issues

```bash
# CORS errors in browser console
Error: Access-Control-Allow-Origin
Solution: Check backend CORS configuration

# Network errors
Error: Network Error
Solution: Verify backend is running on correct port
curl http://localhost:8000/health
```

#### Docker Issues

```bash
# Frontend container not accessible
Error: Connection refused
Solution: Check port mapping and nginx configuration

# Environment variables not loading
Error: VITE_API_URL is undefined
Solution: Verify .env file exists and contains VITE_ prefixed variables
```

### Debug Commands

```bash
# Check environment variables in container
docker compose exec frontend printenv | grep VITE

# Inspect built files
docker compose exec frontend ls -la /usr/share/nginx/html

# Test nginx configuration
docker compose exec frontend nginx -t

# Check API connectivity from container
docker compose exec frontend curl http://backend:8000/health
```

## 📈 Performance Monitoring

### Key Metrics

```typescript
// Performance measurement
const measureAPICall = async (apiCall: () => Promise<any>) => {
  const startTime = performance.now();
  try {
    const result = await apiCall();
    const endTime = performance.now();
    console.log(`API call took ${endTime - startTime} milliseconds`);
    return result;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};
```

### Bundle Analysis

```bash
# Check bundle size
npm run build
ls -lh dist/assets/

# Lighthouse performance audit
npm install -g lighthouse
lighthouse http://localhost:5173 --view
```

## 🎯 Best Practices

### Component Design

1. **Keep components small** (< 200 lines)
2. **Use TypeScript** for type safety
3. **Handle loading states** for all async operations
4. **Implement error boundaries** for graceful failures
5. **Make components testable** with clear props interfaces

### State Management

```typescript
// Prefer local state for component-specific data
const [loading, setLoading] = useState(false);

// Use proper state updates for complex objects
setLeads((prev) =>
  prev.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead))
);

// Avoid deep nesting in state
interface LeadsState {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  filters: FilterState;
}
```

### Error Handling

```typescript
// Consistent error handling pattern
const handleAsyncOperation = async (operation: () => Promise<void>) => {
  setError(null);
  setLoading(true);

  try {
    await operation();
  } catch (err: any) {
    setError(err.message || "An unexpected error occurred");
    console.error("Operation failed:", err);
  } finally {
    setLoading(false);
  }
};
```

## 🔄 State Management Patterns

### Lead Operations

```typescript
// Pattern for updating individual leads
const updateLeadInList = (leadId: number, updates: Partial<Lead>) => {
  setLeads((prev) =>
    prev.map((lead) => (lead.id === leadId ? { ...lead, ...updates } : lead))
  );
};

// Pattern for adding new leads
const addLeadToList = (newLead: Lead) => {
  setLeads((prev) => [newLead, ...prev]);
  setTotalLeads((prev) => prev + 1);
};

// Pattern for removing leads
const removeLeadFromList = (leadId: number) => {
  setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
  setTotalLeads((prev) => prev - 1);
};
```

### Filter Management

```typescript
// Centralized filter state
interface FilterState {
  search: string;
  status: string;
  industry: string;
  company_size: string;
  score_range: string;
}

// Filter change handler
const handleFilterChange = (key: keyof FilterState, value: string) => {
  setFilters((prev) => ({ ...prev, [key]: value }));
  setPage(1); // Reset pagination on filter change
};
```

## 🎨 UI Component Library

### Button Components

```typescript
// Primary action button
<button className="btn-primary">
  <PlusIcon className="h-5 w-5 mr-2" />
  Add Lead
</button>

// Secondary action button
<button className="btn-outline">
  <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
  Import CSV
</button>

// Danger action button
<button className="btn-danger">
  <TrashIcon className="h-5 w-5 mr-2" />
  Delete
</button>
```

### Status Indicators

```typescript
// Score color coding
const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600 bg-green-50";
  if (score >= 60) return "text-yellow-600 bg-yellow-50";
  return "text-red-600 bg-red-50";
};

// Status badges
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "qualified":
      return "bg-green-100 text-green-800";
    case "contacted":
      return "bg-blue-100 text-blue-800";
    case "converted":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
```

### Loading States

```typescript
// Table loading skeleton
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    {[1, 2, 3, 4, 5].map((i) => (
      <tr
        key={i}
        className="border-b border-gray-200">
        <td className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
        </td>
      </tr>
    ))}
  </div>
);
```

## 🔧 Development Tools

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Useful Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Production build
npm run preview          # Preview production build
npm run lint             # Run ESLint

# Maintenance
npm run deps:update      # Update dependencies
npm run deps:audit       # Security audit
npm run clean            # Clean build artifacts
```

## 📱 Mobile Considerations

### Touch-Friendly Design

- **Minimum 44px touch targets** for buttons
- **Swipe gestures** for table navigation on mobile
- **Proper spacing** between interactive elements
- **Accessible contrast ratios** for all text

### Mobile-Specific Features

```typescript
// Mobile-optimized modals
const isMobile = window.innerWidth < 768;

return (
  <div className={`modal ${isMobile ? "modal-mobile" : "modal-desktop"}`}>
    {/* Modal content */}
  </div>
);
```

## 🚀 Future Enhancements

### Planned Features

1. **Dark Mode Support** with theme switching
2. **Keyboard Shortcuts** for power users
3. **Offline Support** with service workers
4. **Real-time Updates** with WebSocket integration
5. **Advanced Filtering** with saved filter sets
6. **Export Functionality** for leads and analytics
7. **User Preferences** and customizable dashboards

### Performance Improvements

1. **Virtual Scrolling** for large lead lists
2. **Image Optimization** and lazy loading
3. **Code Splitting** by route and feature
4. **Service Worker Caching** for offline functionality

## 📞 Support

### Getting Help

1. **Check the console** for JavaScript errors
2. **Verify API connectivity** using browser dev tools
3. **Check component props** and state in React DevTools
4. **Review network requests** in browser dev tools

### Contributing

1. **Follow the component structure** outlined above
2. **Add TypeScript types** for all new interfaces
3. **Include error handling** for all async operations
4. **Test responsive design** on multiple screen sizes
5. **Document new components** with clear props interfaces

---
