# Avance Insights Website

A modern market research and brand solutions website built with Next.js 14, featuring an AI-powered chatbot, CMS integration, and interactive visualizations.

## 🚀 Features

- **Modern UI/UX**: Consulting-grade design with smooth animations (Framer Motion)
- **AI Chatbot**: Groq-powered intelligent assistant with RAG capabilities
- **Interactive 3D Globe**: Three.js visualization showing global reach
- **Headless CMS**: Strapi integration for content management
- **Survey Integration**: KoboToolbox embeds for live surveys
- **Contact Form**: Nodemailer-powered email notifications
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **SEO Optimized**: Meta tags, JSON-LD schemas, sitemap

## 📋 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **3D/Charts**: Three.js (react-three-fiber), Chart.js
- **AI/ML**: Groq API (Llama 3)
- **CMS**: Strapi (optional)
- **Database**: PostgreSQL (for Strapi)
- **Email**: Nodemailer

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL (for Strapi CMS)

### Installation

1. **Clone and install dependencies**:
```bash
cd avance-insights
npm install
```

2. **Configure environment variables**:
   - Copy `.env.local` and update with your values
   - Required: `GROQ_API_KEY` for AI chatbot
   - Optional: SMTP settings for contact form

3. **Run development server**:
```bash
npm run dev
```

4. **Open browser**:
   Navigate to `http://localhost:3000`

## 🔧 Environment Variables

```env
# Strapi CMS (optional)
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_token

# Groq AI (required for chatbot)
GROQ_API_KEY=your_groq_api_key

# Email (required for contact form)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_app_password
CONTACT_EMAIL=recipient@email.com

# Site URL
NEXT_PUBLIC_SITE_URL=https://avanceinsights.in
```

## 📁 Project Structure

```
avance-insights/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── chat/          # AI chatbot endpoint
│   │   └── contact/       # Contact form endpoint
│   ├── about/             # About page
│   ├── ai-insights/       # Full AI chat page
│   ├── contact/           # Contact page
│   ├── surveys/           # Live surveys
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/
│   ├── chat/              # Chatbot components
│   ├── home/              # Homepage sections
│   └── layout/            # Navbar, Footer
├── lib/                   # Utilities
│   ├── strapi.ts          # Strapi API client
│   └── utils.ts           # Helper functions
└── public/                # Static assets
```

## 🎨 Key Components

### AI Chatbot (`/api/chat`)
- Powered by Groq's Llama 3 model
- Context-aware responses about company services
- Source citations for transparency

### 3D Globe (`components/home/Globe3D.tsx`)
- Interactive WebGL visualization
- City markers for global presence
- Connection lines showing network

### Contact Form
- Zod validation
- Honeypot spam protection
- Email notifications to admin and user

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, stats, services |
| `/about` | Company info, team, certifications |
| `/services` | Service offerings |
| `/insights` | Blog/research articles |
| `/surveys` | Live KoboToolbox surveys |
| `/ai-insights` | Full-page AI chat interface |
| `/contact` | Contact form |

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Docker
```bash
docker build -t avance-insights .
docker run -p 3000:3000 avance-insights
```

## 🔐 Security

- HTTPS enforced in production
- CSP headers for iframe security
- Input sanitization on all forms
- Environment variables for secrets

## 📈 Performance

- Lighthouse score target: 90+
- Lazy loading for heavy components
- Image optimization with Next.js
- Static generation where possible

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

This project is proprietary software for Avance Insights.

## 📞 Support

For support, email info@avanceinsights.in or visit our website.

---

Built with ❤️ by Avance Insights
