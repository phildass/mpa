// Trial Enforcement Module for MPA
// This module enforces the 1-hour free trial period and payment requirement

class TrialEnforcer {
    constructor() {
        this.appId = 'mpa';
        this.trialDurationHours = 1;
        this.checkInterval = 60000; // Check every minute
        this.intervalId = null;
    }

    // Initialize trial enforcement
    init() {
        console.log('Initializing trial enforcement...');
        
        // Check trial status immediately
        const canAccess = this.checkTrialStatus();
        
        if (!canAccess) {
            this.blockAccess();
            return false;
        }

        // Start periodic checking
        this.startPeriodicCheck();
        return true;
    }

    // Check if user can access the app
    checkTrialStatus() {
        const installData = this.getInstallData();

        // If no install data, allow access (development mode or direct access)
        if (!installData) {
            console.log('No install data found - allowing access (development mode)');
            return true;
        }

        // If paid, allow access
        if (installData.paid) {
            console.log('User has paid - allowing access');
            return true;
        }

        // Check trial period
        const now = new Date();
        const trialExpiry = new Date(installData.trialExpiresAt);

        if (now < trialExpiry) {
            const remainingMinutes = Math.floor((trialExpiry - now) / (1000 * 60));
            console.log(`Trial active - ${remainingMinutes} minutes remaining`);
            this.showTrialReminder(remainingMinutes);
            return true;
        }

        // Trial expired
        console.log('Trial expired - blocking access');
        return false;
    }

    // Get installation data from localStorage
    getInstallData() {
        const key = `iiskills_cloud_app_${this.appId}_install`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    // Show trial reminder (non-intrusive)
    showTrialReminder(remainingMinutes) {
        // Only show reminder when 15, 10, 5, or 1 minute remaining
        if ([15, 10, 5, 1].includes(remainingMinutes)) {
            const message = `⏰ Trial Notice: ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} remaining in your free trial.`;
            this.showNotification(message);
        }
    }

    // Show notification to user
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #667eea;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            font-size: 14px;
            max-width: 350px;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transition = 'opacity 0.3s';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Start periodic trial checking
    startPeriodicCheck() {
        this.intervalId = setInterval(() => {
            const canAccess = this.checkTrialStatus();
            if (!canAccess) {
                this.stopPeriodicCheck();
                this.blockAccess();
            }
        }, this.checkInterval);
    }

    // Stop periodic checking
    stopPeriodicCheck() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    // Block access and show payment prompt
    blockAccess() {
        // Stop periodic checking
        this.stopPeriodicCheck();

        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'trialExpiredOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 99999;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        // Create modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            padding: 50px;
            border-radius: 15px;
            text-align: center;
            max-width: 500px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        `;

        modal.innerHTML = `
            <div style="font-size: 80px; margin-bottom: 20px;">⏰</div>
            <h1 style="color: #333; margin-bottom: 20px; font-size: 32px;">Trial Expired</h1>
            <p style="color: #666; margin-bottom: 30px; font-size: 18px; line-height: 1.6;">
                Your 1-hour free trial has ended.<br>
                To continue using MPA, please complete the payment.
            </p>
            <div style="background: #f5f5f5; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
                <div style="font-size: 16px; color: #666; margin-bottom: 10px;">One-time Payment</div>
                <div style="font-size: 42px; font-weight: bold; color: #333; margin-bottom: 5px;">₹116.82</div>
                <div style="font-size: 14px; color: #999;">Rs 99 + GST 18%</div>
            </div>
            <button id="payNowBtn" style="
                padding: 15px 40px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                margin-right: 10px;
            ">Pay Now</button>
            <button id="returnBtn" style="
                padding: 15px 40px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
            ">Return to Landing</button>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Add event listeners
        document.getElementById('payNowBtn').addEventListener('click', () => {
            this.redirectToPayment();
        });

        document.getElementById('returnBtn').addEventListener('click', () => {
            window.location.href = '/iiskills-cloud/landing.html';
        });
    }

    // Redirect to payment gateway
    redirectToPayment() {
        const currentUser = JSON.parse(localStorage.getItem('iiskills_cloud_current_user') || '{}');
        
        const paymentUrl = new URL('https://aienter.in/payments');
        paymentUrl.searchParams.append('product_code', 'MPA_APP_001');
        paymentUrl.searchParams.append('amount', '116.82');
        paymentUrl.searchParams.append('currency', 'INR');
        paymentUrl.searchParams.append('user_email', currentUser.email || 'unknown');
        paymentUrl.searchParams.append('return_url', window.location.origin + '/iiskills-cloud/payment-callback.html');
        
        window.location.href = paymentUrl.toString();
    }

    // Get remaining trial time in minutes
    getRemainingTrialTime() {
        const installData = this.getInstallData();
        if (!installData || installData.paid) {
            return null;
        }

        const now = new Date();
        const trialExpiry = new Date(installData.trialExpiresAt);
        const remainingMs = trialExpiry - now;

        if (remainingMs <= 0) {
            return 0;
        }

        return Math.floor(remainingMs / (1000 * 60));
    }
}

// Auto-initialize when script loads
const trialEnforcer = new TrialEnforcer();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TrialEnforcer;
}
