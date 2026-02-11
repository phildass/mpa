# 🎩 MPA - My Personal Assistant

A highly efficient, witty, and supportive AI personal assistant with a personality of a high-end digital butler.

## 🌟 Now Available on iiskills-cloud!

MPA is now integrated with the iiskills-cloud app marketplace as a paid application. See the [iiskills-cloud integration](iiskills-cloud/README.md) for details.

- **Pricing**: Rs 99 + GST 18% = Rs 116.82
- **Trial**: 1 hour free access after download
- **Landing Page**: http://localhost:3000/iiskills-cloud

## Features

### Core Capabilities
- **Gender Choice**: Select Male, Female, or Neutral assistant voice preference
- **Name Customization**: Assign any name to your assistant (e.g., Nina, Alex, or keep MPA)
- **Multi-Language Support**: All Indian languages (Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi) plus foreign languages (Spanish, French, German, Japanese, Chinese)
- **Translation**: Translate text between languages with oral pronunciation support

- **User Recognition**: MPA recognizes and responds only to the registered user, ensuring privacy and exclusivity

- **Reminder Extraction**: Set reminders with natural language (e.g., "Remind me to call the dentist tomorrow at 10 AM")
- **Daily Content**: Get clever jokes or deeply philosophical quotes
- **WhatsApp Integration**: Draft messages and generate WhatsApp deep links
- **Phone Calls**: Make calls with speaker mode (e.g., "Call mom")
- **Entertainment**: Play songs and videos from public domain sources
- **Proactive Suggestions**: Automatic motivational quotes for gym/fitness reminders
- **Browser Notifications**: Get notified when reminders are due
- **Obscenity Filter**: Automatically refuses inappropriate content requests
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

### First Time Setup

When you first open the app, you'll be prompted to register your name:

1. Enter your name in the setup dialog
2. Click "Register"
3. MPA will now respond only to you

Your registration is saved in browser localStorage, so you won't need to register again on the same device.

### Example Interactions

**Settings:**
- Click the ⚙️ button to:
  - Change assistant name (e.g., "Nina", "Alex")
  - Select gender preference (Male, Female, Neutral)
  - Choose preferred language

**Reminders:**
- "Remind me to call the dentist tomorrow at 10 AM"
- "Remind me to workout today at 6 PM"
- "Remind me to submit the report on Monday at 2 PM"

**Getting Content:**
- "Tell me a joke"
- "Give me a quote"

**Translation:**
- "Translate 'Hello' to Tamil"
- "Translate 'Thank you' to Hindi orally"

**Phone Calls:**
- "Call mom"
- "Call John"

**Entertainment:**
- "Play song 'Amazing Grace'"
- "Play video 'Nature Documentary'"

**WhatsApp Messages:**
- "Message John at +1234567890 saying 'Hey, are we still on for lunch?'"
- "Text Sarah at +44123456789 saying 'Meeting at 3 PM'"

## How It Works

MPA uses a system prompt to guide its behavior:

### Core Capabilities


1. **User Preferences**: Customize name, gender, and language preferences
2. **Reminder Extraction**: Parses user requests for tasks and times, sets browser notifications
3. **Translation**: Translate text between multiple languages (Indian and foreign languages)
4. **Phone Calls**: Initiates calls with speaker mode
5. **Entertainment**: Plays songs and videos from public domain sources
6. **Daily Content**: Provides jokes or philosophical quotes
7. **WhatsApp Prep**: Drafts messages and generates WhatsApp deep links
8. **Obscenity Filter**: Refuses inappropriate content requests
9. **Proactivity**: Suggests motivational quotes for fitness-related reminders

1. **User Recognition**: Ensures privacy by responding only to the registered user
2. **Reminder Extraction**: Parses user requests for tasks and times, sets browser notifications
3. **Daily Content**: Provides jokes or philosophical quotes
4. **WhatsApp Prep**: Drafts messages and generates WhatsApp deep links
5. **Proactivity**: Suggests motivational quotes for fitness-related reminders


### Action Codes

The app uses hidden bracketed codes that are parsed but not shown to users:

- `[SET_REMINDER: ISO_DATE_TIME]` - Triggers browser notification
- `[WHATSAPP_LINK: phone|message]` - Generates WhatsApp deep link
- `[TRANSLATE: language|text|oral?]` - Triggers translation (with optional oral pronunciation)
- `[CALL: phone|contact]` - Initiates phone call with speaker mode
- `[PLAY_VIDEO: video_name]` - Plays video from public domain
- `[PLAY_SONG: song_name]` - Plays song from public domain

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

### Security Note

This application is designed for **local personal use only**. The Express server does not include rate limiting or other production-grade security features. Do not expose this server to the public internet. Run it only on localhost for personal use.

### Browser Compatibility

- Modern browsers with ES6 support
- Notification API support for reminders
- Local storage for persistence (future enhancement)

## Customization

You can customize MPA by editing:

- **Settings UI**: Click the ⚙️ button to change name, gender, and language
- **Jokes**: Modify the `jokes` array in `mpa.js`
- **Quotes**: Modify the `quotes` array in `mpa.js`
- **Motivational Keywords**: Modify the `motivationalKeywords` array in `mpa.js`
- **Obscenity Filter**: Modify the `obsceneKeywords` array in `mpa.js`
- **System Prompt**: Edit the `systemPrompt` in `mpa.js`

## User Recognition & Privacy

MPA includes a user recognition feature that ensures your privacy and exclusivity:

- **Registration**: On first launch, you register your name with MPA
- **Authentication**: MPA stores your username in browser localStorage
- **Privacy**: If anyone else tries to use MPA, they'll receive the message: "Sorry, I am only available for [Your Name]."
- **Reset**: To reset the user registration (for testing or changing users), open the browser console and run: `window.resetMPAUser()`

### How It Works

- When you first open MPA, a setup dialog appears
- You enter your name and click "Register"
- MPA saves your name and will only respond to you
- Other users attempting to interact will be politely declined

This feature is ideal for personal use scenarios where you want to ensure your assistant remains private and exclusive to you.

## Future Enhancements

- Voice input/output with speaker identification
- Biometric authentication (fingerprint/face unlock)
- Multi-user profiles support
- Calendar integration
- Email drafting
- Task list management
- Mobile app version
- AI model integration (OpenAI, Claude, etc.)

## License

ISC License - See LICENSE file for details
