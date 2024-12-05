# Golobe Travel Agency Website

![Home Screen Golobe Travel Agency](/preview.jpg)

## Overview

Welcome to the repository for Golobe Travel Service’s website, your go-to platform for exploring and booking your next travel adventure. This intuitive web interface allows users to search for flights and accommodations effortlessly.

A full-stack nextjs project to practice and showcase the work. The UI design was taken from [Figma community](https://www.figma.com/community/file/1182308758714734501/golobe-travel-agency-website).

Here is the live preview of this website [golob-travel-agency.vercel.app](https://golob-travel-agency.vercel.app)

## Note

- This website is not a real travel agency website. This was only for practicing web development. Not all the data shown here is real. This website used [fakerjs](https://fakerjs.dev/) to generate fake data.
- **Never provide your real card data here**. This website can collect information from some places (e.g.: subscription, signup, payment method adding, profile photo and cover photo uploading, etc.). So it is recommended that you don't provide your real information there. This website does not verify email during sign-up. So you can sign up using a fake email. However, if you sign in with Google, Facebook, or Apple, it can collect your real information. So do it with caution. Use fake data instead. This data will only be saved in the database, and nothing will be done with it. You can still test buying tickets for flights and book flight functionalities with fake data.

## Technologies used in this project

<img src="https://nextjs.org/favicon.ico" width="16" height="16"> Next js v14

<img src="https://www.mongodb.com/assets/images/global/favicon.ico" width="16" height="16"> MongoDB

<img src="https://tailwindcss.com/favicons/favicon-32x32.png?v=3" width="16" height="16"> Tailwind CSS

<img src="https://redux.js.org/img/favicon/favicon.ico" width="16" height="16"> Redux

<img src="https://authjs.dev/favicon-32x32.png" width="16" height="16"> Next Auth v5

<img src="https://www.gstatic.com/mobilesdk/240501_mobilesdk/firebase_96dp.png" width="16" height="16"> Firebase Cloud Storage

<img src="https://assets.mailjet.com/lib/images/mailjetLogo/mj_logo_only_icon_color.png" width="16" height="16"> Mailjet

## Features

1. Fully Responsive
2. Used redux for state management
3. Used tailwind for styling
4. Flight and Hotel search (dummy data)
5. Filter Flight and Hotel
6. Show flight and hotel details
7. Buy a ticket or book a hotel
8. Get a ticket after buying
9. Sorting search results by best, shortest, and cheapest
10. Add to favorite
11. Login and Signup

## Limitations

- The website is not a real travel agency website. This was only for practicing web development.
- The data shown here is not real data.
- This website is hosted on Vercel with the hobby plan and the hosting location is Europe. The timeout of tasks in the hobby plan is 10 seconds. So sometimes users with a slow connection or locations far from Europe may be unable to change their profile picture, cover photo, etc. because of exceeding the task time limit on Vercel.

## Work locally

1. Download or clone the repository

   ```sh
   git clone https://github.com/mojahidhasan/fullstack-nextjs-golobe-travel-agency.git
   ```

2. Navigate to the project directory

   ```sh
   cd fullstack-nextjs-golobe-travel-agency
   ```

3. Install dependencies

   ```sh
   npm install
   ```

4. rename the `.env.example` file from the root directory to `.env` or `.env.local` and set the proper values of keys. The app may get runtime errors if the `.env` file is not set up.
5. [Generate fake flight and related data](#generate-fake-flight-data-for-database)
6. start the local server

   ```sh
   npm run dev
   # http://localhost:3000
   ```

### Generate Fake Flight and Related Data for Database

1: To upload it to the database directly after generating it, run the following command:

```bash
npm run generateAndUploadDB
```

2: To generate fake flight and related data and save it in JSON file, run the following command:

```bash
npm run generateDBFiles
```

It should create files in the `generated` directory.

## TODO

This project is still in development. All front-end pages have been developed already but many functionalities especially the backend have not been implemented yet. Here are some functionalities that are yet to develop:

- Replacing fake flight data with real flight API
- Implementing hotel data (fake) in the database.
- Showing hotel data in search results.
- Search filter for hotels working properly.
- Buying tickets and Booking hotel functionality (demo).
- Add payment method form and make it functional.
- Adding functionality of changing password, phone number, address, and date of birth from profile
- Showing histories (i.e. Hotel book, Ticket buy) and added payment methods.
- Adding hotel card to the "/favorites" page
- Download ticket functionality
- Let users know via email that they have successfully bought a ticket or booked a hotel.
- Adding Dark mode.
- Migrating to Typescript.
- Adding tests cases.
- And some more small functionalities
