# StoxWatch 📈

A modern, full-stack stock market tracking application built with Next.js, featuring real-time market data, personalized watchlists, AI-powered news summaries, and comprehensive stock analysis tools.

![Next.js](https://img.shields.io/badge/Next.js-15.1.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-6.20.0-green?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)

## 🚀 Features

### Core Functionality
- **Real-Time Market Data**: Live stock prices, charts, and market overview using TradingView widgets
- **Stock Search**: Powerful search functionality with debounced queries to find stocks across multiple exchanges
- **Personalized Watchlist**: Save and track your favorite stocks with easy add/remove functionality
- **Detailed Stock Pages**: Comprehensive stock analysis including:
  - Advanced candlestick charts
  - Technical analysis indicators
  - Company profiles and financial statements
  - Baseline performance charts

### Dashboard
- **Market Overview**: Interactive market overview with sector-based tabs
- **Stock Heatmap**: Visual representation of market performance by sector
- **Market News Timeline**: Latest market news and top stories
- **Market Quotes**: Real-time quotes for popular stocks across different sectors

### User Experience
- **User Authentication**: Secure sign-up and sign-in with Better Auth
- **Personalized Onboarding**: Collects user preferences (investment goals, risk tolerance, preferred industries)
- **AI-Powered Emails**: 
  - Personalized welcome emails generated using Gemini AI
  - Daily news summaries based on watchlist stocks
  - Automated email delivery via Inngest background jobs
- **Responsive Design**: Fully responsive UI that works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode**: Beautiful dark theme optimized for extended viewing

### Background Automation
- **Scheduled Jobs**: Automated daily news summaries sent at 12:00 PM
- **Watchlist News**: Personalized watchlist news delivered at 9:00 AM
- **Email Notifications**: Automated email delivery using Nodemailer

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.1.3** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5.0** - Type-safe development
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
  - Avatar, Dialog, Dropdown Menu, Label, Select, Slot
- **Lucide React** - Icon library
- **React Hook Form** - Form state management
- **Sonner** - Toast notifications
- **CMDK** - Command palette component
- **React Select** - Advanced select components
- **Next Themes** - Theme management

### Backend & Database
- **MongoDB 6.20.0** - NoSQL database
- **Mongoose 8.19.2** - MongoDB object modeling
- **Better Auth 1.3.34** - Authentication library with MongoDB adapter
- **Next.js API Routes** - Server-side API endpoints

### External Services & APIs
- **Finnhub API** - Stock market data, company profiles, and news
- **TradingView Widgets** - Interactive charts and market visualizations
- **Inngest 3.44.3** - Background job processing and automation
- **Gemini AI (via Inngest)** - AI-powered email content generation
- **Nodemailer 7.0.10** - Email delivery service

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Dotenv** - Environment variable management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- MongoDB database (local or cloud instance like MongoDB Atlas)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd stock_market_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGO_URI=your_mongodb_connection_string
   
   # Authentication
   BETTER_AUTH_SECRET=your_secret_key_here
   BETTER_AUTH_URL=http://localhost:3000
   # For production, use your production URL
   # BETTER_AUTH_URL=https://your-domain.com
   
   # API Keys
   FINNHUB_API_KEY=your_finnhub_api_key
   
   # Email Configuration (for Nodemailer)
   SMTP_HOST=your_smtp_host
   SMTP_PORT=587
   SMTP_USER=your_smtp_username
   SMTP_PASS=your_smtp_password
   EMAIL_FROM=your_email@example.com
   
   # Inngest (for background jobs)
   INNGEST_EVENT_KEY=your_inngest_event_key
   INNGEST_SIGNING_KEY=your_inngest_signing_key
   
   # Optional: Email Verification Feature Flag
   FEATURE_FLAG_EMAIL_VERIFICATION=false
   ```

4. **Get API Keys**
   - **Finnhub**: Sign up at [finnhub.io](https://finnhub.io) for free API access
   - **Inngest**: Create an account at [inngest.com](https://inngest.com) for background job processing
   - **MongoDB**: Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for a free cloud database

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
stock_market_app/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (root)/            # Protected routes
│   │   ├── page.tsx       # Dashboard
│   │   ├── stocks/        # Stock detail pages
│   │   └── watchlist/     # User watchlist
│   └── api/               # API routes
│       ├── inngest/       # Inngest webhook
│       └── stocks/        # Stock search API
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   ├── forms/             # Form components
│   └── custom/            # Custom components
├── database/              # Database models and connection
│   └── models/
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and actions
│   ├── actions/          # Server actions
│   ├── better-auth/      # Auth configuration
│   ├── inngest/          # Background job functions
│   └── nodemailer/       # Email templates
├── middleware/            # Next.js middleware
└── types/                 # TypeScript type definitions
```

## 🎯 Key Features Explained

### Stock Search
- Debounced search with 500ms delay for optimal performance
- Searches across multiple exchanges (NYSE, NASDAQ, etc.)
- Displays popular stocks when no search query is provided
- Real-time watchlist status integration

### Watchlist Management
- Add/remove stocks with a single click
- Persistent storage in MongoDB
- User-specific watchlists
- Quick access from search results

### TradingView Integration
- Multiple chart types: candlestick, baseline, technical analysis
- Market overview and heatmap visualizations
- Real-time data updates
- Customizable widget configurations

### AI-Powered Features
- **Welcome Emails**: Personalized based on user profile (country, investment goals, risk tolerance, preferred industry)
- **News Summaries**: AI-generated summaries of market news relevant to user's watchlist
- Uses Google's Gemini 2.5 Flash Lite model via Inngest

### Background Jobs
- **Daily News Summary**: Runs at 12:00 PM daily
- **Watchlist News**: Runs at 9:00 AM daily
- **Welcome Email**: Triggered on user sign-up
- All jobs are fault-tolerant with error handling

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Deploy!

Vercel automatically detects Next.js and configures the build settings.

### Environment Variables for Production

Make sure to set these in your deployment platform:
- `MONGO_URI` - Your MongoDB connection string
- `BETTER_AUTH_SECRET` - A secure random string
- `BETTER_AUTH_URL` - Your production URL
- `FINNHUB_API_KEY` - Your Finnhub API key
- `SMTP_*` - Email configuration
- `INNGEST_*` - Inngest keys
- `FEATURE_FLAG_EMAIL_VERIFICATION` - Set to `true` for production

## 🧪 Testing

Test database connection:
```bash
npm run test:db
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test:db` - Test MongoDB connection

## 🔒 Security Features

- Secure password authentication with Better Auth
- Password length validation (8-64 characters)
- Email verification support (configurable)
- Protected routes via middleware
- Server-side session management
- Environment variable validation

## 🎨 UI/UX Highlights

- **Command Palette**: Press `Cmd/Ctrl + K` to quickly search stocks
- **Responsive Grid Layouts**: Adaptive layouts for all screen sizes
- **Loading States**: Smooth loading indicators throughout
- **Toast Notifications**: User-friendly feedback for all actions
- **Empty States**: Helpful guidance when watchlists are empty
- **Accessible Components**: Built with Radix UI for accessibility

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Finnhub](https://finnhub.io) for stock market data
- [TradingView](https://www.tradingview.com) for chart widgets
- [Inngest](https://inngest.com) for background job processing
- [Better Auth](https://better-auth.com) for authentication
- [Radix UI](https://www.radix-ui.com) for accessible components

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using Next.js and TypeScript**
