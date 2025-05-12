module.exports = {
  config: {
    name: "kick",
    version: "1.3",
    author: "𝑀𝐸𝑆𝑆𝐼𝐸 𝑂𝑆𝐴𝑁𝐺𝑂",
    countDown: 5,
    role: 1,
    description: {
      en: "╭──⌾⋅ 𝐾𝐴𝐾𝐴𝑆𝐻𝐼 𝐵𝑜𝑡 ⋅⌾──╮\n│\n│   Kick member out of chat box\n│\n╰──────⌾⋅ ⌾ ⋅⌾──────╯"
    },
    category: "box chat",
    guide: {
      en: "╭──⌾⋅ 𝐾𝐴𝐾𝐴𝑆𝐻𝐼 𝐵𝑜𝑡 ⋅⌾──╮\n│\n│   {pn} @tags: use to kick members who are tagged\n│\n╰──────⌾⋅ ⌾ ⋅⌾──────╯"
    }
  },

  langs: {
    en: {
      needAdmin: "╭──⌾⋅ 𝐾𝐴𝐾𝐴𝑆𝐻𝐼 𝐵𝑜𝑡 ⋅⌾──╮\n│\n│   Veuillez ajouter un administrateur\n│   pour le bot avant d'utiliser\n│   cette fonctionnalité\n│\n╰──────⌾⋅ ⌾ ⋅⌾──────╯"
    }
  },

  onStart: async function ({ message, event, args, threadsData, api, getLang }) {
    const adminIDs = await threadsData.get(event.threadID, "adminIDs");
    if (!adminIDs.includes(api.getCurrentUserID()))
      return message.reply(getLang("needAdmin"));
    
    async function kickAndCheckError(uid) {
      try {
        await api.removeUserFromGroup(uid, event.threadID);
      }
      catch (e) {
        message.reply(getLang("needAdmin"));
        return "ERROR";
      }
    }

    if (!args[0]) {
      if (!event.messageReply)
        return message.SyntaxError();
      await kickAndCheckError(event.messageReply.senderID);
    }
    else {
      const uids = Object.keys(event.mentions);
      if (uids.length === 0)
        return message.SyntaxError();
      if (await kickAndCheckError(uids.shift()) === "ERROR")
        return;
      for (const uid of uids)
        api.removeUserFromGroup(uid, event.threadID);
    }
  }
};
