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

<img src="https://www.gstatic.com/mobilesdk/240501_mobilesdk/firebase_96dp.png" width="16" height="16"> Firebase Cloud Storage

<img src="https://assets.mailjet.com/lib/images/mailjetLogo/mj_logo_only_icon_color.png" width="16" height="16"> Mailjet

## Features

1. **User Authentication**

   - Email and phone verification
   - Anonymous user signup for guest browsing
   - Profile management with customizable settings

2. **Flight Services**

   - Advanced flight search with multiple filters
   - Multi-city and round trip options
   - Favorite flights saving feature

3. **Hotel Services**

   - Comprehensive hotel search and filtering
   <!-- - Room type selection, not yet implemented -->

4. **User Experience**

   - Timezone detection for accurate scheduling
   - Responsive design for all devices
     <!-- - Intuitive booking process, not yet implemented -->
     <!-- - Search history tracking, not yet implemented  -->

5. **Account Management**

   - Multiple email addresses support
   - Phone number management
     <!-- - Booking history and receipts , not yet implemented -->
     <!-- - Saved payment methods , not yet implemented -->

6. **Technical Implementation**

   - Server-side rendering with Next.js App Router
   - Server components and server actions
   - Dynamic OG image generation for avatars
   - Parallel route loading with dedicated loading states
   - Custom server-side utilities for data processing

7. **Data Management**

   - MongoDB integration with custom ORM-like functions
   - Real-time flight pricing calculations
   - Rating and review system for flights
   - Session-based data persistence
   - Timezone-aware date handling

8. **Performance Optimization**
   - Client-side state management with Redux
   - Server-side caching strategies
   - Optimized image delivery
   - Responsive loading skeletons

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

## Local Development Setup

To set up and run the project locally, follow these steps:

1. **Clone the repository**

   ```sh
   git clone https://github.com/mojahidhasan/fullstack-nextjs-golobe-travel-agency.git
   ```

2. **Navigate to the project directory**

   ```sh
   cd fullstack-nextjs-golobe-travel-agency
   ```

3. **Install dependencies**

   ```sh
   npm install
   ```

4. **Configure environment variables**

   - Rename `.env.example` to `.env` or `.env.local`
   - Set the required values for all environment variables
   - Note: The application may fail to run if environment variables are not properly configured

5. **Generate sample data** (Optional)

   ```sh
   # Generate and upload flights data to MongoDB
   # This will creates 10 days of flight data but deletes all flight data from db before uploading
   # If you want to add more flight data without deleting, use `/api/cronjob/flight_schedule` api endpoint
   npm run generateAndUploadFlightsDB

   # Generate flights data files
   npm run generateFlightsFiles

   # Generate and upload hotels data to MongoDB
   npm run generateAnduploadHotelsDB

   # Generate hotels data files
   npm run generateHotelsFiles
   ```

   Files will be generated in `./generated` directory.

6. **Start the development server**

   ```sh
   npm run dev
   ```

   The application will be available at:

   ```bash
   http://localhost:3000
   ```

## TODO

### Core Features

- Integrate real flight API to replace mock data (High Priority)
- Implement flight ticket booking system
- Add hotel reservation functionality
- Develop fake payment system

### User Account & Profile

- Implement profile management:
  - Password updates
  - Contact information changes
  - Personal detail modifications
- Add payment methods management interface
- Create booking history section:
  - Flight tickets
  - Hotel reservations

### UI/UX Improvements

- Implement dark mode toggle
- Enhance favorites page with hotel cards and improved organization
- Add ticket download functionality (PDF/QR Codes)

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

Note: Several smaller enhancements and bug fixes are also planned for optimal user experience.
