# MPA Usage Examples

## Quick Start

1. Start the server: `npm start`
2. Open browser to `http://localhost:3000`
3. Click ⚙️ to customize your assistant (optional)
4. Start chatting with MPA!

## Settings

Click the ⚙️ settings button in the top right to customize:

### Assistant Name
- Set a custom name like "Nina", "Alex", or keep "MPA"
- MPA will respond to this name in conversations

### Assistant Gender
- **Male**: Male voice preference
- **Female**: Female voice preference
- **Neutral**: Gender-neutral (default)

### Preferred Language
Choose from:
- **Indian Languages**: Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi
- **Foreign Languages**: Spanish, French, German, Japanese, Chinese
- Note: Translation feature works with all supported languages

## Example Commands

### Reminders

```
Remind me to call the dentist tomorrow at 10 AM
→ Sets a reminder for tomorrow at 10:00 AM

Remind me to workout today at 6 PM
→ Sets a reminder for today at 6:00 PM (includes motivational quote!)

Remind me to submit the report on Monday at 2 PM
→ Sets a reminder for next Monday at 2:00 PM
```

### Daily Content

```
Tell me a joke
→ Returns a clever, tech-related joke

Give me a quote
→ Returns a philosophical or disciplined quote
```

### Translation

```
Translate "Hello" to Tamil
→ Translates text to Tamil: வணக்கம் (Vanakkam)

Translate "Thank you" to Hindi orally
→ Translates and provides oral pronunciation

Translate "Good morning" to Spanish
→ Translates to Spanish: Buenos días
```

### Phone Calls

```
Call mom
→ Initiates call to "mom" with speaker mode

Call John
→ Initiates call to John with speaker mode

Call +1234567890
→ Initiates call to phone number with speaker mode
```

### Entertainment

```
Play song "Amazing Grace"
→ Searches for and plays song from public domain

Play video "Nature Documentary"
→ Searches for and plays video from public domain

Play music "Beethoven Symphony"
→ Searches for and plays music from public domain
```

### WhatsApp Messages

```
Message John at +1234567890 saying "Hey, are we still on for lunch?"
→ Drafts message and provides WhatsApp deep link

Text Sarah at +44123456789 saying "Meeting at 3 PM"
→ Drafts message and provides WhatsApp deep link
```

## Features

### Action Codes (Hidden from UI)

MPA uses bracketed codes internally:
- `[SET_REMINDER: ISO_DATE_TIME]` - Triggers browser notification
- `[WHATSAPP_LINK: phone|message]` - Generates WhatsApp deep link
- `[TRANSLATE: language|text|oral?]` - Triggers translation
- `[CALL: phone|contact]` - Initiates phone call
- `[PLAY_VIDEO: video_name]` - Plays video from public domain
- `[PLAY_SONG: song_name]` - Plays song from public domain

These are automatically:
- Parsed by the app
- Hidden from the user interface
- Used to trigger device actions

### Obscenity Filter

MPA automatically refuses inappropriate requests:
- Pornographic content
- Explicit material
- Non-ordinary requests

Response: "I am sorry. I cannot be of help."

### Proactive Suggestions

MPA automatically suggests motivational quotes when you set reminders for:
- gym
- workout
- exercise
- run
- fitness
- training

### Personality

MPA responds with:
- **Concise** answers (max 3 sentences)
- **Witty** butler-like personality
- **Proactive** suggestions

## Testing

Run the test suite to validate all features:

```bash
npm test
```

This will test:
- Joke feature
- Quote feature
- Reminder extraction
- Proactive motivation
- WhatsApp link generation
- Translation feature
- Phone call feature
- Video playback feature
- Song playback feature
- Obscenity filter
- User preferences (name, gender, language)
- Action code hiding

## Tips

1. **Browser Notifications**: Allow notification permissions when prompted for reminder alerts
2. **Natural Language**: Use natural time expressions like "tomorrow at 10 AM" or "today at 6 PM"
3. **WhatsApp Format**: Include country code in phone number (e.g., +1234567890)
4. **Quick Actions**: Use the quick action buttons for faster access to jokes and quotes
5. **Settings**: Customize your assistant's name, gender, and language preference via the ⚙️ button
6. **Translation**: Specify "orally" for pronunciation guidance (e.g., "Translate Hello to Tamil orally")
7. **Entertainment**: Song and video playback searches public domain sources
8. **Calls**: Call feature works best on mobile devices or with telephony integration
