// Landing page JavaScript for MPA app on iiskills-cloud

// Configuration
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
        gatewayUrl: 'https://aienter.in/payments',
        productCode: 'MPA_APP_001'
    }
};

// Modal functions
function openSignInModal() {
    document.getElementById('signinModal').classList.add('active');
}

function closeSignInModal() {
    document.getElementById('signinModal').classList.remove('active');
    clearSignInForm();
}

function openRegisterModal() {
    document.getElementById('registerModal').classList.add('active');
}

function closeRegisterModal() {
    document.getElementById('registerModal').classList.remove('active');
    clearRegisterForm();
}

function clearSignInForm() {
    document.getElementById('signinEmail').value = '';
    document.getElementById('signinPassword').value = '';
    document.getElementById('signinError').style.display = 'none';
    document.getElementById('signinSuccess').style.display = 'none';
}

function clearRegisterForm() {
    document.getElementById('registerName').value = '';
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPassword').value = '';
    document.getElementById('registerError').style.display = 'none';
    document.getElementById('registerSuccess').style.display = 'none';
}

// Authentication functions
function handleSignIn(event) {
    event.preventDefault();
    
    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;
    
    // Validate input
    if (!email || !password) {
        showError('signinError', 'Please enter both email and password');
        return;
    }
    
    // Get stored users
    const users = JSON.parse(localStorage.getItem('iiskills_cloud_users') || '{}');
    
    // Check if user exists and password matches
    if (users[email] && users[email].password === password) {
        // Store current session
        localStorage.setItem('iiskills_cloud_current_user', JSON.stringify({
            email: email,
            name: users[email].name,
            signedInAt: new Date().toISOString()
        }));
        
        showSuccess('signinSuccess', 'Signed in successfully!');
        
        setTimeout(() => {
            closeSignInModal();
        }, 1500);
    } else {
        showError('signinError', 'Invalid email or password');
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    // Validate input
    if (!name || !email || !password) {
        showError('registerError', 'Please fill in all fields');
        return;
    }
    
    if (password.length < 6) {
        showError('registerError', 'Password must be at least 6 characters');
        return;
    }
    
    // Get stored users
    const users = JSON.parse(localStorage.getItem('iiskills_cloud_users') || '{}');
    
    // Check if user already exists
    if (users[email]) {
        showError('registerError', 'User already exists. Please sign in.');
        return;
    }
    
    // Register new user
    users[email] = {
        name: name,
        password: password,
        registeredAt: new Date().toISOString()
    };
    
    localStorage.setItem('iiskills_cloud_users', JSON.stringify(users));
    
    showSuccess('registerSuccess', 'Registration successful! Please sign in.');
    
    setTimeout(() => {
        closeRegisterModal();
        openSignInModal();
    }, 1500);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function showSuccess(elementId, message) {
    const successElement = document.getElementById(elementId);
    successElement.textContent = message;
    successElement.style.display = 'block';
}

// Download and trial enforcement
function handleDownload() {
    // Check if user is signed in
    const currentUser = JSON.parse(localStorage.getItem('iiskills_cloud_current_user') || 'null');
    
    if (!currentUser) {
        alert('Please sign in or register to download the app');
        openSignInModal();
        return;
    }
    
    // Check if app is already installed
    const appInstallKey = `iiskills_cloud_app_${APP_CONFIG.appId}_install`;
    const installData = JSON.parse(localStorage.getItem(appInstallKey) || 'null');
    
    if (installData) {
        // App already installed, check trial and payment status
        checkTrialAndAccess(installData);
    } else {
        // New installation
        initiateDownload();
    }
}

function initiateDownload() {
    // Record installation time
    const installData = {
        installedAt: new Date().toISOString(),
        installedBy: JSON.parse(localStorage.getItem('iiskills_cloud_current_user')).email,
        trialExpiresAt: new Date(Date.now() + APP_CONFIG.trialDurationHours * 60 * 60 * 1000).toISOString(),
        paid: false
    };
    
    localStorage.setItem(`iiskills_cloud_app_${APP_CONFIG.appId}_install`, JSON.stringify(installData));
    
    // Simulate download
    alert(`🎉 Download started!\n\nYou have ${APP_CONFIG.trialDurationHours} hour of free trial access.\n\nAfter the trial, you'll need to pay ₹${APP_CONFIG.pricing.totalPrice} to continue using the app.`);
    
    // In a real scenario, this would trigger actual download
    // For demo purposes, redirect to the main app
    setTimeout(() => {
        window.location.href = '/index.html';
    }, 2000);
}

function checkTrialAndAccess(installData) {
    const now = new Date();
    const trialExpiry = new Date(installData.trialExpiresAt);
    
    if (installData.paid) {
        // User has paid, grant access
        alert('✅ You have full access to the app!');
        window.location.href = '/index.html';
    } else if (now < trialExpiry) {
        // Trial still active
        const remainingMinutes = Math.floor((trialExpiry - now) / (1000 * 60));
        alert(`⏰ Your free trial is active!\n\nRemaining time: ${remainingMinutes} minutes\n\nAccessing app...`);
        window.location.href = '/index.html';
    } else {
        // Trial expired, prompt for payment
        showPaymentPrompt();
    }
}

function showPaymentPrompt() {
    const proceed = confirm(
        `⚠️ Your free trial has expired!\n\n` +
        `To continue using ${APP_CONFIG.appName}, please complete the payment:\n\n` +
        `Price: ₹${APP_CONFIG.pricing.totalPrice}\n` +
        `(Rs ${APP_CONFIG.pricing.basePrice} + GST ${APP_CONFIG.pricing.gstRate}%)\n\n` +
        `Click OK to proceed to payment`
    );
    
    if (proceed) {
        redirectToPayment();
    }
}

function redirectToPayment() {
    const currentUser = JSON.parse(localStorage.getItem('iiskills_cloud_current_user'));
    
    // Build payment URL with parameters
    const paymentUrl = new URL(APP_CONFIG.payment.gatewayUrl);
    paymentUrl.searchParams.append('product_code', APP_CONFIG.payment.productCode);
    paymentUrl.searchParams.append('amount', APP_CONFIG.pricing.totalPrice);
    paymentUrl.searchParams.append('currency', APP_CONFIG.pricing.currency);
    paymentUrl.searchParams.append('user_email', currentUser.email);
    paymentUrl.searchParams.append('return_url', window.location.origin + '/iiskills-cloud/payment-callback.html');
    
    // Redirect to payment gateway
    window.location.href = paymentUrl.toString();
}

// Check trial status on app launch (to be called from main app)
function enforceTrialRestriction() {
    const appInstallKey = `iiskills_cloud_app_${APP_CONFIG.appId}_install`;
    const installData = JSON.parse(localStorage.getItem(appInstallKey) || 'null');
    
    if (!installData) {
        // Not installed through iiskills-cloud, allow access (for development)
        return true;
    }
    
    const now = new Date();
    const trialExpiry = new Date(installData.trialExpiresAt);
    
    if (installData.paid) {
        // User has paid
        return true;
    } else if (now < trialExpiry) {
        // Trial still active
        return true;
    } else {
        // Trial expired, block access
        return false;
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        enforceTrialRestriction,
        APP_CONFIG
    };
}
