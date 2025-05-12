module.exports = {
  config: {
    name: "antiout",
    version: "1.0",
    author: "Messie Osango",
    countDown: 5,
    role: 0,
    shortDescription: "Activer/désactiver l'anti-départ",
    longDescription: "",
    category: "boxchat",
    guide: "{pn} [on | off]",
    envConfig: {
      deltaNext: 5
    }
  },

  onStart: async function({ message, event, threadsData, args }) {
    let antiout = await threadsData.get(event.threadID, "settings.antiout");
    if (antiout === undefined) {
      await threadsData.set(event.threadID, true, "settings.antiout");
      antiout = true;
    }
    
    if (!["on", "off"].includes(args[0])) {
      return message.reply(`╭───⌾⋅ 𝐾𝐴𝐾𝐴𝑆𝐻𝐼 𝐵𝑜𝑡 ⋅⌾───╮
│
│   Veuillez utiliser 'on' ou 'off'
│   Exemple: antiout on
│
╰──────⌾⋅ ⌾ ⋅⌾──────╯`);
    }
    
    await threadsData.set(event.threadID, args[0] === "on", "settings.antiout");
    return message.reply(`╭───⌾⋅ 𝐾𝐴𝐾𝐴𝑆𝐻𝐼 𝐵𝑜𝑡 ⋅⌾───╮
│
│   Anti-départ ${args[0] === "on" ? "activé" : "désactivé"}
│   ┐(‘～\`;)┌
│
╰──────⌾⋅ ⌾ ⋅⌾──────╯`);
  },

  onEvent: async function({ api, event, threadsData }) {
    const antiout = await threadsData.get(event.threadID, "settings.antiout");
    if (antiout && event.logMessageData && event.logMessageData.leftParticipantFbId) {
      const userId = event.logMessageData.leftParticipantFbId;
      const threadInfo = await api.getThreadInfo(event.threadID);
      
      if (!threadInfo.participantIDs.includes(userId)) {
        try {
          await api.addUserToGroup(userId, event.threadID);
          api.sendMessage(`╭───⌾⋅ 𝐾𝐴𝐾𝐴𝑆𝐻𝐼 𝐵𝑜𝑡 ⋅⌾───╮
│
│   @${userId} a été ramené dans le groupe !
│   On ne part pas comme ça (╯°□°）╯
│
╰──────⌾⋅ ⌾ ⋅⌾──────╯`, event.threadID);
        } catch (err) {
          console.error("Erreur anti-départ:", err);
        }
      }
    }
  }
};
