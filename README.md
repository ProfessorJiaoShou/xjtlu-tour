# XJTLU Campus Tour

An interactive campus tour application for Xi'an Jiaotong-Liverpool University (XJTLU), featuring 360° panoramic views, location-based check-ins, AR scanning, and gamified exploration elements.

## 🚀 Features

- **Interactive Campus Map** - Built with AMap (高德地图) for navigation
- **360° Panorama Viewer** - Immersive panoramic views of campus locations
- **AR QR Scanner** - Scan QR codes to check in at locations
- **Photo Album** - Capture and store campus memories
- **Location-Based Check-ins** - Visit campus spots and earn points
- **Profile System** - Customizable user profiles
- **Tour Progress Tracking** - Gamified exploration with progress indicators
- **Responsive Design** - Works on desktop and mobile devices

## 🛠 Technologies Used

### Core Framework
- **React** (18.3.1) - UI library
- **Vite** (6.3.5) - Build tool and dev server
- **TypeScript** - Type-safe JavaScript

### Styling & UI
- **Tailwind CSS** (4.1.12) - Utility-first CSS framework
- **MUI (Material UI)** (7.3.5) - React component library
- **Radix UI** - Unstyled, accessible UI components
- **Emotion** - CSS-in-JS library

### Maps & Geolocation
- **AMap / 高德地图** - Campus map visualization
- **Leaflet** - OpenStreetMap integration

### Visualization & Media
- **Photo Sphere Viewer** (5.14.1) - 360° panoramic viewer
- **Recharts** - Data visualization charts
- **HTML5 QR Code** - QR code scanning

### Additional Libraries
- **React Router** (7.13.0) - Client-side routing
- **React Hook Form** - Form handling
- **Framer Motion** - Animations
- **Canvas Confetti** - Celebration effects
- **Date-fns** - Date utilities
- **Embla Carousel** - Carousel component
- **Sonner** - Toast notifications

## 📦 Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (recommended) or npm/yarn

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd 333
```

### 2. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Using npm
npm install

# Using yarn
yarn install
```

### 3. Configure Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

> **Note**: The project includes pre-configured keys for development. For production, obtain your own keys from [高德开放平台](https://lbs.amap.com/).

### 4. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production

```bash
pnpm build
```

### 6. Preview Production Build

```bash
pnpm preview
```

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 🎮 Usage Flow

1. **Welcome Screen** - Start your campus tour
2. **Profile Setup** - Enter your name and preferences
3. **Campus Map** - Navigate through campus locations
4. **Location Details** - View information about each spot
5. **Panorama View** - Explore 360° views
6. **Check-in** - Scan QR codes or capture photos to check in
7. **Photo Album** - View your captured memories
8. **Progress Tracking** - Monitor your tour completion

## 📱 Supported Browsers

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 📄 License

This project is for educational purposes as part of CPT208.AY2526 coursework.

## 👥 Credits

- **University**: Xi'an Jiaotong-Liverpool University
- **Course**: CPT208 - Software Engineering
- **Map Provider**: OpenMap