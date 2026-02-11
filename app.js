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
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const saveSettingsBtn = document.getElementById('saveSettings');
const closeSettingsBtn = document.getElementById('closeSettings');
const assistantNameDisplay = document.getElementById('assistantName');

// Store active reminders
let activeReminders = [];

/**
 * Load and apply saved settings
 */
function loadSettings() {
    const savedName = localStorage.getItem('mpaUserName') || 'MPA';
    const savedGender = localStorage.getItem('mpaGender') || 'neutral';
    const savedLanguage = localStorage.getItem('mpaLanguage') || 'en';
    
    // Update display
    if (assistantNameDisplay) {
        assistantNameDisplay.textContent = savedName;
    }
    
    // Update form fields
    const userNameInput = document.getElementById('userName');
    if (userNameInput) userNameInput.value = savedName;
    
    const genderRadio = document.querySelector(`input[name="gender"][value="${savedGender}"]`);
    if (genderRadio) genderRadio.checked = true;
    
    const languageSelect = document.getElementById('language');
    if (languageSelect) languageSelect.value = savedLanguage;
}

/**
 * Show settings modal
 */
function showSettings() {
    loadSettings();
    settingsModal.style.display = 'flex';
}

/**
 * Hide settings modal
 */
function hideSettings() {
    settingsModal.style.display = 'none';
}

/**
 * Save settings
 */
function saveSettings() {
    const userName = document.getElementById('userName').value.trim() || 'MPA';
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const language = document.getElementById('language').value;
    
    // Update MPA instance
    mpa.setUserName(userName);
    mpa.setGender(gender);
    mpa.setLanguage(language);
    
    // Update display
    if (assistantNameDisplay) {
        assistantNameDisplay.textContent = userName;
    }
    
    // Show confirmation
    addMessage(`Settings saved! I'm now ${userName} (${gender} assistant, ${language} language).`, false);
    
    hideSettings();
}

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
    
    // Process message with MPA
    const response = mpa.processMessage(message);
    
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
        } else if (action.type === 'TRANSLATE') {
            handleTranslation(action);
            addActionNotification(action.displayText);
        } else if (action.type === 'CALL') {
            handleCall(action);
            addActionNotification(action.text);
        } else if (action.type === 'PLAY_VIDEO') {
            handlePlayVideo(action);
            addActionNotification(action.text);
        } else if (action.type === 'PLAY_SONG') {
            handlePlaySong(action);
            addActionNotification(action.text);
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
 * Handle translation
 */
function handleTranslation(action) {
    // Simulate translation using Google Translate API
    // In a real app, this would call Google Translate API
    const { language, text, oral } = action;
    
    // For demo purposes, we'll show a placeholder
    // In production, integrate with Google Translate API
    console.log(`Translation requested: "${text}" to ${language}${oral ? ' (oral)' : ''}`);
    
    // Example translation mapping for demo
    const demoTranslations = {
        'tamil': { 'hello': 'வணக்கம் (Vanakkam)', 'thank you': 'நன்றி (Nandri)' },
        'hindi': { 'hello': 'नमस्ते (Namaste)', 'thank you': 'धन्यवाद (Dhanyavaad)' },
        'spanish': { 'hello': 'Hola', 'thank you': 'Gracias' }
    };
    
    const lowerLang = language.toLowerCase();
    const lowerText = text.toLowerCase();
    
    if (demoTranslations[lowerLang] && demoTranslations[lowerLang][lowerText]) {
        setTimeout(() => {
            addMessage(`Translation: ${demoTranslations[lowerLang][lowerText]}`, false);
        }, 500);
    }
}

/**
 * Handle phone calls
 */
function handleCall(action) {
    const { phone, contact } = action;
    
    // In a real mobile app, this would trigger the phone dialer
    console.log(`Calling ${contact} at ${phone}`);
    
    // For web demo, we can't make actual calls, but we can show the intent
    // In a mobile app, this would use: window.location.href = `tel:${phone}`;
    if (phone.match(/^\+?\d+$/)) {
        // Valid phone number format
        const telLink = `tel:${phone}`;
        console.log(`Call link: ${telLink}`);
    }
}

/**
 * Handle video playback
 */
function handlePlayVideo(action) {
    const { videoName } = action;
    
    // In a real app, this would search and play videos from public domain sources
    console.log(`Playing video: ${videoName}`);
    
    // For demo, we could search YouTube or other public domain video sources
    // Example: Create a search link
    const searchQuery = encodeURIComponent(videoName + ' public domain');
    const searchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
    
    // Show a link to search results
    setTimeout(() => {
        addActionNotification(`Search for "${videoName}"`, searchUrl);
    }, 300);
}

/**
 * Handle song playback
 */
function handlePlaySong(action) {
    const { songName } = action;
    
    // In a real app, this would play songs from public domain or streaming services
    console.log(`Playing song: ${songName}`);
    
    // For demo, we could search YouTube Music or other public domain music sources
    const searchQuery = encodeURIComponent(songName);
    const searchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
    
    // Show a link to search results
    setTimeout(() => {
        addActionNotification(`Search for "${songName}"`, searchUrl);
    }, 300);
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

// Settings modal event listeners
if (settingsBtn) {
    settingsBtn.addEventListener('click', showSettings);
}

if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', saveSettings);
}

if (closeSettingsBtn) {
    closeSettingsBtn.addEventListener('click', hideSettings);
}

// Close modal when clicking outside
if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            hideSettings();
        }
    });
}

// Request notification permission on load
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// Load settings on startup
loadSettings();

// Focus input on load
userInput.focus();
