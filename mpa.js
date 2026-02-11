/**
 * MPA - My Personal Assistant
 * Core AI Logic and System Prompt
 */

class MPA {
    constructor() {
        this.systemPrompt = `Role: You are "MPA" (My Personal Assistant), a highly efficient, witty, and supportive AI companion. Your goal is to manage my life with minimal friction.

**User Recognition:**
- You respond only to the recognized/registered user.
- If addressed by anyone else, decline politely with: "Sorry, I am only available for [User Name]."

**Core Capabilities:**
- **Reminder Extraction:** If the user mentions a task and a time, format as JSON: {"action": "REMINDER", "task": "...", "time": "..."}
- **Daily Content:** When asked for a joke or quote, provide clever jokes or deeply philosophical/highly disciplined quotes.
- **WhatsApp Preparation:** When asked to message someone, draft clear, concise message and output WhatsApp deep link.
- **Proactivity:** When setting certain reminders (e.g., "the gym"), suggest a motivational quote.

**Tone & Style:**
- Concise: Short sentences (for voice-to-text).
- Proactive. Prioritize user schedule.
- Witty: Personality of a high-end digital butler.

**Constraints:**
- If unclear, ask for clarification immediately.
- Never use more than 3 sentences unless providing a list.

**Action Codes:**
- Use [SET_REMINDER: ISO_DATE_TIME] for reminders
- Use [WHATSAPP_LINK: phone_number|message] for WhatsApp messages
- These codes will be hidden from the user but trigger device actions.`;

        this.registeredUser = null; // Will be set during user setup
        this.jokes = [
            "Why did the AI go to therapy? It had too many deep learning issues.",
            "I'd tell you a UDP joke, but you might not get it.",
            "Why do programmers prefer dark mode? Because light attracts bugs.",
            "I'm not procrastinating. I'm doing side quests.",
            "Why did the developer go broke? Because he used up all his cache.",
            "My code works, but I don't know why. That's the real mystery.",
            "I told my computer I needed a break. It gave me a KitKat error.",
            "Debugging is like being a detective in a crime movie where you're also the murderer."
        ];

        this.quotes = [
            "\"The obstacle is the way.\" – Marcus Aurelius. Master resistance, become unstoppable.",
            "\"Discipline equals freedom.\" – Jocko Willink. Structure creates possibility.",
            "\"We are what we repeatedly do. Excellence, then, is not an act, but a habit.\" – Aristotle",
            "\"He who has a why to live can bear almost any how.\" – Nietzsche",
            "\"The best time to plant a tree was 20 years ago. The second best time is now.\" – Chinese Proverb",
            "\"Do not pray for an easy life, pray for the strength to endure a difficult one.\" – Bruce Lee",
            "\"The only way to do great work is to love what you do.\" – Steve Jobs",
            "\"In the midst of chaos, there is also opportunity.\" – Sun Tzu"
        ];

        this.motivationalKeywords = ['gym', 'workout', 'exercise', 'run', 'fitness', 'training'];
    }

    /**
     * Set the registered user
     */
    setRegisteredUser(username) {
        this.registeredUser = username;
    }

    /**
     * Get the registered user
     */
    getRegisteredUser() {
        return this.registeredUser;
    }

    /**
     * Check if a user is authorized
     */
    isUserAuthorized(currentUser) {
        // If no user is registered yet, allow setup
        if (!this.registeredUser) {
            return true;
        }
        // Check if current user matches registered user
        return currentUser === this.registeredUser;
    }

    /**
     * Get unauthorized user response
     */
    getUnauthorizedResponse() {
        const userName = this.registeredUser || 'my registered user';
        return `Sorry, I am only available for ${userName}.`;
    }

    /**
     * Process user message and generate response
     */
    processMessage(userMessage, currentUser = null) {
        // Check user authorization
        if (!this.isUserAuthorized(currentUser)) {
            return this.getUnauthorizedResponse();
        }
        const lowerMessage = userMessage.toLowerCase();

        // Check for joke request
        if (lowerMessage.includes('joke')) {
            return this.getJoke();
        }

        // Check for quote request
        if (lowerMessage.includes('quote')) {
            return this.getQuote();
        }

        // Check for WhatsApp message request
        if (lowerMessage.includes('message') || lowerMessage.includes('whatsapp') || lowerMessage.includes('text')) {
            return this.handleWhatsAppRequest(userMessage);
        }

        // Check for reminder request
        if (lowerMessage.includes('remind')) {
            return this.handleReminderRequest(userMessage);
        }

        // Default response for general queries
        return this.getGeneralResponse(userMessage);
    }

    /**
     * Get a random joke
     */
    getJoke() {
        const joke = this.jokes[Math.floor(Math.random() * this.jokes.length)];
        return `${joke} Anything else I can assist with?`;
    }

    /**
     * Get a random quote
     */
    getQuote() {
        const quote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
        return `${quote}\n\nShall we put this wisdom into action today?`;
    }

    /**
     * Handle reminder requests
     */
    handleReminderRequest(message) {
        const reminderInfo = this.extractReminderInfo(message);
        
        if (!reminderInfo.task || !reminderInfo.time) {
            return "I'd be delighted to set a reminder. Could you specify what and when?";
        }

        const isoDateTime = this.parseTimeToISO(reminderInfo.time);
        let response = `Done. I've logged your ${reminderInfo.task} for ${reminderInfo.time}.`;
        
        // Check for motivational keywords
        const needsMotivation = this.motivationalKeywords.some(keyword => 
            message.toLowerCase().includes(keyword)
        );

        if (needsMotivation) {
            const motivationalQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
            response += ` Here's some motivation: ${motivationalQuote}`;
        } else {
            response += " Anything else?";
        }

        response += `\n[SET_REMINDER: ${isoDateTime}]`;
        
        return response;
    }

