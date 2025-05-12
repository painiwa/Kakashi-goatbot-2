const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

function formatBox(content) {
  return `╭───⌾⋅ 𝐾𝐴𝐾𝐴𝑆𝐻𝐼 𝐵𝑜𝑡 ⋅⌾───╮
│
│   ${content}
│
│   ┐(‘～\`;)┌
│
╰──────⌾⋅ ⌾ ⋅⌾──────╯`;
}

module.exports = {
  config: {
    name: "join",
    version: "2.0",
    author: "messie osango",
    countDown: 5,
    role: 0,
    shortDescription: "Rejoignez le groupe dans lequel se trouve le bot",
    longDescription: "",
    category: "owner",
    guide: {
      en: "{p}{n}",
    },
  },

  onStart: async function ({ api, event }) {
    try {
      const groupList = await api.getThreadList(10, null, ['INBOX']);
      const filteredList = groupList.filter(group => group.threadName !== null);

      if (filteredList.length === 0) {
        api.sendMessage(formatBox('No group chats found.'), event.threadID);
      } else {
        const formattedList = filteredList.map((group, index) =>
          `│ ${index + 1}. ${group.threadName}\n│ 𝐓𝐈𝐃: ${group.threadID}\n│ 𝐌𝐞𝐦𝐛𝐫𝐞𝐬: ${group.participantIDs.length}`
        );
        
        const message = `╭───⌾⋅ 𝐾𝐴𝐾𝐴𝑆𝐻𝐼 𝐵𝑜𝑡 ⋅⌾───╮
│
│   𝐋𝐢𝐬𝐭𝐞 𝐝𝐞𝐬 𝐠𝐫𝐨𝐮𝐩𝐞𝐬:
│
${formattedList.map(line => `│   ${line}`).join("\n")}
│
│   𝐌𝐚𝐱: 250 𝐦𝐞𝐦𝐛𝐫𝐞𝐬
│   Répondez avec le numéro du groupe
│
╰──────⌾⋅ ⌾ ⋅⌾──────╯`;

        const sentMessage = await api.sendMessage(message, event.threadID);
        global.GoatBot.onReply.set(sentMessage.messageID, {
          commandName: 'join',
          messageID: sentMessage.messageID,
          author: event.senderID,
        });
      }
    } catch (error) {
      api.sendMessage(formatBox('Erreur de chargement des groupes'), event.threadID);
    }
  },

  onReply: async function ({ api, event, Reply, args }) {
    const { author, commandName } = Reply;

    if (event.senderID !== author) {
      return api.sendMessage(formatBox('Commande réservée à l\'expéditeur original'), event.threadID);
    }

    const groupIndex = parseInt(args[0], 10);

    if (isNaN(groupIndex) || groupIndex <= 0) {
      return api.sendMessage(formatBox('Numéro invalide'), event.threadID, event.messageID);
    }

    try {
      const groupList = await api.getThreadList(10, null, ['INBOX']);
      const filteredList = groupList.filter(group => group.threadName !== null);

      if (groupIndex > filteredList.length) {
        return api.sendMessage(formatBox('Numéro hors limite'), event.threadID, event.messageID);
      }

      const selectedGroup = filteredList[groupIndex - 1];
      const groupID = selectedGroup.threadID;

      const memberList = await api.getThreadInfo(groupID);
      if (memberList.participantIDs.includes(event.senderID)) {
        return api.sendMessage(formatBox(`Vous êtes déjà dans:\n${selectedGroup.threadName}`), event.threadID, event.messageID);
      }

      if (memberList.participantIDs.length >= 250) {
        return api.sendMessage(formatBox(`Groupe complet:\n${selectedGroup.threadName}`), event.threadID, event.messageID);
      }

      await api.addUserToGroup(event.senderID, groupID);
      api.sendMessage(formatBox(`Vous avez rejoint:\n${selectedGroup.threadName}`), event.threadID, event.messageID);
    } catch (error) {
      api.sendMessage(formatBox('Erreur de connexion au groupe'), event.threadID, event.messageID);
    } finally {
      global.GoatBot.onReply.delete(event.messageID);
    }
  },
};
