# Getting Started Guide - Golobe Travel Agency

Welcome to the Golobe Travel Agency project! This comprehensive guide will help you set up and run the project locally on your machine.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Payment Integration](#payment-integration)
- [Email Configuration](#email-configuration)
- [Running the Application](#running-the-application)
- [Generating Sample Data](#generating-sample-data)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## 🚀 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)
- **MongoDB** (v6 or higher) - [Download here](https://www.mongodb.com/try/download/community)

### Optional but Recommended

- **VS Code** or your preferred code editor
- **MongoDB Compass** (GUI for MongoDB) - [Download here](https://www.mongodb.com/try/download/compass)
- **Postman** or **Insomnia** (for API testing)

### Verify Installation

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version
git --version

# Check MongoDB version (if installed locally)
mongod --version
```

## ⚡ Quick Start

If you're familiar with Next.js projects, here's the quick setup:

```bash
# 1. Clone the repository
git clone https://github.com/mojahidhasan/fullstack-nextjs-golobe-travel-agency.git

# 2. Navigate to project directory
cd fullstack-nextjs-golobe-travel-agency

# 3. Install dependencies
npm install

# 4. Create environment file
cp .env.example .env.local

# 5. Configure environment variables (see Environment Configuration section)

# 6. Start development server
npm run dev

# 7. Generate sample data
curl -X POST http://localhost:3000/api/generate/flights/upload_db -H "Authorization: Bearer YOUR_API_SECRET_TOKEN"
curl -X POST http://localhost:3000/api/generate/hotels/upload_db -H "Authorization: Bearer YOUR_API_SECRET_TOKEN"
curl -X POST http://localhost:3000/api/generate/website_config -H "Authorization: Bearer YOUR_API_SECRET_TOKEN"
```

## 🔧 Detailed Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/mojahidhasan/fullstack-nextjs-golobe-travel-agency.git
cd fullstack-nextjs-golobe-travel-agency
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required dependencies including:

- Next.js 14 with App Router
- React 18
- MongoDB and Mongoose
- NextAuth.js for authentication
- Stripe for payments
- Tailwind CSS for styling
- Redux Toolkit for state management
- And many more...

### Step 3: Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# For Windows
copy .env.example .env.local

# For macOS/Linux
cp .env.example .env.local
```

## 🔐 Environment Configuration

The application requires several environment variables to function properly. Here's a complete list:

### Required Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/golobe_travel_agency

# Authentication
AUTH_SECRET=your-super-secret-auth-key-here

# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_REVALIDATION_TIME=600

# API Security
API_SECRET_TOKEN=your-api-secret-token-here
CRON_SECRET=your-cron-secret-token-here

# Stripe (Payment Processing)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PK=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# Email (Mailjet)
MAIL_API_TOKEN=your_mailjet_api_token
MAIL_SECRET_TOKEN=your_mailjet_secret_token
MAIL_SENDER_EMAIL=noreply@yourdomain.com
```

### Environment Variables Explained

| Variable                | Description                         | Required | Example                                          |
| ----------------------- | ----------------------------------- | -------- | ------------------------------------------------ |
| `MONGODB_URI`           | MongoDB connection string           | Yes      | `mongodb://localhost:27017/golobe_travel_agency` |
| `AUTH_SECRET`           | Secret key for NextAuth.js          | Yes      | `your-super-secret-auth-key-here`                |
| `NEXT_PUBLIC_BASE_URL`  | Public base URL for the application | Yes      | `http://localhost:3000`                          |
| `API_SECRET_TOKEN`      | Token for API authentication        | Yes      | `your-api-secret-token-here`                     |
| `STRIPE_SECRET_KEY`     | Stripe secret key for payments      | Yes      | `sk_test_...`                                    |
| `NEXT_PUBLIC_STRIPE_PK` | Stripe publishable key              | Yes      | `pk_test_...`                                    |
| `MAIL_API_TOKEN`        | Mailjet API token for emails        | Yes      | `your_mailjet_api_token`                         |

## 🗄️ Database Setup

### Option 1: Local MongoDB Installation

1. **Install MongoDB Community Edition**

   - [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your OS

2. **Start MongoDB Service**

   ```bash
   # Windows (as Administrator)
   net start MongoDB

   # macOS (with Homebrew)
   brew services start mongodb-community

   # Linux (Ubuntu/Debian)
   sudo systemctl start mongod
   ```

3. **Verify Connection**
   ```bash
   mongosh
   # or
   mongo
   ```

### Option 2: MongoDB Atlas (Cloud)

1. **Create MongoDB Atlas Account**

   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account

2. **Create a Cluster**

   - Choose the free tier (M0)
   - Select your preferred cloud provider and region

3. **Get Connection String**

   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

4. **Update Environment Variable**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/golobe_travel_agency
   ```

## 💳 Payment Integration (Stripe)

### Setting Up Stripe

1. **Create Stripe Account**

   - Go to [Stripe Dashboard](https://dashboard.stripe.com/)
   - Create an account or sign in

2. **Get API Keys**

   - Go to Developers → API keys
   - Copy your publishable key and secret key
   - For testing, use the test keys (start with `pk_test_` and `sk_test_`)

3. **Set Up Webhook**

   - Go to Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy the webhook secret

4. **Update Environment Variables**
   ```env
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PK=pk_test_your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
   ```

## 📧 Email Configuration (Mailjet)

### Setting Up Mailjet

1. **Create Mailjet Account**

   - Go to [Mailjet](https://www.mailjet.com/)
   - Create a free account

2. **Get API Credentials**

   - Go to Account → API Keys
   - Copy your API Key and Secret Key

3. **Configure Sender Email**

   - Go to Senders & Domains
   - Add and verify your sender email

4. **Update Environment Variables**
   ```env
   MAIL_API_TOKEN=your_mailjet_api_token
   MAIL_SECRET_TOKEN=your_mailjet_secret_token
   MAIL_SENDER_EMAIL=noreply@yourdomain.com
   ```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Available Scripts

| Script          | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build for production     |
| `npm start`     | Start production server  |
| `npm run lint`  | Run ESLint               |
| `npm test`      | Run tests                |
| `npm run setup` | Setup env automatically  |

## 📊 Generating Sample Data

The application includes endpoints to generate sample data for testing:

### Generate Flight Data

```bash
# Upload flights to database (deletes existing data first)
curl -X POST http://localhost:3000/api/generate/flights/upload_db \
  -H "Authorization: Bearer YOUR_API_SECRET_TOKEN"

# Store flights data in files
curl -X POST http://localhost:3000/api/generate/flights/store_in_file \
  -H "Authorization: Bearer YOUR_API_SECRET_TOKEN"
```

### Generate Hotel Data

```bash
# Upload hotels to database
curl -X POST http://localhost:3000/api/generate/hotels/upload_db \
  -H "Authorization: Bearer YOUR_API_SECRET_TOKEN"

# Store hotels data in files
curl -X POST http://localhost:3000/api/generate/hotels/store_in_file \
  -H "Authorization: Bearer YOUR_API_SECRET_TOKEN"
```

### Generate Website Configuration

```bash
# Upload website config to database
curl -X POST http://localhost:3000/api/generate/website_config \
  -H "Authorization: Bearer YOUR_API_SECRET_TOKEN"
```

### Windows PowerShell Commands

```powershell
# For Windows users, use curl.exe
curl.exe -X POST http://localhost:3000/api/generate/flights/upload_db -H "Authorization: Bearer YOUR_API_SECRET_TOKEN"
curl.exe -X POST http://localhost:3000/api/generate/hotels/upload_db -H "Authorization: Bearer YOUR_API_SECRET_TOKEN"
curl.exe -X POST http://localhost:3000/api/generate/website_config -H "Authorization: Bearer YOUR_API_SECRET_TOKEN"
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test
```

### Test Coverage

The project uses Vitest for testing. Tests are located in the `__tests__` directory.

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**

   - Install Vercel CLI: `npm i -g vercel`
   - Run: `vercel`

2. **Configure Environment Variables**

   - Add all environment variables in Vercel dashboard
   - Update URLs to production domain

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Other Deployment Options

- **Netlify**: Configure build settings for Next.js
- **Railway**: Connect GitHub repository
- **DigitalOcean App Platform**: Deploy from GitHub
- **AWS Amplify**: Connect repository and configure build settings

## 🔧 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error

```
Error: MONGODB_URI not found in .env file
```

**Solution**: Ensure `MONGODB_URI` is set in your `.env.local` file

#### 2. Authentication Error

```
Error: AUTH_SECRET is required
```

**Solution**: Add `AUTH_SECRET` to your environment variables

#### 3. Stripe Payment Error

```
Error: Stripe secret key is missing
```

**Solution**: Verify `STRIPE_SECRET_KEY` is set correctly

#### 4. Email Sending Error

```
Error: Mailjet credentials are invalid
```

**Solution**: Check `MAIL_API_TOKEN` and `MAIL_SECRET_TOKEN`

#### 5. Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution**:

```bash
# Kill process on port 3000
npx kill-port 3000
# or
lsof -ti:3000 | xargs kill -9
```

#### 6. Node Modules Issues

```
Error: Cannot find module
```

**Solution**:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Performance Issues

1. **Slow Development Server**

   - Use `npm run dev` with Node.js 18+
   - Consider using `npm run dev --turbo` for faster builds

2. **Large Bundle Size**
   - Check for unused dependencies
   - Use dynamic imports for large components

### Database Issues

1. **Connection Timeout**

   - Check MongoDB service is running
   - Verify connection string format
   - Check network connectivity

2. **Data Not Loading**
   - Ensure sample data is generated
   - Check database permissions
   - Verify collection names

## 📁 Project Structure

```
fullstack-nextjs-golobe-travel-agency/
├── app/                          # Next.js App Router
│   ├── (pages)/                  # Route groups
│   ├── api/                      # API routes
│   ├── layout.js                 # Root layout
│   └── page.js                   # Home page
├── components/                   # React components
│   ├── local-ui/                 # Reusable UI components
│   ├── pages/                    # Page-specific components
│   └── sections/                 # Section components
├── lib/                          # Utility libraries
│   ├── actions/                  # Server actions
│   ├── db/                       # Database utilities
│   ├── email/                    # Email utilities
│   └── paymentIntegration/       # Payment utilities
├── reduxStore/                   # Redux store configuration
├── public/                       # Static assets
├── data/                         # Static data files
├── __tests__/                    # Test files
├── admin/                        # Admin panel
└── middleware.js                 # Next.js middleware
```

### Key Directories Explained

| Directory     | Purpose                                    |
| ------------- | ------------------------------------------ |
| `app/`        | Next.js 14 App Router pages and API routes |
| `components/` | React components organized by type         |
| `lib/`        | Utility functions and configurations       |
| `reduxStore/` | Redux store setup and slices               |
| `public/`     | Static assets (images, icons, etc.)        |
| `data/`       | Static data and configuration files        |
| `__tests__/`  | Test files using Vitest                    |

<!-- ## 🤝 Contributing

### Development Workflow

1. **Fork the Repository**

   - Fork the project on GitHub
   - Clone your fork locally

2. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**

   - Follow the existing code style
   - Add tests for new features
   - Update documentation

4. **Commit Changes**

   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style

- Use ESLint and Prettier for code formatting
- Follow Next.js best practices
- Use TypeScript for new files (when migrating)
- Write meaningful commit messages

### Testing Guidelines

- Write unit tests for utility functions
- Write integration tests for API routes
- Test user flows end-to-end
- Maintain good test coverage -->

## 📚 Additional Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Stripe Documentation](https://stripe.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Community

- [Next.js Discord](https://discord.gg/nextjs)
- [MongoDB Community](https://community.mongodb.com/)
- [Stripe Community](https://support.stripe.com/)

### Support

If you encounter any issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/mojahidhasan/fullstack-nextjs-golobe-travel-agency/issues)
3. Create a new issue with detailed information
4. Join the community discussions

---

**Happy Coding! 🚀**

If you find this guide helpful, please consider giving the project a ⭐ on GitHub!
