# API Documentation - Golobe Travel Agency

This document provides information about the available API endpoints in the Golobe Travel Agency application.

## 🔐 Authentication

Most API endpoints require authentication using a Bearer token. Set the `Authorization` header:

```
Authorization: Bearer YOUR_API_SECRET_TOKEN
```

## 📊 Data Generation Endpoints

These endpoints are used to generate and populate sample data for testing and development.

### Flight Data Generation

#### Generate and Upload Flights to Database

**Endpoint:** `POST /api/generate/flights/upload_db`

**Description:** Generates 10 days of flight data and uploads it to MongoDB. This will delete all existing flight data before uploading new data.

**Headers:**

```
Authorization: Bearer YOUR_API_SECRET_TOKEN
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/generate/flights/upload_db \
  -H "Authorization: Bearer YOUR_API_SECRET_TOKEN"
```

**Response:**

```json
{
  "success": true,
  "message": "Flights data generated and uploaded successfully"
}
```

#### Store Flights Data in Files

**Endpoint:** `POST /api/generate/flights/store_in_file`

**Description:** Generates flight data and stores it in JSON files for backup or analysis.

**Headers:**

```
Authorization: Bearer YOUR_API_SECRET_TOKEN
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/generate/flights/store_in_file \
  -H "Authorization: Bearer YOUR_API_SECRET_TOKEN"
```

**Response:**

```json
{
  "success": true,
  "message": "Flights data stored in files successfully"
}
```

### Hotel Data Generation

#### Generate and Upload Hotels to Database

**Endpoint:** `POST /api/generate/hotels/upload_db`

**Description:** Generates hotel data and uploads it to MongoDB.

**Headers:**

```
Authorization: Bearer YOUR_API_SECRET_TOKEN
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/generate/hotels/upload_db \
  -H "Authorization: Bearer YOUR_API_SECRET_TOKEN"
```

**Response:**

```json
{
  "success": true,
  "message": "Hotels data generated and uploaded successfully"
}
```

#### Store Hotels Data in Files

**Endpoint:** `POST /api/generate/hotels/store_in_file`

**Description:** Generates hotel data and stores it in JSON files.

**Headers:**

```
Authorization: Bearer YOUR_API_SECRET_TOKEN
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/generate/hotels/store_in_file \
  -H "Authorization: Bearer YOUR_API_SECRET_TOKEN"
```

**Response:**

```json
{
  "success": true,
  "message": "Hotels data stored in files successfully"
}
```

### Website Configuration

#### Generate Website Configuration

**Endpoint:** `POST /api/generate/website_config`

**Description:** Generates default website configuration data and uploads it to MongoDB.

**Headers:**

```
Authorization: Bearer YOUR_API_SECRET_TOKEN
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/generate/website_config \
  -H "Authorization: Bearer YOUR_API_SECRET_TOKEN"
```

**Response:**

```json
{
  "success": true,
  "message": "Website config DB uploaded successfully"
}
```

## 🔄 Cron Job Endpoints

These endpoints are designed to be called by cron jobs for automated tasks.

### Flight Schedule Generation

**Endpoint:** `POST /api/cronjob/flight_schedule`

**Description:** Generates additional flight data without deleting existing data. Useful for daily updates.

**Headers:**

```
Authorization: Bearer YOUR_CRON_SECRET
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/cronjob/flight_schedule \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Database Cleanup

**Endpoint:** `POST /api/cronjob/cleanup_db`

**Description:** Cleans up old data from the database (e.g., expired bookings, old logs).

**Headers:**

```
Authorization: Bearer YOUR_CRON_SECRET
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/cronjob/cleanup_db \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## 🛫 Flight Search Endpoints

### Get Available Flight Date Range

**Endpoint:** `GET /api/flights/available_flight_date_range`

**Description:** Returns the available date range for flight searches.

**Example:**

```bash
curl http://localhost:3000/api/flights/available_flight_date_range
```

**Response:**

```json
{
  "success": true,
  "message": "Available flight date range fetched successfully",
  "data": {
    "from": 1672531200000, // time in milliseconds
    "to": 1844674400000 // time in milliseconds
  }
}
```

### Get Available Airports

**Endpoint:** `GET /api/flights/available_airports`

**Description:** Returns a list of available airports for flight searches.

**Query Parameters:**

- `searchQuery` (optional): Search term for airport name or code

**Example:**

```bash
curl "http://localhost:3000/api/flights/available_airports?searchQuery=dxb"
```

**Response:**

```json
{
  "success": true,
  "message": "Available airports fetched successfully",
  "data": [
    {
      "iataCode": "DXB",
      "name": "Dubai International Airport",
      "city": "Dubai"
    }
  ]
}
```

## 🏨 Hotel Search Endpoints

### Get Available Places

**Endpoint:** `GET /api/hotels/available_places`

**Description:** Returns a list of available destinations for hotel searches.

**Query Parameters:**

- `searchQuery` (optional): Search term for destination name

**Example:**

```bash
curl "http://localhost:3000/api/hotels/available_places?searchQuery=paris"
```

**Response:**

```json
{
  "success": true,
  "message": "Available places fetched successfully",
  "data": [
    {
      "city": "Paris",
      "country": "France",
      "type": "place"
    }
  ]
}
```

