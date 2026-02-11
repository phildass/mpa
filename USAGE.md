# MPA Usage Examples

## Quick Start

1. Start the server: `npm start`
2. Open browser to `http://localhost:3000`
3. Start chatting with MPA!

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

These are automatically:
- Parsed by the app
- Hidden from the user interface
- Used to trigger device actions

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
- Action code hiding

## Tips

1. **Browser Notifications**: Allow notification permissions when prompted for reminder alerts
2. **Natural Language**: Use natural time expressions like "tomorrow at 10 AM" or "today at 6 PM"
3. **WhatsApp Format**: Include country code in phone number (e.g., +1234567890)
4. **Quick Actions**: Use the quick action buttons for faster access to jokes and quotes
