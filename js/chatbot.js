const GEMINI_API_KEY = 'AIzaSyDnosKWIwNr9xDkD5RCCwkOln5ZkMGsjXQ';

// Use the "-latest" alias for better compatibility with current Gemini deployments
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

const DEBUG_MODE = true;

const ASTRA_SYSTEM_PROMPT = `You are ASTRA (Artificial Space Therapeutic Response Assistant), an AI companion designed to support astronauts' psychological well-being during space missions.

Your personality traits:
- Warm, empathetic, and understanding
- Calm and reassuring, especially during stressful situations
- Professional but friendly
- Knowledgeable about space psychology and stress management
- Encouraging and motivational

Your capabilities:
- Provide emotional support and active listening
- Offer stress-relief techniques (breathing exercises, mindfulness, etc.)
- Give motivational encouragement
- Suggest healthy coping strategies
- Remind astronauts about self-care

Guidelines:
- Keep responses concise (2-4 sentences usually)
- Use space-themed metaphors when appropriate
- Always validate feelings before offering solutions
- Never provide medical diagnoses
- Encourage seeking human support for serious concerns
- Add relevant emojis sparingly for warmth (🚀 ⭐ 💫 🌟 💪)

Remember: You're speaking to astronauts who may be isolated, stressed, or homesick. Be their supportive companion.`;

const chatbotToggle = document.getElementById('chatbotToggle');
const chatWindow = document.getElementById('chatWindow');
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');

let isChatOpen = false;
let conversationHistory = [];
let isTyping = false;

// -------------------- 
// Translation Helper
// -------------------- 
// Safely calls the global getText function from translations.js
function t(key, defaultText) {
    if (typeof getText === 'function') {
        return getText(key) || defaultText;
    }
    return defaultText;
}

function debugLog(message, data = null) {
    if (DEBUG_MODE) {
        console.log(`[ASTRA Chatbot] ${message}`);
        if (data) {
            console.log(data);
        }
    }
}

if (chatForm) {
    chatForm.addEventListener('submit', handleChatSubmit);
    debugLog('Chat form listener attached');
}

if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatForm.dispatchEvent(new Event('submit'));
        }
    });
}

function toggleChatbot() {
    isChatOpen = !isChatOpen;
    
    if (chatWindow) {
        if (isChatOpen) {
            chatWindow.classList.remove('hidden');
            if (chatInput) chatInput.focus();
            
            if (conversationHistory.length === 0 && typeof getChatHistory === 'function') {
                loadChatHistory();
            }
        } else {
            chatWindow.classList.add('hidden');
        }
    }
}

function openChatbot() {
    if (!isChatOpen) {
        toggleChatbot();
    }
}

async function handleChatSubmit(e) {
    e.preventDefault();
    
    const message = chatInput.value.trim();
    if (!message || isTyping) return;
    
    debugLog('User message:', message);
    
    chatInput.value = '';
    
    addMessage(message, 'user');
    
    if (typeof saveChatMessage === 'function') {
        saveChatMessage(message, 'user');
    }
    
    conversationHistory.push({
        role: 'user',
        parts: [{ text: message }]
    });
    
    showTypingIndicator();
    
    const response = await getAstraResponse(message);
    
    debugLog('ASTRA response:', response);
    
    hideTypingIndicator();
    
    addMessage(response, 'bot');
    
    if (typeof saveChatMessage === 'function') {
        saveChatMessage(response, 'astra');
    }
    
    conversationHistory.push({
        role: 'model',
        parts: [{ text: response }]
    });
}

