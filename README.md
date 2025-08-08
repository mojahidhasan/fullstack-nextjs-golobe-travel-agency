# Golobe Travel Agency Website

![Home Screen Golobe Travel Agency](/preview.jpg)

## Overview

Welcome to the repository for Golobe Travel Service’s website, your go-to platform for exploring and booking your next travel adventure. This intuitive web interface allows users to search for flights and accommodations effortlessly.

A full-stack nextjs project to practice and showcase the work. The UI design was taken from [Figma community](https://www.figma.com/community/file/1182308758714734501/golobe-travel-agency-website).

Here is the live preview of this website [golob-travel-agency.vercel.app](https://golob-travel-agency.vercel.app)

## Technologies used in this project

<img src="https://nextjs.org/favicon.ico" width="16" height="16"> Next js v14

<img src="https://www.mongodb.com/assets/images/global/favicon.ico" width="16" height="16"> MongoDB

<img src="https://tailwindcss.com/favicons/favicon-32x32.png?v=3" width="16" height="16"> Tailwind CSS

<img src="https://redux.js.org/img/favicon/favicon.ico" width="16" height="16"> Redux

<img src="https://authjs.dev/favicon-32x32.png" width="16" height="16"> Next Auth v5

<img src="https://assets.mailjet.com/lib/images/mailjetLogo/mj_logo_only_icon_color.png" width="16" height="16"> Mailjet

<img src="https://assets.stripeassets.com/fzn2n1nzq965/01hMKr6nEEGVfOuhsaMIXQ/c424849423b5f036a8892afa09ac38c7/favicon.ico" width="16" height="16"> Stripe

## Features

### 1. User Authentication & Account

- Profile management: update personal details, change password, manage multiple emails and phone numbers
- User settings: account, security, appearance, and payment preferences

### 2. Flight Booking

- Multi-city and round-trip booking support
- Real-time flight pricing calculations
- Flight details page with schedule, baggage, and seat info
- Flight booking with step-by-step process
- Save favorite flights
- View and manage flight bookings (upcoming, past, all)
- Download flight tickets/invoices

### 3. Hotel Booking

- Hotel search with filters (destination, date, guests, rooms)
- Hotel details page with amenities, map, reviews, and room types
- Book hotels with guest info and room selection
- View and manage hotel bookings (upcoming, past, all)
- Download hotel invoices
- Save favorite hotels
- Recent hotel search history for logged-in users

### 4. Payments & Checkout

- Stripe integration for secure payments (flights & hotels)
- Support for saving payment methods (cards)
- Payment status tracking (pending, confirmed, failed)
- Downloadable receipts/invoices for bookings

### 5. Reviews & Ratings

- Leave and view reviews for both flights and hotels
- Verified user review system
- Average rating calculation and display
- Review management (one review per booking per user)

### 6. User Experience & UI

- Responsive design for desktop and mobile
- Modern, intuitive booking process with stepper UI
- Loading skeletons and parallel route loading for fast UX
- Timezone detection for accurate scheduling
- Search history tracking (for hotels)
- Accessible navigation and sidebar

### 7. Account Management

- Booking history for flights and hotels
- Saved payment methods and card management
- Downloadable receipts and invoices
- Profile and settings management

### 8. Admin & Configuration

- Maintenance mode (full/partial) with customizable message and allowlisted routes
- Feature toggles for enabling/disabling flight and hotel booking
- Website configuration management (admin only)

### 9. Technical Features

- Next.js App Router with server components and server actions
- MongoDB integration with custom ORM-like functions
- Server-side rendering and caching
- Dynamic OG image generation for avatars
- Email notifications (booking confirmations, receipts, reminders)
- Data validation with Zod schemas
- Redux for client-side state management

## Limitations

- Limited payment gateway integration (currently only supports test mode)
- No real-time flight availability checking
- Basic hotel booking functionality (room selection not implemented)
- No advanced user analytics or search history tracking
- Limited error handling for edge cases in flight search
- No multi-language support implemented
- No social media login options (only email/password authentication)
- Limited mobile optimization for some complex components
- No offline functionality or caching of search results
- Basic flight review system without advanced filtering
- No flight price alert or tracking system
- Limited airline partnership integrations
- No advanced filtering options for flight results
- No support for flight booking modifications
- Basic user profile management features
- No integration with travel insurance providers
- Limited accessibility features for differently-abled users
- No group booking functionality
- No loyalty program or rewards system

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

1. **Clone the repository**

   ```sh
   git clone https://github.com/mojahidhasan/fullstack-nextjs-golobe-travel-agency.git
   cd fullstack-nextjs-golobe-travel-agency
   ```

2. **Run the setup script**

   ```sh
   npm run setup
   ```

   This interactive script will help you configure all environment variables.

3. **Install dependencies**

   ```sh
   npm install
   ```

4. **Start the development server**

   ```sh
   npm run dev
   ```

5. **Generate sample data**

   ```sh
   # Generate flights data
   curl -X POST http://localhost:3000/api/generate/flights/upload_db -H "Authorization: Bearer YOUR_API_SECRET_TOKEN"

   # Generate hotels data
   curl -X POST http://localhost:3000/api/generate/hotels/upload_db -H "Authorization: Bearer YOUR_API_SECRET_TOKEN"

   # Generate website config
   curl -X POST http://localhost:3000/api/generate/website_config -H "Authorization: Bearer YOUR_API_SECRET_TOKEN"
   ```

### Option 2: Manual Setup

For detailed step-by-step instructions, please refer to our comprehensive **[Getting Started Guide](GETTING_STARTED.md)**.

## 📚 Documentation

- **[Getting Started Guide](GETTING_STARTED.md)** - Complete setup and configuration guide
- **[Features](#features)** - Overview of project features
- **[Technologies](#technologies-used-in-this-project)** - Tech stack information
- **[Limitations](#limitations)** - Current project limitations
- **[TODO](#todo)** - Planned features and improvements

## TODO

### Core Features

- Integrate real flight API to replace mock data (High Priority)
- Implement real hotel API to replace mock data

### User Account & Profile

- Implement profile management:
  - Password updates
  - Contact information changes
  - Personal detail modifications

### UI/UX Improvements

- Implement dark mode toggle

### Technical Enhancements

- Migrate codebase to TypeScript
- Implement comprehensive test suite:
  - Unit tests
  - Integration tests
  - E2E testing
- Add email notification system for:
  - Booking confirmations
  - Payment receipts
  - Travel reminders

### Additional Features

- Develop loyalty/rewards program
- Implement price alert system
- Add multi-language support
- Create admin dashboard for content management
- Adding websocket for real-time updates

Note: Several smaller enhancements and bug fixes are also planned for optimal user experience.
