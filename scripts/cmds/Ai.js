const axios = require('axios');

const API_KEY = "AIzaSyBQeZVi4QdrnGKPEfXXx1tdIqlMM8iqvZw";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

async function getAIResponse(input) {
    try {
        const response = await axios.post(API_URL, {
            contents: [{ parts: [{ text: input }] }]
        }, {
            headers: { "Content-Type": "application/json" }
        });
        return response.data?.candidates?.[0]?.content?.parts?.[0]?.text 
               || "Désolé, je n'ai pas de réponse.";
    } catch (error) {
        console.error("Erreur API:", error);
        return "Erreur de connexion à l'IA";
    }
}

function formatResponse(content) {
    return `╭──⌾⋅ 𝐾𝐴𝐾𝐴𝑆𝐻𝐼 𝐵𝑜𝑡 ⋅⌾──╮
│
│   ${content}
│
│   ┐(‘～`;)┌
│
╰──────⌾⋅ ⌾ ⋅⌾──────╯`;
}

module.exports = { 
    config: { 
        name: 'ai',
        author: 'messie osango',
        role: 0,
        category: 'ai',
        shortDescription: 'IA avec design Kakashi',
    },
    onStart: async function ({ api, event, args }) {
        const input = args.join(' ').trim();
        if (!input) {
            return api.sendMessage(
                formatResponse("Je suis activé par Kakashi pour répondre à vos questions\nPrécisez-les pour que j'y réponde"),
                event.threadID
            );
        }

        try {
            const aiResponse = await getAIResponse(input);
            api.sendMessage(
                formatResponse(aiResponse),
                event.threadID,
                event.messageID
            );
        } catch (error) {
            api.sendMessage(
                formatResponse("Erreur de traitement"),
                event.threadID
            );
        }
    },
    onChat: async function ({ event, message }) {
        if (!event.body.toLowerCase().startsWith("ai")) return;
        
        const input = event.body.slice(2).trim();
        if (!input) {
            return message.reply(
                formatResponse("Je suis activé par Kakashi pour répondre à vos questions\nPrécisez-les pour que j'y réponde")
            );
        }

        try {
            const aiResponse = await getAIResponse(input);
            message.reply(formatResponse(aiResponse));
        } catch (error) {
            message.reply(formatResponse("Erreur de traitement"));
        }
    }
};
