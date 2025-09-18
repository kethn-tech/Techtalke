const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGemini() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // List available models
        console.log('Attempting to create model...');
        const model = genAI.getGenerativeModel({
            model: "gemini-1.0-pro",
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
            },
        });

        console.log('Attempting to generate content...');
        const result = await model.generateContent('Say hello!');
        const response = result.response;
        const text = response.text();
        console.log('Response:', text);
    } catch (error) {
        console.error('Error:', error);
    }
}

testGemini();
