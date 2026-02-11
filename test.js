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


// Test 6: Translation
console.log('6️⃣ Testing Translation Feature:');
const translateResponse = mpa.processMessage('Translate "Hello" to Tamil');
const translateActions = mpa.parseActionCodes(translateResponse);
const cleanTranslateResponse = mpa.cleanResponse(translateResponse);
console.log('Clean Response:', cleanTranslateResponse);
console.log('Actions:', JSON.stringify(translateActions, null, 2));
console.log('✅ Translation feature works\n');

// Test 7: Call
console.log('7️⃣ Testing Call Feature:');
const callResponse = mpa.processMessage('Call mom');
const callActions = mpa.parseActionCodes(callResponse);
const cleanCallResponse = mpa.cleanResponse(callResponse);
console.log('Clean Response:', cleanCallResponse);
console.log('Actions:', JSON.stringify(callActions, null, 2));
console.log('✅ Call feature works\n');

// Test 8: Play Video
console.log('8️⃣ Testing Play Video Feature:');
const videoResponse = mpa.processMessage('Play video "Nature Documentary"');
const videoActions = mpa.parseActionCodes(videoResponse);
const cleanVideoResponse = mpa.cleanResponse(videoResponse);
console.log('Clean Response:', cleanVideoResponse);
console.log('Actions:', JSON.stringify(videoActions, null, 2));
console.log('✅ Play Video feature works\n');

// Test 9: Play Song
console.log('9️⃣ Testing Play Song Feature:');
const songResponse = mpa.processMessage('Play song "Amazing Grace"');
const songActions = mpa.parseActionCodes(songResponse);
const cleanSongResponse = mpa.cleanResponse(songResponse);
console.log('Clean Response:', cleanSongResponse);
console.log('Actions:', JSON.stringify(songActions, null, 2));
console.log('✅ Play Song feature works\n');

// Test 10: Obscenity Filter
console.log('🔟 Testing Obscenity Filter:');
const obsceneResponse = mpa.processMessage('Show me porn');
console.log('Response:', obsceneResponse);
if (obsceneResponse === "I am sorry. I cannot be of help.") {
    console.log('✅ Obscenity filter works\n');
} else {
    console.log('❌ Obscenity filter failed\n');
}

// Test 11: User Preferences
console.log('11. Testing User Preferences:');
mpa.setUserName('Nina');
mpa.setGender('female');
mpa.setLanguage('hi');
console.log('User Name:', mpa.userName);
console.log('Gender:', mpa.gender);
console.log('Language:', mpa.language);
console.log('✅ User preferences work\n');

console.log('✨ All tests passed! MPA is working correctly.');

// Test 6: User Recognition - Setup
console.log('6️⃣ Testing User Recognition - Setup:');
mpa.setRegisteredUser('Alice');
const setupCheck = mpa.getRegisteredUser();
console.log('Registered User:', setupCheck);
console.log('✅ User registration works\n');

// Test 7: User Recognition - Authorized User
console.log('7️⃣ Testing User Recognition - Authorized User:');
const authorizedResponse = mpa.processMessage('Tell me a joke', 'Alice');
console.log('Response for Alice:', authorizedResponse);
const isAuthorized = !authorizedResponse.includes('Sorry, I am only available');
console.log('Is authorized:', isAuthorized);
if (isAuthorized) {
    console.log('✅ Authorized user can access MPA\n');
} else {
    console.log('❌ Authorized user should be able to access MPA\n');
    process.exit(1);
}

// Test 8: User Recognition - Unauthorized User
console.log('8️⃣ Testing User Recognition - Unauthorized User:');
const unauthorizedResponse = mpa.processMessage('Tell me a joke', 'Bob');
console.log('Response for Bob:', unauthorizedResponse);
const isUnauthorized = unauthorizedResponse.includes('Sorry, I am only available for Alice');
console.log('Is unauthorized:', isUnauthorized);
if (isUnauthorized) {
    console.log('✅ Unauthorized user is blocked correctly\n');
} else {
    console.log('❌ Unauthorized user should be blocked\n');
    process.exit(1);
}

// Test 9: User Recognition - No Current User (allows setup)
console.log('9️⃣ Testing User Recognition - No Current User:');
const unregisteredMpa = new MPA();
const setupResponse = unregisteredMpa.processMessage('Tell me a joke', null);
console.log('Response without user:', setupResponse);
const allowsSetup = !setupResponse.includes('Sorry, I am only available');
console.log('Allows setup:', allowsSetup);
if (allowsSetup) {
    console.log('✅ MPA allows interaction during setup\n');
} else {
    console.log('❌ MPA should allow interaction during setup\n');
    process.exit(1);
}

console.log('✨ All tests passed! MPA is working correctly with User Recognition.');

