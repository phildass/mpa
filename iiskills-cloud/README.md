# iiskills-cloud Integration for MPA

This directory contains the integration files for adding MPA to the iiskills-cloud app marketplace.

## Overview

MPA (My Personal Assistant) is now available as a paid app on iiskills-cloud with the following features:

- **Pricing**: Rs 99 + GST 18% = Rs 116.82
- **Trial Period**: 1 hour free access after download
- **Payment Gateway**: Integration with https://aienter.in/payments
- **Branding**: iiskills and AI Cloud Enterprises logos only

## Directory Structure

```
iiskills-cloud/
├── apps/
│   └── registry.json          # App registry with MPA entry
├── landing.html               # Landing page with Sign in/Register
├── landing.js                 # Landing page logic
├── payment-callback.html      # Payment verification page
├── trial-enforcer.js          # Trial enforcement module
└── README.md                  # This file
```

## Files Description

### 1. apps/registry.json
App registry containing MPA metadata, pricing, trial configuration, and payment details.

**Key Configuration**:
- Product code: `MPA_APP_001`
- Base price: Rs 99
- GST: 18%
- Total: Rs 116.82
- Trial duration: 1 hour
- Payment gateway: https://aienter.in/payments

### 2. landing.html
Landing page featuring:
- iiskills and AI Cloud Enterprises branding
- Sign In and Register functionality
- Download app button
- Pricing information
- Feature highlights
- 1-hour free trial badge

### 3. landing.js
JavaScript logic for:
- User authentication (Sign in/Register)
- Download functionality
- Trial tracking
- Payment redirection
- Local storage management

### 4. payment-callback.html
Payment verification page that:
- Processes payment gateway callbacks
- Updates user access status
- Displays transaction details
- Redirects to app after successful payment

### 5. trial-enforcer.js
Trial enforcement module that:
- Tracks installation time
- Monitors trial period (1 hour)
- Shows trial reminders
- Blocks access after trial expiry
- Prompts for payment

## How It Works

### 1. User Registration/Sign In
- Users must register or sign in before downloading
- Credentials stored in `localStorage` (iiskills_cloud_users)
- Current session tracked in `localStorage` (iiskills_cloud_current_user)

### 2. Download and Trial
- On download, installation timestamp is recorded
- Trial expires 1 hour after installation
- Trial data stored in `localStorage` (iiskills_cloud_app_mpa_install)

### 3. Trial Enforcement
- `trial-enforcer.js` checks trial status on app load
- Periodic checks every minute during app usage
- Non-intrusive reminders at 15, 10, 5, and 1 minute remaining
- Access blocked when trial expires

### 4. Payment Flow
1. Trial expires → Payment prompt shown
2. User clicks "Pay Now" → Redirected to aienter.in/payments
3. Payment parameters include:
   - Product code: MPA_APP_001
   - Amount: 116.82 INR
   - User email
   - Return URL: payment-callback.html
4. After payment → Callback page verifies and updates access
5. User can now use app without restrictions

## Usage

### Accessing the Landing Page

```bash
# Start the server
npm start

# Open browser to
http://localhost:3000/iiskills-cloud
```

### Testing the Flow

1. **Register**: Create a new account
2. **Sign In**: Log in with your credentials
3. **Download**: Click "Download App" button
4. **Trial**: Use the app for free for 1 hour
5. **Payment**: After trial, payment prompt appears
6. **Full Access**: Complete payment for unlimited access

## API Endpoints

- `GET /iiskills-cloud` - Landing page
- `GET /iiskills-cloud/landing.html` - Landing page (explicit)
- `GET /iiskills-cloud/apps/registry` - App registry JSON
- `GET /iiskills-cloud/download` - Download endpoint

## LocalStorage Keys

- `iiskills_cloud_users` - Registered users database
- `iiskills_cloud_current_user` - Current session user
- `iiskills_cloud_app_mpa_install` - Installation and trial data

## Deployment Considerations

### Environment Variables
```bash
PORT=3000                    # Server port
NODE_ENV=production          # Environment
```

### Production Setup
1. Use HTTPS for security
2. Implement proper database instead of localStorage
3. Add server-side session management
4. Integrate real payment gateway callbacks
5. Add rate limiting and security measures
6. Use environment variables for sensitive data

### Payment Gateway Integration
The payment URL is constructed as:
```
https://aienter.in/payments?
  product_code=MPA_APP_001&
  amount=116.82&
  currency=INR&
  user_email=user@example.com&
  return_url=https://yourdomain.com/iiskills-cloud/payment-callback.html
```

Expected callback parameters:
- `status` - success/cancelled/failed
- `transaction_id` - Payment transaction ID
- `product_code` - MPA_APP_001
- `amount` - 116.82

## Security Notes

- For production, replace localStorage with secure backend
- Implement proper authentication (JWT, OAuth, etc.)
- Use HTTPS for all communications
- Validate payment callbacks server-side
- Add CSRF protection
- Implement rate limiting

## Future Enhancements

- Server-side trial validation
- Payment webhook verification
- Email notifications
- Invoice generation
- Subscription management
- Admin dashboard

## Support

For issues or questions:
- Repository: phildass/mpa
- App ID: mpa
- Product Code: MPA_APP_001
