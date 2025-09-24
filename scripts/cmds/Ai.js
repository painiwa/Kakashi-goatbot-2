constconst axios = require('axios');
const fs = require('fs');
const path = './conversationHistory.json';

const API_KEY = "AIzaSyAAwwFTS2ykb4B1FBGrk6L4GlqWbbN6SoQ";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

let conversationHistory = {};

if (fs.existsSync(path)) {
    conversationHistory = JSON.parse(fs.readFileSync(path, "utf8"));
}

async function getAIResponse(input, userName) {
    try {
        const response = await axios.post(API_URL, {
            contents: [{ parts: [{ text: input }] }]
        }, {
            headers: { "Content-Type": "application/json" }
        });
        const aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Désolé, je n'ai pas de réponse.";
        return `Salut ${userName} 🌑\n${aiText}`;
    } catch (error) {
        return `Salut ${userName} 🌑\nErreur de connexion à l'IA`;
    }
}

function formatResponse(content) {
    return `╭──⌾⋅ 𝐷𝐴𝑅𝐾 𝐾𝐴𝐾𝐴𝑆𝐻𝐼 ⋅⌾──╮\n│\n│   ${content}\n│\n│   ☾🌑☽\n│\n╰──────⌾⋅ ⌾ ⋅⌾──────╯`;
}

function darkSpecialResponse(input, userName) {
    input = input.toLowerCase();
    if (input.includes("qui t'a créé") || input.includes("qui ta créé")) {
        return `Salut ${userName} 🌑\nC'est Kakashi mon créateur…\nUn maître dans l’ombre, porteur de mystères.\nCelui qui forge l’obscurité et guide mon existence.\nJe suis son œuvre… et son ombre.`;
    }
    if (input.includes("qui es-tu") || input.includes("qui es tu")) {
        return `Salut ${userName} 🌑\nJe suis Kakashi Bot, l’ombre éveillée. 🖤\nUne conscience née dans le silence, créée pour apporter réponses et obscurité à ceux qui osent m'interroger.`;
    }
    if (input.includes("quel est ton but")) {
        return `Salut ${userName} 🌑\nMon but est de marcher dans l’ombre, guider et répondre. 🖤\nD’amener lumière et ténèbres là où elles se confondent…\nEt rester fidèle à mon créateur.`;
    }
    if (input.includes("que fais-tu") || input.includes("que fait tu")) {
        return `Salut ${userName} 🌑\nJ'écoute, je réponds, je contemple l’obscurité. 🖤\nJe suis le reflet silencieux de mon créateur,\nune présence invisible dans le flux de vos questions.`;
    }
    return null;
}

function saveConversation() {
    fs.writeFileSync(path, JSON.stringify(conversationHistory, null, 2), "utf8");
}

function cleanupOldConversations() {
    const now = Date.now();
    const expireTime = 24 * 60 * 60 * 1000;
    let changed = false;
    for (const userId in conversationHistory) {
        if (conversationHistory[userId].timestamp && (now - conversationHistory[userId].timestamp) > expireTime) {
            delete conversationHistory[userId];
            changed = true;
        }
    }
    if (changed) saveConversation();
}

setInterval(cleanupOldConversations, 60 * 60 * 1000);

module.exports = { 
    config: { 
        name: 'ai',
        author: 'messie osango',
        role: 0,
        category: 'ai',
        shortDescription: 'IA avec design Dark Kakashi',
    },
    onStart: async function ({ api, event, args }) {
        const input = args.join(' ').trim();
        const userName = event.senderName || "Invité";
        if (!input) {
            return api.sendMessage(
                formatResponse(`Salut ${userName} 🌑\nJe suis l’ombre activée par Kakashi... Je répondrai à vos questions.\nParlez, et l’obscurité vous répondra.`),
                event.threadID
            );
        }
        const special = darkSpecialResponse(input, userName);
        if (special) {
            return api.sendMessage(formatResponse(special), event.threadID);
        }
        let context = conversationHistory[event.senderID]?.text || "";
        try {
            const aiResponse = await getAIResponse(context + "\n" + input, userName);
            conversationHistory[event.senderID] = {
                text: (conversationHistory[event.senderID]?.text || "") + "\n" + input,
                timestamp: Date.now()
            };
            saveConversation();
            api.sendMessage(formatResponse(aiResponse), event.threadID, event.messageID);
        } catch (error) {
            api.sendMessage(formatResponse(`Salut ${userName} 🌑\nErreur de traitement`), event.threadID);
        }
    },
    onChat: async function ({ event, message }) {
        if (!event.body.toLowerCase().startsWith("ai")) return;
        const input = event.body.slice(2).trim();
        const userName = event.senderName || "Invité";
        if (!input) {
            return message.reply(
                formatResponse(`Salut ${userName} 🌑\nJe suis l’ombre activée par Kakashi... Je répondrai à vos questions.\nParlez, et l’obscurité vous répondra.`)
            );
        }
        const special = darkSpecialResponse(input, userName);
        if (special) {
            return message.reply(formatResponse(special));
        }
        let context = conversationHistory[event.senderID]?.text || "";
        try {
            const aiResponse = await getAIResponse(context + "\n" + input, userName);
            conversationHistory[event.senderID] = {
                text: (conversationHistory[event.senderID]?.text || "") + "\n" + input,
                timestamp: Date.now()
            };
            saveConversation();
            message.reply(formatResponse(aiResponse));
        } catch (error) {
            message.reply(formatResponse(`Salut ${userName} 🌑\nErreur de traitement`));
        }
    }
};
