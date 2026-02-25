# AI Society - IIT Kharagpur

A high-fidelity, professional desktop landing page and web platform for the Department of Artificial Intelligence Society at IIT Kharagpur.

## Features

### 🏠 Homepage
- Modern hero section with abstract 3D geometric visuals
- Bento grid dashboard with announcements, quick links, and live status
- Academic resources preview
- Interactive campus map
- Glassmorphic sticky navigation

### 📚 Resources Page
- Comprehensive academic resource browser
- Advanced search and filtering
- Category-based navigation (Lecture Notes, Past Papers, Videos, Assignments)
- Subject-specific filtering
- Featured resources section
- Download tracking and ratings

### 📅 Timetable Page
- Weekly calendar grid view
- List view for all classes
- Interactive class blocks with hover details
- Color-coded by subject type
- Week navigation controls
- Quick stats dashboard

### 🗺️ Map Page
- Interactive campus navigator
- Building and floor selection
- Real-time room availability status
- Clickable SVG floor plans
- Room details with capacity and facilities
- Search functionality for classrooms

### ✍️ Contribute Page
- Community contribution form
- File upload with drag-and-drop
- Comprehensive metadata fields
- Contribution guidelines sidebar
- Top contributors leaderboard
- Success/error notifications

## Design System

### Color Palette
- **Background**: Deep Slate (#020617)
- **Surface/Cards**: Slate-900 (#0f172a)
- **Borders**: Slate-800 (#1e293b)
- **Primary Text**: Slate-200 (#e2e8f0)
- **Secondary Text**: Slate-400 (#94a3b8)
- **Accent**: Indigo-500 (#6366f1)

### Design Aesthetic
- "Intellectual Dark Mode"
- Modern SaaS-inspired (Vercel, Linear.app style)
- Glassmorphism effects
- Soft inner glows
- Tight tracking (-2%) on headings
- Professional and academic tone

## Technology Stack

- **Framework**: React with TypeScript
- **Routing**: React Router v7 (Data Mode)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Build Tool**: Vite

## Project Structure

```
/
├── components/
│   ├── bento-grid.tsx           # Dashboard grid
│   ├── campus-map.tsx           # Campus map component
│   ├── footer.tsx               # Site footer
│   ├── hero-section.tsx         # Homepage hero
│   ├── layout.tsx               # Main layout wrapper
│   ├── navbar.tsx               # Navigation bar
│   └── resources-section.tsx    # Resources preview
├── pages/
│   ├── contribute-page.tsx      # Contribution form
│   ├── home-page.tsx            # Landing page
│   ├── map-page.tsx             # Campus navigator
│   ├── not-found.tsx            # 404 page
│   ├── resources-page.tsx       # Full resources browser
│   └── timetable-page.tsx       # Class schedule
├── guidelines/
│   └── Guidelines.md            # Contribution guidelines
├── routes.ts                     # Route configuration
└── App.tsx                       # App entry point
```

## Key Features Implementation

### Navigation
- Active route highlighting
- Smooth transitions
- Glassmorphic backdrop blur
- Responsive layout

### Interactive Elements
- Hover effects on cards and buttons
- Click-to-select on map rooms
- Filterable resource lists
- Sortable data tables
- Form validation

### Visual Effects
- Mesh gradients
- Inner glows on cards
- Animated status indicators
- Subtle border transitions
- Background grid patterns

## Pages

### Home (`/`)
Complete landing page with hero, dashboard, resources preview, and campus map

### Resources (`/resources`)
Full-featured resource browser with search, filters, and featured content

### Timetable (`/timetable`)
Interactive weekly schedule with multiple view modes

### Map (`/map`)
Campus navigator with floor plans and room search

### Contribute (`/contribute`)
Submission form for community contributions

## Guidelines

Comprehensive contribution guidelines are available at `/guidelines/Guidelines.md` covering:
- Quality standards
- Content types
- Copyright policies
- Submission process
- Review workflow
- Recognition system

## Design Principles

1. **Professional First**: Academic and trustworthy aesthetic
2. **Information Dense**: Maximum utility without clutter
3. **Intuitive Navigation**: Clear hierarchy and flow
4. **Accessible**: High contrast, readable text
5. **Responsive**: Optimized for desktop viewing
6. **Performance**: Fast loading, smooth interactions

## Future Enhancements

- User authentication system
- Real-time collaboration features
- Mobile responsive views
- Advanced analytics dashboard
- Integration with ERP systems
- API for external tools

---

Built with ❤️ by the AI Society, IIT Kharagpur
