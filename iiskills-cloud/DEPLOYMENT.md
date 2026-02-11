# Deployment Guide for MPA on iiskills-cloud

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Production server with HTTPS
- Access to aienter.in payment gateway

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Access the App
- Main app: http://localhost:3000
- Landing page: http://localhost:3000/iiskills-cloud
- App registry: http://localhost:3000/iiskills-cloud/apps/registry

## Production Deployment

### Step 1: Environment Configuration

Create a `.env` file (not included in repo):

```env
PORT=3000
NODE_ENV=production
PAYMENT_GATEWAY_URL=https://aienter.in/payments
PAYMENT_PRODUCT_CODE=MPA_APP_001
APP_BASE_URL=https://yourdomain.com
```

### Step 2: Update Configuration Files

Update `iiskills-cloud/landing.js` with production URLs:
```javascript
const APP_CONFIG = {
    appId: 'mpa',
    appName: 'MPA - My Personal Assistant',
    trialDurationHours: 1,
    pricing: {
        basePrice: 99,
        gstRate: 18,
        totalPrice: 116.82,
        currency: 'INR'
    },
    payment: {
        gatewayUrl: process.env.PAYMENT_GATEWAY_URL || 'https://aienter.in/payments',
        productCode: process.env.PAYMENT_PRODUCT_CODE || 'MPA_APP_001'
    }
};
```

### Step 3: Build and Deploy

```bash
# Install production dependencies only
npm install --production

# Start the application
npm start
```

### Step 4: Process Manager (PM2)

For production, use PM2 to manage the application:

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start server.js --name "mpa-app"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Step 5: Reverse Proxy (Nginx)

Configure Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # SSL configuration
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Step 6: SSL Certificate

Install SSL certificate using Let's Encrypt:

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal is setup automatically
# Test renewal
sudo certbot renew --dry-run
```

## Payment Gateway Integration

### Configure aienter.in

1. Contact aienter.in to setup merchant account
2. Obtain API credentials
3. Register callback URL: `https://yourdomain.com/iiskills-cloud/payment-callback.html`
4. Test payment flow in sandbox mode
5. Switch to production mode

### Payment Flow Verification

The payment gateway should return to the callback URL with these parameters:

**Success:**
```
https://yourdomain.com/iiskills-cloud/payment-callback.html?
  status=success&
  transaction_id=TXN123456789&
  product_code=MPA_APP_001&
  amount=116.82
```

**Failed:**
```
https://yourdomain.com/iiskills-cloud/payment-callback.html?
  status=failed&
  error=payment_declined
```

**Cancelled:**
```
https://yourdomain.com/iiskills-cloud/payment-callback.html?
  status=cancelled
```

## Monitoring

### Application Logs

```bash
# View PM2 logs
pm2 logs mpa-app

# View specific log file
pm2 logs mpa-app --lines 100
```

### Health Check Endpoint

Add a health check endpoint to `server.js`:

```javascript
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString() 
    });
});
```

## Backup and Recovery

### Database Backup (Future)

When implementing server-side database:

```bash
# Backup MongoDB
mongodump --db mpa_db --out /backup/mpa_backup_$(date +%Y%m%d)

# Backup PostgreSQL
pg_dump mpa_db > /backup/mpa_backup_$(date +%Y%m%d).sql
```

### Application Backup

```bash
# Backup application files
tar -czf mpa_backup_$(date +%Y%m%d).tar.gz /path/to/mpa

# Backup to remote server
rsync -avz /path/to/mpa user@backup-server:/backups/
```

## Scaling Considerations

### Horizontal Scaling

Use Nginx load balancer with multiple app instances:

```nginx
upstream mpa_backend {
    least_conn;
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
}

server {
    location / {
        proxy_pass http://mpa_backend;
    }
}
```

Start multiple instances:
```bash
PORT=3000 pm2 start server.js --name "mpa-app-1"
PORT=3001 pm2 start server.js --name "mpa-app-2"
PORT=3002 pm2 start server.js --name "mpa-app-3"
```

## Security Checklist

- [ ] HTTPS enabled with valid SSL certificate
- [ ] Environment variables for sensitive data
- [ ] Rate limiting implemented
- [ ] CORS configured properly
- [ ] Input validation on all forms
- [ ] SQL injection prevention
- [ ] XSS protection headers
- [ ] CSRF protection
- [ ] Regular security updates
- [ ] Firewall rules configured
- [ ] Server hardening completed

## Troubleshooting

### Issue: App not starting
```bash
# Check if port is in use
lsof -i :3000

# Check PM2 status
pm2 status

# Check application logs
pm2 logs mpa-app --lines 50
```

### Issue: Payment callback not working
- Verify callback URL is registered with payment gateway
- Check HTTPS is working
- Verify URL parameters are being received
- Check browser console for errors

### Issue: Trial enforcement not working
- Check localStorage is enabled in browser
- Verify `trial-enforcer.js` is loaded
- Check browser console for errors
- Verify installation timestamp is set correctly

## Maintenance

### Regular Updates

```bash
# Update npm packages
npm update

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Monitoring Tasks

- Monitor server resources (CPU, RAM, Disk)
- Check application logs daily
- Review payment transactions
- Monitor error rates
- Check SSL certificate expiry

## Support and Contacts

- **Technical Support**: tech@iiskills.com
- **Payment Issues**: payments@aienter.in
- **Repository**: https://github.com/phildass/mpa
- **Documentation**: /iiskills-cloud/README.md

## Deployment Checklist

Before going live:

- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Payment gateway configured and tested
- [ ] Nginx reverse proxy setup
- [ ] PM2 process manager configured
- [ ] Firewall rules applied
- [ ] Health check endpoint working
- [ ] Monitoring setup
- [ ] Backup system configured
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Error logging working
- [ ] Landing page tested
- [ ] Sign in/Register working
- [ ] Download flow tested
- [ ] Trial enforcement verified
- [ ] Payment flow tested end-to-end
- [ ] Mobile responsiveness checked
- [ ] Cross-browser testing completed

## Post-Deployment

1. Monitor logs for first 24 hours
2. Test all critical paths
3. Verify payment transactions
4. Check trial enforcement
5. Monitor server resources
6. Setup alerts for downtime
7. Document any issues
8. Create runbook for common issues
