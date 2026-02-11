/**
 * MPA App - Frontend Logic
 */

// Initialize MPA instance
const mpa = new MPA();

// Get DOM elements
const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const quickBtns = document.querySelectorAll('.quick-btn');

// User management
let currentUser = localStorage.getItem('mpa_registered_user');
if (currentUser) {
    mpa.setRegisteredUser(currentUser);
}

// Store active reminders
let activeReminders = [];

/**
 * Add message to chat
 */
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = isUser ? 'user-message' : 'ai-message';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    chatContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

/**
 * Add action notification
 */
function addActionNotification(text, link = null) {
    const notificationDiv = document.createElement('div');
    notificationDiv.className = 'action-notification';
    notificationDiv.textContent = `✓ ${text}`;
    
    if (link) {
        const linkElement = document.createElement('a');
        linkElement.href = link;
        linkElement.className = 'whatsapp-link';
        linkElement.textContent = '📱 Open WhatsApp';
        linkElement.target = '_blank';
        notificationDiv.appendChild(document.createElement('br'));
        notificationDiv.appendChild(linkElement);
    }
    
    chatContainer.appendChild(notificationDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

/**
 * Handle user message
 */
function handleUserMessage() {
    const message = userInput.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessage(message, true);
    
    // Clear input
    userInput.value = '';
    
    // Process message with MPA (pass current user for authentication)
    const response = mpa.processMessage(message, currentUser);
    
    // Parse action codes
    const actions = mpa.parseActionCodes(response);
    
    // Clean response for display
    const cleanedResponse = mpa.cleanResponse(response);
    
    // Add AI response to chat
    addMessage(cleanedResponse, false);
    
    // Execute actions
    actions.forEach(action => {
        if (action.type === 'SET_REMINDER') {
            setReminder(action.datetime, message);
            addActionNotification(action.text);
        } else if (action.type === 'WHATSAPP_LINK') {
            addActionNotification(`WhatsApp message ready for ${action.phone}`, action.link);
        }
    });
}

/**
 * Set a reminder (browser notification)
 */
function setReminder(datetime, task) {
    const reminderTime = new Date(datetime);
    const now = new Date();
    const delay = reminderTime - now;
    
    if (delay > 0) {
        // Request notification permission if needed
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
        
        // Set timeout for reminder
        const timerId = setTimeout(() => {
            showNotification(task);
        }, delay);
        
        activeReminders.push({
            id: timerId,
            datetime: datetime,
            task: task
        });
        
        console.log(`Reminder set for ${reminderTime.toLocaleString()}`);
    }
}

/**
 * Show browser notification
 */
function showNotification(task) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('MPA Reminder', {
            body: task
        });
    } else {
        // Fallback to alert
        alert(`MPA Reminder: ${task}`);
    }
}

/**
 * Handle quick action buttons
 */
quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        
        if (action === 'joke') {
            userInput.value = 'Tell me a joke';
        } else if (action === 'quote') {
            userInput.value = 'Give me a quote';
        }
        
        handleUserMessage();
    });
});

/**
 * Event listeners
 */
sendBtn.addEventListener('click', handleUserMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserMessage();
    }
});

// Request notification permission on load
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

/**
 * Initialize user setup
 */
function initializeUserSetup() {
    // Check if user is already registered
    if (!currentUser) {
        showUserSetup();
    } else {
        // User already setup, focus input
        userInput.focus();
    }
}

/**
 * Show user setup dialog
 */
function showUserSetup() {
    const setupOverlay = document.createElement('div');
    setupOverlay.className = 'setup-overlay';
    setupOverlay.id = 'setupOverlay';
    
    const setupBox = document.createElement('div');
    setupBox.className = 'setup-box';
    
    setupBox.innerHTML = `
        <h2>Welcome to MPA</h2>
        <p>Your Personal Digital Butler</p>
        <p class="setup-description">Please register your name. MPA will respond only to you.</p>
        <input type="text" id="userNameInput" placeholder="Enter your name" autocomplete="off">
        <button id="registerUserBtn">Register</button>
    `;
    
    setupOverlay.appendChild(setupBox);
    document.body.appendChild(setupOverlay);
    
    // Handle registration
    const userNameInput = document.getElementById('userNameInput');
    const registerBtn = document.getElementById('registerUserBtn');
    
    function registerUser() {
        const userName = userNameInput.value.trim();
        if (userName) {
            currentUser = userName;
            mpa.setRegisteredUser(userName);
            localStorage.setItem('mpa_registered_user', userName);
            
            // Remove setup overlay
            setupOverlay.remove();
            
            // Show welcome message
            const welcomeMsg = `Welcome, ${userName}! I'm MPA, your personal assistant. How may I be of service?`;
            const welcomeDiv = document.querySelector('.welcome-message p');
            if (welcomeDiv) {
                welcomeDiv.textContent = welcomeMsg;
            }
            
            // Focus input
            userInput.focus();
        }
    }
    
    registerBtn.addEventListener('click', registerUser);
    userNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            registerUser();
        }
    });
    
    // Focus the input
    userNameInput.focus();
}

/**
 * Allow user to change registered user (for testing/demo purposes)
 */
function resetUser() {
    localStorage.removeItem('mpa_registered_user');
    currentUser = null;
    mpa.setRegisteredUser(null);
    location.reload();
}

// Make resetUser available globally for testing
window.resetMPAUser = resetUser;

// Initialize user setup on load
initializeUserSetup();
