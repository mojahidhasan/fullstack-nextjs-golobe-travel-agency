# Troubleshooting Guide - Golobe Travel Agency

Quick solutions to common issues you might encounter while setting up and running the Golobe Travel Agency project.

## 🚨 Common Issues & Solutions

### 1. Environment Variables Issues

#### Problem: "MONGODB_URI not found in .env file"

**Solution:**

- Ensure you have a `.env.local` file in the project root
- Run the setup script: `npm run setup`
- Or manually create the file with required variables

#### Problem: "AUTH_SECRET is required"

**Solution:**

- Add `AUTH_SECRET` to your `.env.local` file
- Generate a random string: `openssl rand -base64 32`

#### Problem: "Stripe secret key is missing"

**Solution:**

- Get your Stripe keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- Add them to `.env.local`:
  ```env
  STRIPE_SECRET_KEY=sk_test_your_key_here
  NEXT_PUBLIC_STRIPE_PK=pk_test_your_key_here
  ```

### 2. Database Connection Issues

#### Problem: "MongoDB connection failed"

**Solutions:**

- **Local MongoDB**: Start the service

  ```bash
  # Windows
  net start MongoDB

  # macOS
  brew services start mongodb-community

  # Linux
  sudo systemctl start mongod
  ```

- **MongoDB Atlas**: Check your connection string and network access
- Verify the connection string format in `.env.local`

#### Problem: "Database not found"

**Solution:**

- The database will be created automatically when you first run the app
- Generate sample data using the API endpoints

### 3. Port Already in Use

#### Problem: "listen EADDRINUSE: address already in use :::3000"

**Solutions:**

```bash
# Kill process on port 3000
npx kill-port 3000

# Or find and kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### 4. Node Modules Issues

#### Problem: "Cannot find module"

**Solutions:**

```bash
# Clear and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Or use npm cache clean
npm cache clean --force
npm install
```

#### Problem: "Module not found" errors

**Solution:**

- Ensure you're using Node.js 18 or higher
- Check if all dependencies are installed: `npm list`

### 5. Build Issues

#### Problem: "Build failed"

**Solutions:**

- Check for syntax errors in your code
- Ensure all environment variables are set
- Try clearing Next.js cache:
  ```bash
  rm -rf .next
  npm run build
  ```

#### Problem: "ESLint errors"

**Solution:**

```bash
# Fix auto-fixable issues
npm run lint -- --fix

# Or check specific files
npm run lint -- components/YourComponent.js
```

### 6. API Endpoint Issues

#### Problem: "401 Unauthorized" on data generation endpoints

**Solution:**

- Check your `API_SECRET_TOKEN` in `.env.local`
- Ensure you're using the correct token in the Authorization header
- Generate a new token if needed

#### Problem: "404 Not Found" on API endpoints

**Solution:**

- Ensure the development server is running: `npm run dev`
- Check the endpoint URL is correct
- Verify the API route exists in `app/api/`

### 7. Payment Issues

#### Problem: "Stripe payment failed"

**Solutions:**

- Use test card numbers for development
- Check Stripe keys are correct
- Verify webhook endpoint is configured
- Check Stripe dashboard for error details

#### Problem: "Payment intent creation failed"

**Solution:**

- Ensure `STRIPE_SECRET_KEY` is set correctly
- Check the amount format (should be in cents)
- Verify the booking ID exists

### 8. Email Issues

#### Problem: "Email sending failed"

**Solutions:**

- Check Mailjet credentials in `.env.local`
- Verify sender email is verified in Mailjet
- Check Mailjet dashboard for error logs

#### Problem: "Email not received"

**Solution:**

- Check spam folder
- Verify email address is correct
- Check Mailjet sending logs

### 9. Authentication Issues

#### Problem: "NextAuth configuration error"

**Solution:**

- Ensure `AUTH_SECRET` is set
- Verify MongoDB connection for session storage

#### Problem: "Login not working"

**Solution:**

- Check if user exists in database
- Verify email/password combination
- Check browser console for errors

### 10. Performance Issues

#### Problem: "Slow development server"

**Solutions:**

- Use Node.js 18+ for better performance
- Try Turbo mode: `npm run dev --turbo`
- Check for large dependencies
- Use production build for testing: `npm run build && npm start`

#### Problem: "Large bundle size"

**Solution:**

- Check for unused dependencies
- Use dynamic imports for large components
- Analyze bundle: `npm run build` and check the output

## 🔧 Development Tools

### Useful Commands

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check MongoDB status
mongosh --eval "db.runCommand('ping')"

# Check environment variables
node -e "console.log(process.env.NODE_ENV)"

# Clear all caches
npm cache clean --force
rm -rf .next node_modules package-lock.json
npm install
```

### Debug Mode

```bash
# Run with debug logging
DEBUG=* npm run dev

# Run specific debug
DEBUG=next:* npm run dev
```

### Database Debugging

```bash
# Connect to MongoDB
mongosh

# Check collections
show collections

# Check documents
db.flights.find().limit(5)
db.hotels.find().limit(5)
```

## 🐛 Common Error Messages

| Error Message               | Likely Cause                     | Solution                           |
| --------------------------- | -------------------------------- | ---------------------------------- |
| `MONGODB_URI not found`     | Missing environment variable     | Add to `.env.local`                |
| `AUTH_SECRET is required`   | Missing auth secret              | Generate and add to `.env.local`   |
| `Cannot find module`        | Missing dependency               | Run `npm install`                  |
| `Port 3000 already in use`  | Another process using port       | Kill process or use different port |
| `401 Unauthorized`          | Invalid API token                | Check `API_SECRET_TOKEN`           |
| `500 Internal Server Error` | Server-side error                | Check server logs                  |
| `Build failed`              | Syntax error or missing env vars | Check code and environment         |

## 📞 Getting Help

### Before Asking for Help

1. **Check this troubleshooting guide**
2. **Search existing issues** on GitHub
3. **Check the logs** for specific error messages
4. **Verify your setup** matches the requirements

### When Reporting Issues

Include the following information:

```markdown
**Environment:**

- OS: [Windows/macOS/Linux]
- Node.js version: [version]
- npm version: [version]
- MongoDB version: [version]

**Error:**

- Error message: [paste the exact error]
- Steps to reproduce: [detailed steps]
- Expected behavior: [what should happen]
- Actual behavior: [what actually happens]

**Additional Info:**

- Environment variables configured: [yes/no]
- Sample data generated: [yes/no]
- Browser console errors: [if any]
```

### Support Channels

1. **GitHub Issues**: Create a new issue with detailed information
2. **Documentation**: Check [Getting Started Guide](GETTING_STARTED.md)
3. **API Documentation**: See [API Documentation](API_DOCUMENTATION.md)

## 🔄 Reset Everything

If you're completely stuck, here's how to start fresh:

```bash
# 1. Stop all processes
npx kill-port 3000

# 2. Clear everything
rm -rf .next node_modules package-lock.json .env.local

# 3. Reinstall
npm install

# 4. Run setup
npm run setup

# 5. Start development
npm run dev

# 6. Generate sample data
curl -X POST http://localhost:3000/api/generate/flights/upload_db -H "Authorization: Bearer YOUR_API_SECRET_TOKEN"
curl -X POST http://localhost:3000/api/generate/hotels/upload_db -H "Authorization: Bearer YOUR_API_SECRET_TOKEN"
curl -X POST http://localhost:3000/api/generate/website_config -H "Authorization: Bearer YOUR_API_SECRET_TOKEN"
```

---

**Still having issues?** Check the [Getting Started Guide](GETTING_STARTED.md) for more detailed information or create a GitHub issue with your specific problem.
