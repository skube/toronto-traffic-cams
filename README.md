# Toronto Traffic Cams

A modern, responsive web application for viewing live traffic camera feeds from across Toronto. Built with performance and aesthetics in mind.

## 🚀 Purpose

This application provides real-time access to traffic camera images from the City of Toronto's Open Data API. It is designed to be a fast, user-friendly way for commuters and residents to check traffic conditions at a glance.

## 🛠 Tech Stack

- **Framework**: [React](https://react.dev/) 19
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Styling**: Custom CSS with Glassmorphism design system
- **Deployment**: Static site (ready for Vercel, Netlify, or GitHub Pages)

## ✨ Features

- **Live Feeds**: Camera images automatically refresh every 15 seconds.
- **Search**: Instantly filter cameras by road name or intersection.
- **Sorting**: Sort cameras by name or geographic direction (N-S, E-W, etc).
- **Interactive Lightbox**: Click any card to view the camera feed in a large modal.
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices.
- **Performance**: Lazy loading for images and optimized rendering.

## 🏁 Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd toronto-traffic-cams
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   ```

4. **Build for production**
   ```bash
   pnpm build
   ```

## 📊 Data Source

Data is provided by the [City of Toronto Open Data](https://open.toronto.ca/) portal via the ArcGIS REST API.