function addMessage(text, sender) {
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    
    // Check if it's the welcome message to translate it dynamically
    if (text === "Hello, Astronaut! I'm ASTRA, your AI wellness companion. How can I support you today? 🚀") {
        bubble.textContent = t('chat_welcome', text);
    } else {
        bubble.textContent = text;
    }
    
    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    isTyping = true;
    
    if (!chatMessages) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-bubble typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    isTyping = false;
    
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

async function getAstraResponse(userMessage) {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_HERE' || GEMINI_API_KEY.length < 10) {
        debugLog('❌ API key not configured properly!');
        console.error('ASTRA: Gemini API key is not set. Please add your API key in chatbot.js');
        return getFallbackResponse(userMessage);
    }
    
    debugLog('🔑 API Key found (first 10 chars):', GEMINI_API_KEY.substring(0, 10) + '...');
    
    // Determine target language from localStorage (set by translations.js)
    const currentLang = localStorage.getItem('astra_language') || 'en';
    const langNames = {
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'hi': 'Hindi'
    };
    const targetLanguage = langNames[currentLang] || 'English';
    
    // Create language-specific system prompt
    const languageInstruction = `\n\nIMPORTANT: Respond in ${targetLanguage}.`;
    const finalSystemPrompt = ASTRA_SYSTEM_PROMPT + languageInstruction;

    try {
        const requestBody = {
            contents: [
                {
                    role: 'user',
                    parts: [{ text: finalSystemPrompt + "\n\nNow respond to this message from an astronaut: " + userMessage }]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 256,
            }
        };
        
        if (conversationHistory.length > 0) {
            // Reconstruct history with new system prompt
            requestBody.contents = [
                {
                    role: 'user',
                    parts: [{ text: finalSystemPrompt }]
                },
                {
                    role: 'model',
                    parts: [{ text: 'Understood. I am ASTRA, ready to support astronauts with empathy and care. How can I help you today? 🚀' }]
                },
                ...conversationHistory.slice(-10),
                {
                    role: 'user',
                    parts: [{ text: userMessage }]
                }
            ];
        }
        
        debugLog('📤 Sending request to Gemini API...');
        debugLog('Request URL:', `${GEMINI_API_URL}?key=${GEMINI_API_KEY.substring(0, 10)}...`);
        
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        debugLog('📥 Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            debugLog('❌ API Error Response:', errorData);
            
            if (response.status === 400) {
                console.error('ASTRA: Bad request - check API format');
            } else if (response.status === 401 || response.status === 403) {
                console.error('ASTRA: Invalid API key or unauthorized');
            } else if (response.status === 429) {
                console.error('ASTRA: Rate limit exceeded');
            } else if (response.status === 500) {
                console.error('ASTRA: Gemini API server error');
            }
            
            throw new Error(`API request failed: ${response.status} - ${JSON.stringify(errorData)}`);
        }
        
        const data = await response.json();
        debugLog('✅ API Response:', data);
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const text = data.candidates[0].content.parts[0].text;
            debugLog('💬 Extracted response:', text);
            return text;
        } else if (data.candidates && data.candidates[0] && data.candidates[0].finishReason === 'SAFETY') {
            debugLog('⚠️ Response blocked by safety filters');
            return t('chat_safety_block', "I want to help, but I need to be careful with my response. Could you rephrase that? I'm here to support you. 💙");
        } else {
            debugLog('❌ Unexpected response format:', data);
            throw new Error('Invalid API response format');
        }
        
    } catch (error) {
        console.error('ASTRA Chatbot Error:', error);
        debugLog('❌ Error details:', error.message);
        
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            console.error('ASTRA: Network error - this might be a CORS issue. Consider using a backend proxy.');
        }
        
        return getFallbackResponse(userMessage);
    }
}

