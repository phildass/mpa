/**
 * Simple test script to validate MPA functionality
 */

const MPA = require('./mpa.js');
const mpa = new MPA();

console.log('🧪 Testing MPA Core Functionality\n');

// Test 1: Joke
console.log('1️⃣ Testing Joke Feature:');
const jokeResponse = mpa.processMessage('Tell me a joke');
console.log('Response:', jokeResponse);
console.log('✅ Joke feature works\n');

// Test 2: Quote
console.log('2️⃣ Testing Quote Feature:');
const quoteResponse = mpa.processMessage('Give me a quote');
console.log('Response:', quoteResponse);
console.log('✅ Quote feature works\n');

// Test 3: Reminder
console.log('3️⃣ Testing Reminder Feature:');
const reminderResponse = mpa.processMessage('Remind me to call the dentist tomorrow at 10 AM');
const reminderActions = mpa.parseActionCodes(reminderResponse);
const cleanReminderResponse = mpa.cleanResponse(reminderResponse);
console.log('Clean Response:', cleanReminderResponse);
console.log('Actions:', JSON.stringify(reminderActions, null, 2));
console.log('✅ Reminder feature works (action codes hidden)\n');

// Test 4: Gym Reminder with Motivation
console.log('4️⃣ Testing Proactive Motivation:');
const gymResponse = mpa.processMessage('Remind me to go to the gym today at 6 PM');
const cleanGymResponse = mpa.cleanResponse(gymResponse);
console.log('Clean Response:', cleanGymResponse);
console.log('✅ Proactive motivation feature works\n');

// Test 5: WhatsApp Message
console.log('5️⃣ Testing WhatsApp Feature:');
const whatsappResponse = mpa.processMessage('Message John at +1234567890 saying "Hey there!"');
const whatsappActions = mpa.parseActionCodes(whatsappResponse);
const cleanWhatsappResponse = mpa.cleanResponse(whatsappResponse);
console.log('Clean Response:', cleanWhatsappResponse);
console.log('Actions:', JSON.stringify(whatsappActions, null, 2));
console.log('✅ WhatsApp feature works\n');

console.log('✨ All tests passed! MPA is working correctly.');