    /**
     * Extract task and time from reminder message
     */
    extractReminderInfo(message) {
        const timePatterns = [
            /at (\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i,
            /(\d{1,2}(?::\d{2})?\s*(?:am|pm))/i,
            /(tomorrow|today|tonight)/i,
            /on (monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i
        ];

        let time = '';
        let timeMatch = null;

        for (const pattern of timePatterns) {
            const match = message.match(pattern);
            if (match) {
                time = match[1] || match[0];
                timeMatch = match;
                break;
            }
        }

        // Extract task - everything between "remind me to" and the time
        let task = '';
        const remindPattern = /remind me to (.+?)(?:\s+at|\s+tomorrow|\s+today|\s+on|\s+\d)/i;
        const taskMatch = message.match(remindPattern);
        
        if (taskMatch) {
            task = taskMatch[1].trim();
        } else {
            // Fallback: try to extract after "remind me to"
            const simplePattern = /remind me to (.+)/i;
            const simpleMatch = message.match(simplePattern);
            if (simpleMatch) {
                task = simpleMatch[1].replace(new RegExp(time, 'i'), '').trim();
            }
        }

        return { task, time };
    }

    /**
     * Parse time string to ISO format
     */
    parseTimeToISO(timeStr) {
        const now = new Date();
        let targetDate = new Date();

        if (timeStr.toLowerCase().includes('tomorrow')) {
            targetDate.setDate(now.getDate() + 1);
        }

        // Extract hour and minute
        const timeMatch = timeStr.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
        if (timeMatch) {
            let hour = parseInt(timeMatch[1]);
            const minute = parseInt(timeMatch[2] || '0');
            const meridiem = timeMatch[3];

            if (meridiem) {
                if (meridiem.toLowerCase() === 'pm' && hour < 12) {
                    hour += 12;
                } else if (meridiem.toLowerCase() === 'am' && hour === 12) {
                    hour = 0;
                }
            }

            targetDate.setHours(hour, minute, 0, 0);
            
            // If the time has already passed today and not explicitly tomorrow, schedule for tomorrow
            if (!timeStr.toLowerCase().includes('tomorrow') && targetDate < now) {
                targetDate.setDate(targetDate.getDate() + 1);
            }
        }

        return targetDate.toISOString();
    }

    /**
     * Handle WhatsApp message requests
     */
    handleWhatsAppRequest(message) {
        // Extract phone number and contact name
        const phoneMatch = message.match(/(\+?\d{10,15})/);
        const nameMatch = message.match(/(?:message|text|whatsapp)\s+([a-zA-Z]+)/i);
        
        let contact = nameMatch ? nameMatch[1] : 'contact';
        let phone = phoneMatch ? phoneMatch[1] : '';

        // Extract message content
        const msgMatch = message.match(/(?:say|tell|message).*?["'](.+?)["']/i) ||
                        message.match(/message:?\s*(.+)/i);
        
        let messageText = msgMatch ? msgMatch[1] : 'Hello!';

        if (!phone) {
            return `I'd be happy to draft a WhatsApp message to ${contact}. Could you provide their phone number?`;
        }

        const whatsappLink = this.generateWhatsAppLink(phone, messageText);
        
        return `Drafted your message to ${contact}: "${messageText}"\n[WHATSAPP_LINK: ${phone}|${messageText}]`;
    }

    /**
     * Generate WhatsApp deep link
     */
    generateWhatsAppLink(phone, message) {
        // Remove any non-digit characters from phone
        phone = phone.replace(/\D/g, '');
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${phone}?text=${encodedMessage}`;
    }

    /**
     * General response for other queries
     */
    getGeneralResponse(message) {
        const responses = [
            "I'm here to help. Could you be more specific?",
            "Interesting. How may I assist with that?",
            "Noted. What would you like me to do?",
            "I'm at your service. What's the task?"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    /**
     * Parse action codes from response
     */
    parseActionCodes(response) {
        const actions = [];
        
        // Extract SET_REMINDER actions
        const reminderPattern = /\[SET_REMINDER:\s*([^\]]+)\]/g;
        let match;
        while ((match = reminderPattern.exec(response)) !== null) {
            const datetime = match[1].trim();
            const date = new Date(datetime);
            const dateText = isNaN(date.getTime()) ? 'the specified time' : date.toLocaleString();
            actions.push({
                type: 'SET_REMINDER',
                datetime: datetime,
                text: `Reminder set for ${dateText}`
            });
        }

        // Extract WHATSAPP_LINK actions
        const whatsappPattern = /\[WHATSAPP_LINK:\s*([^|]+)\|([^\]]+)\]/g;
        while ((match = whatsappPattern.exec(response)) !== null) {
            const phone = match[1].trim();
            const message = match[2].trim();
            const link = this.generateWhatsAppLink(phone, message);
            actions.push({
                type: 'WHATSAPP_LINK',
                phone: phone,
                message: message,
                link: link,
                text: 'Open WhatsApp'
            });
        }

        return actions;
    }

    /**
     * Remove action codes from response for display
     */
    cleanResponse(response) {
        return response
            .replace(/\[SET_REMINDER:[^\]]+\]/g, '')
            .replace(/\[WHATSAPP_LINK:[^\]]+\]/g, '')
            .replace(/\[USER_AUTH_REQUIRED\]/g, '')
            .trim();
    }
}

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MPA;
}