## 💳 Payment Endpoints

### Create Flight Booking Payment Intent

**Endpoint:** `POST /api/stripe/create_flight_booking_payment_intent`

**Description:** Creates a Stripe payment intent for flight bookings. Locked for unauthenticated users.

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "flightNumber": "123",
  "flightDateTimestamp": 1693024000000 // time in milliseconds
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "paymentIntents": {
      // Stripe payment intent object
      "id": "payment_intent_id_here",
      "client_secret": "client_secret_here"
      //...
    },
    "paymentStatus": "pending"
  }
}
```

### Create Hotel Booking Payment Intent

**Endpoint:** `POST /api/stripe/create_hotel_booking_payment_intent`

**Description:** Creates a Stripe payment intent for hotel bookings. Locked for unauthenticated users.

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "checkInDate": "2023-09-01",
  "checkOutDate": "2023-09-05",
  "slug": "hotel-slug-here"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "paymentIntents": {
      // Stripe payment intent object
      "id": "payment_intent_id_here",
      "client_secret": "client_secret_here"
      //...
    },
    "paymentStatus": "succeeded"
  }
}
```

### Stripe Webhook

**Endpoint:** `POST /api/stripe/webhook`

**Description:** Handles Stripe webhook events for payment status updates.

**Headers:**

```

Content-Type: application/json
Stripe-Signature: stripe_signature_here

```

## 👤 User Management Endpoints

### Get User Profile

**Endpoint:** `GET /api/user/{userId}`

**Description:** Returns user profile information.

**Example:**

```bash
curl http://localhost:3000/api/user/user_id_here
```

**Response:**

```json
{
  "name": "John Doe",
  "profileImage": "https://example.com/profile.jpg"
}
```

### Get User Payment Cards

**Endpoint:** `GET /api/user/get_payment_cards`

**Description:** Returns the user's saved payment methods. Locked for unauthenticated users.

**Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": "card_id_here",
      "cardType": "Visa",
      "last4Digits": "1234",
      "validTill": "08/25"
    }
  ]
}
```

### Get Reserved Flight

**Endpoint:** `POST /api/user/get_reserved_flight`

**Description:** Returns details of a reserved flight booking. Locked for unauthenticated users.

**Body:**

```json
{
  "flightNumber": "123",
  "flightDateTimestamp": 1693024000000 // time in milliseconds
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    // Flight booking details
  }
}
```

### Get Reserved Hotel

**Endpoint:** `POST /api/user/get_reserved_hotel`

**Description:** Returns details of a reserved hotel booking. Locked for unauthenticated users.

**Body:**

```json
{
  "checkInDate": "2023-09-01",
  "checkOutDate": "2023-09-05",
  "slug": "hotel-slug-here"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Reserved hotel booking found",
  "data": {
    // Hotel booking details
  }
}
```

## 📧 Email Endpoints

### Confirm Email

**Endpoint:** `GET /api/confirm_email`

**Description:** Confirms a user's email address using a verification token.

**Query Parameters:**

- `token`: Email verification token

**Example:**

```bash
curl "http://localhost:3000/api/confirm_email?token=verification_token_here"
```

## 🔧 Setup Endpoints

### Stripe Setup Intent

**Endpoint:** `POST /api/stripe/setup_intent`

**Description:** Creates a Stripe setup intent for saving payment methods. Locked for unauthenticated users.

**Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "clientSecret": "client_secret_here",
    "customerId": "customer_id_here",
    "idempotencyKey": "idempotency_key_here"
  }
}
```

## 📝 Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": {} // (optional)
}
```

Common HTTP status codes:

- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## 🧪 Testing API Endpoints

### Using curl

```bash
# Test flight data generation
curl -X POST http://localhost:3000/api/generate/flights/upload_db \
  -H "Authorization: Bearer YOUR_API_SECRET_TOKEN" \
  -H "Content-Type: application/json"

# Test hotel search
curl "http://localhost:3000/api/hotels/available_places?search=paris"

# Test flight search
curl "http://localhost:3000/api/flights/available_airports?search=jfk"
```

### Using Postman

1. Import the endpoints into Postman
2. Set up environment variables for base URL and tokens
3. Use the collection to test all endpoints

### Using JavaScript/Fetch

```javascript
// Generate flight data
const response = await fetch("/api/generate/flights/upload_db", {
  method: "POST",
  headers: {
    Authorization: "Bearer YOUR_API_SECRET_TOKEN",
    "Content-Type": "application/json",
  },
});

const data = await response.json();
console.log(data);
```

## 🔒 Security Notes

1. **API Secret Token**: Keep your `API_SECRET_TOKEN` secure and never expose it in client-side code
2. **Cron Secret**: Use a different secret for cron job authentication
3. **Rate Limiting**: Consider implementing rate limiting for production use
4. **CORS**: Configure CORS properly for cross-origin requests
5. **Input Validation**: Always validate and sanitize input data

## 📚 Additional Resources

- [Next.js API Routes Documentation](https://nextjs.org/docs/api-routes/introduction)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [MongoDB Node.js Driver](https://docs.mongodb.com/drivers/node/)
- [NextAuth.js API Reference](https://next-auth.js.org/configuration/pages)

---

For more information about setting up and using the application, see the [Getting Started Guide](GETTING_STARTED.md).
