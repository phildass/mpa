# 🎩 MPA - My Personal Assistant

A highly efficient, witty, and supportive AI personal assistant with a personality of a high-end digital butler.

## Features

- **Reminder Extraction**: Set reminders with natural language (e.g., "Remind me to call the dentist tomorrow at 10 AM")
- **Daily Content**: Get clever jokes or deeply philosophical quotes
- **WhatsApp Integration**: Draft messages and generate WhatsApp deep links
- **Proactive Suggestions**: Automatic motivational quotes for gym/fitness reminders
- **Browser Notifications**: Get notified when reminders are due
- **Concise & Witty**: Responses limited to 3 sentences with butler-like personality

## Installation

```bash
# Clone the repository
git clone https://github.com/phildass/mpa.git
cd mpa

# Install dependencies
npm install
```

## Usage

### Start the App

```bash
npm start
```

Then open your browser to `http://localhost:3000`

### Example Interactions

**Setting Reminders:**
- "Remind me to call the dentist tomorrow at 10 AM"
- "Remind me to go to the gym today at 6 PM"

**Getting Content:**
- "Tell me a joke"
- "Give me a quote"

**WhatsApp Messages:**
- "Message John at +1234567890 saying 'Hey, are we still on for lunch?'"

## How It Works

MPA uses a system prompt to guide its behavior:

### Core Capabilities

1. **Reminder Extraction**: Parses user requests for tasks and times, sets browser notifications
2. **Daily Content**: Provides jokes or philosophical quotes
3. **WhatsApp Prep**: Drafts messages and generates WhatsApp deep links
4. **Proactivity**: Suggests motivational quotes for fitness-related reminders

### Action Codes

The app uses hidden bracketed codes that are parsed but not shown to users:

- `[SET_REMINDER: ISO_DATE_TIME]` - Triggers browser notification
- `[WHATSAPP_LINK: phone|message]` - Generates WhatsApp deep link

These codes are automatically hidden from the UI but trigger appropriate actions.

### Tone & Style

- **Concise**: Short sentences optimized for voice-to-text
- **Proactive**: Prioritizes user schedule and needs
- **Witty**: High-end digital butler personality

## Technical Details

### File Structure

```
mpa/
├── index.html      # Main UI
├── style.css       # Styling
├── mpa.js          # Core MPA logic and system prompt
├── app.js          # Frontend application logic
├── server.js       # Express server
├── package.json    # Dependencies
└── README.md       # This file
```

### Browser Compatibility

- Modern browsers with ES6 support
- Notification API support for reminders
- Local storage for persistence (future enhancement)

## Customization

You can customize MPA by editing:

- **Jokes**: Modify the `jokes` array in `mpa.js`
- **Quotes**: Modify the `quotes` array in `mpa.js`
- **Motivational Keywords**: Modify the `motivationalKeywords` array in `mpa.js`
- **System Prompt**: Edit the `systemPrompt` in `mpa.js`

## Future Enhancements

- Calendar integration
- Email drafting
- Task list management
- Voice input/output
- Mobile app version
- AI model integration (OpenAI, Claude, etc.)

## License

ISC License - See LICENSE file for details