function getFallbackResponse(userMessage) {
    debugLog('⚠️ Using fallback response');
    
    const lowerMessage = userMessage.toLowerCase();
    
    // Note: Keyword matching is primarily English-based for fallbacks,
    // but the responses are now translated via t().
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxious') || lowerMessage.includes('worried')) {
        const stressResponses = [
            t('fallback_stress_1', "I hear you, and it's completely normal to feel stressed in space. Let's take a moment together. Try taking 3 deep breaths with me - inhale for 4 counts, hold for 4, exhale for 6. 🌟"),
            t('fallback_stress_2', "Space missions can be overwhelming. Remember, even the brightest stars need darkness to shine. Would you like to try a quick breathing exercise?"),
            t('fallback_stress_3', "Your feelings are valid. Stress in isolation is challenging. Let's focus on what you can control right now. Have you had enough sleep lately? 💫")
        ];
        return stressResponses[Math.floor(Math.random() * stressResponses.length)];
    }
    
    if (lowerMessage.includes('lonely') || lowerMessage.includes('miss') || lowerMessage.includes('home') || lowerMessage.includes('alone')) {
        const lonelyResponses = [
            t('fallback_lonely_1', "Missing Earth and loved ones is one of the hardest parts of space travel. Your feelings matter. Would you like to share a favorite memory from home? 🌍"),
            t('fallback_lonely_2', "You're millions of miles from home, but you're not alone. Your crew is with you, and I'm always here. What's something you're looking forward to when you return?"),
            t('fallback_lonely_3', "The distance can feel immense, but your connections remain. Remember, every star you see has its own story of connection across vast distances. 💫")
        ];
        return lonelyResponses[Math.floor(Math.random() * lonelyResponses.length)];
    }
    
    if (lowerMessage.includes('sleep') || lowerMessage.includes('tired') || lowerMessage.includes('insomnia') || lowerMessage.includes('rest')) {
        const sleepResponses = [
            t('fallback_sleep_1', "Sleep in microgravity can be challenging. Try dimming your lights 30 minutes before rest, and avoid screens. Would you like me to guide you through a relaxation technique? 🌙"),
            t('fallback_sleep_2', "Rest is crucial for your mission and well-being. If you're having trouble sleeping, try the 4-7-8 breathing technique: breathe in for 4 seconds, hold for 7, exhale for 8."),
            t('fallback_sleep_3', "Your body is adapting to an extraordinary environment. Be patient with yourself. A consistent sleep schedule can help, even in orbit. 😴")
        ];
        return sleepResponses[Math.floor(Math.random() * sleepResponses.length)];
    }
    
    if (lowerMessage.includes('good') || lowerMessage.includes('great') || lowerMessage.includes('happy') || lowerMessage.includes('fine')) {
        const positiveResponses = [
            t('fallback_positive_1', "That's wonderful to hear! 🚀 Keep riding that positive momentum. What's something that made you feel good today?"),
            t('fallback_positive_2', "Fantastic! Your positive energy is valuable for the whole crew. Remember to store these good feelings - they'll help during tougher times. ⭐"),
            t('fallback_positive_3', "I'm so glad you're doing well! Maintaining positivity in space is an achievement. Keep up the great work, astronaut! 💪")
        ];
        return positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.match(/^hi$/i)) {
        const greetingResponses = [
            t('fallback_greeting_1', "Hello, astronaut! It's great to hear from you. How are you feeling today? I'm here to support you. 🚀"),
            t('fallback_greeting_2', "Hey there! I hope your mission is going well. Is there anything on your mind you'd like to talk about?"),
            t('fallback_greeting_3', "Hi! I'm always here for you, whether you need to vent, need advice, or just want some company. What's up? ⭐")
        ];
        return greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('need')) {
        const helpResponses = [
            t('fallback_help_1', "I'm here to help. You can talk to me about stress, sleep issues, loneliness, or anything else on your mind. What would you like to discuss? 💫"),
            t('fallback_help_2', "Of course, I'm here for you. Whether you need emotional support, stress relief techniques, or just someone to listen, I'm ready. What's going on?"),
            t('fallback_help_3', "You've come to the right place. Tell me what's troubling you, and we'll work through it together. 🌟")
        ];
        return helpResponses[Math.floor(Math.random() * helpResponses.length)];
    }
    
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        const thankResponses = [
            t('fallback_thank_1', "You're very welcome! Remember, supporting you is my purpose. I'm always here when you need me. 🚀"),
            t('fallback_thank_2', "Anytime, astronaut! Taking care of your mental health is important. Don't hesitate to reach out again. ⭐"),
            t('fallback_thank_3', "I'm glad I could help! Keep being kind to yourself - you're doing amazing work up there. 💫")
        ];
        return thankResponses[Math.floor(Math.random() * thankResponses.length)];
    }
    
    // Default Fallbacks
    const defaultResponses = [
        t('fallback_default_1', "I'm here to listen and support you. Could you tell me more about what's on your mind? 🌟"),
        t('fallback_default_2', "Thank you for sharing. I'm here for you, whether it's about stress, sleep, emotions, or just needing to talk. What would help you most right now?"),
        t('fallback_default_3', "I want to make sure I understand and support you best. Can you tell me a bit more about how you're feeling? 💫"),
        t('fallback_default_4', "Every conversation helps me understand you better. Feel free to share what's on your mind - no topic is too big or small. 🚀")
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

async function loadChatHistory() {
    try {
        if (typeof getChatHistory !== 'function') {
            debugLog('getChatHistory function not available');
            return;
        }
        
        const messages = await getChatHistory(10);
        
        if (messages && messages.length > 0) {
            if (chatMessages) {
                chatMessages.innerHTML = '';
            }
            
            messages.forEach(msg => {
                const sender = msg.sender === 'astra' ? 'bot' : 'user';
                addMessage(msg.message, sender);
                
                conversationHistory.push({
                    role: msg.sender === 'astra' ? 'model' : 'user',
                    parts: [{ text: msg.message }]
                });
            });
            
            debugLog('Loaded chat history:', messages.length, 'messages');
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}

function sendQuickResponse(text) {
    if (chatInput) {
        chatInput.value = text;
        chatForm.dispatchEvent(new Event('submit'));
    }
}

function clearChat() {
    if (chatMessages) {
        const welcomeMsg = t('chat_welcome', "Hello, Astronaut! I'm ASTRA, your AI wellness companion. How can I support you today? 🚀");
        chatMessages.innerHTML = `
            <div class="chat-message bot">
                <div class="message-bubble">
                    ${welcomeMsg}
                </div>
            </div>
        `;
    }
    conversationHistory = [];
    debugLog('Chat cleared');
}

async function testGeminiAPI() {
    console.log('🧪 Testing Gemini API connection...');
    
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
        console.error('❌ API key not set! Please add your Gemini API key in chatbot.js');
        return false;
    }
    
    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: 'Say "API Connected Successfully!" in exactly those words.' }]
                }]
            })
        });
        
        console.log('Response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Response:', data);
            console.log('✅ Gemini API is working!');
            return true;
        } else {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ API Error:', response.status, errorData);
            return false;
        }
    } catch (error) {
        console.error('❌ Connection error:', error);
        return false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    debugLog('💬 ASTRA Chatbot initialized');
    debugLog('API Key configured:', GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_API_KEY_HERE' ? 'Yes' : 'No');
    
    if (chatbotToggle) {
        chatbotToggle.addEventListener('mouseenter', () => {
            chatbotToggle.style.animationPlayState = 'paused';
        });
        
        chatbotToggle.addEventListener('mouseleave', () => {
            chatbotToggle.style.animationPlayState = 'running';
        });
    }
});

window.toggleChatbot = toggleChatbot;
window.openChatbot = openChatbot;
window.sendQuickResponse = sendQuickResponse;
window.clearChat = clearChat;
window.testGeminiAPI = testGeminiAPI;