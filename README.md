# LEGACY

LEGACY - Premium Fashion Experience

## Overview

LEGACY is a modern e-commerce platform built with Next.js, featuring AI-powered product visualization and personalized shopping experiences.

## Features

- AI-powered product try-on visualization
- Modern, responsive design
- Real-time image generation
- Smooth animations and transitions
- Mobile-optimized interface

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd legacy
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Run the development server:
```bash
pnpm dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

### Automatic Deployment (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically deploy your app

### Manual Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Add your environment variables here
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## Project Structure

```
legacy/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # UI components
│   └── image-with-loading.tsx
├── lib/                  # Utility functions
├── public/               # Static assets
├── styles/               # Additional styles
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

© 2025 LEGACY, INC. ALL RIGHTS RESERVED.
