// https://github.com/youkeykuwa/discord.gemini/blob/main/index.js 元コード
// GeminiAPIキーはhttps://makersuite.google.com/app/prompts/new_freeformで取得してください
// geminiは無料版は15リクエスト/分、1日1500リクエストです
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { API_KEY } = require('../config.json');
const genAI = new GoogleGenerativeAI(API_KEY);

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot || !message.content) return;

        if (message.channel.name !== 'gemini-ai') return;

        try {
            await message.channel.sendTyping();

            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(message.content);
            const response = await result.response;
            const text = await response.text(); 

            const replyText = text.length > 2000 ? text.substring(0, 1997) + '...' : text;

            message.channel.send(replyText);
        } catch (error) {
            console.error('Error responding to message:', error);
            message.channel.send('エラーが発生しました。');
        }
    },
};
