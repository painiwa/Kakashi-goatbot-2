const axios = require("axios");
const fs = require("fs-extra");
const execSync = require("child_process").execSync;
const dirBootLogTemp = `${__dirname}/tmp/rebootUpdated.txt`;

module.exports = {
  config: {
    name: "update",
    version: "1.5",
    author: "𝑀𝐸𝑆𝑆𝐼𝐸 𝑂𝑆𝐴𝑁𝐺𝑂",
    role: 2,
    description: {
      en: "╭──⌾⋅ 𝐾𝐴𝐾𝐴𝑆𝐻𝐼 𝐵𝑜𝑡 ⋅⌾──╮\n│\n│   Check for and install updates\n│   for the chatbot\n│\n╰──────⌾⋅ ⌾ ⋅⌾──────╯"
    },
    category: "owner",
    guide: {
      en: "╭──⌾⋅ 𝐾𝐴𝐾𝐴𝑆𝐻𝐼 𝐵𝑜𝑡 ⋅⌾──╮\n│\n│   {pn}\n│\n╰──────⌾⋅ ⌾ ⋅⌾──────╯"
    }
  },

  langs: {
    en: {
      noUpdates: "╭──⌾⋅ 𝐾𝐴𝐾𝐴𝑆𝐻𝐼 𝐵𝑜𝑡 ⋅⌾──╮\n│\n│   ✅ | You are using the latest\n│   version of GoatBot V2 (v%1)\n│\n╰──────⌾⋅ ⌾ ⋅⌾──────╯",
      updatePrompt: "╭──⌾⋅ 𝐾𝐴𝐾𝐴𝑆𝐻𝐼 𝐵𝑜𝑡 ⋅⌾──╮\n│\n│   💫 | You are using version %1\n│   New version %2 available\n│\n│   ⬆️ | Files to be updated:\n│   %3%4\n│\n│   ℹ️ | Details at:\n│   https://github.com/ntkhang03/\n│   Goat-Bot-V2/commits/main\n│\n│   💡 | React to confirm update\n│\n╰──────⌾⋅ ⌾ ⋅⌾──────╯",
      fileWillDelete: "\n│   🗑️ | Files to be deleted:\n│   %1",
      andMore: " ...and %1 more files",
      updateConfirmed: "╭──⌾⋅ 𝐾𝐴𝐾𝐴𝑆𝐻𝐼 𝐵𝑜𝑡 ⋅⌾──╮\n│\n│   🚀 | Update confirmed\n│   Updating...\n│\n╰──────⌾⋅ ⌾ ⋅⌾──────╯",
      updateComplete: "╭──⌾⋅ 𝐾𝐴𝐾𝐴𝑆𝐻𝐼 𝐵𝑜𝑡 ⋅⌾──╮\n│\n│   ✅ | Update complete\n│   Reply 'yes' or 'y' to\n│   restart the bot now\n│\n╰──────⌾⋅ ⌾ ⋅⌾──────╯",
      updateTooFast: "╭──⌾⋅ 𝐾𝐴𝐾𝐴𝑆𝐻𝐼 𝐵𝑜𝑡 ⋅⌾──╮\n│\n│   ⭕ Update too recent\n│   (%1m %2s ago)\n│   Try again in %3m %4s\n│\n╰──────⌾⋅ ⌾ ⋅⌾──────╯",
      botWillRestart: "╭──⌾⋅ 𝐾𝐴𝐾𝐴𝑆𝐻𝐼 𝐵𝑜𝑡 ⋅⌾──╮\n│\n│   🔄 | Restarting bot...\n│\n╰──────⌾⋅ ⌾ ⋅⌾──────╯"
    }
  },

  onLoad: async function ({ api }) {
    if (fs.existsSync(dirBootLogTemp)) {
      const threadID = fs.readFileSync(dirBootLogTemp, "utf-8");
      fs.removeSync(dirBootLogTemp);
      api.sendMessage("╭──⌾⋅ 𝐾𝐴𝐾𝐴𝑆𝐻𝐼 𝐵𝑜𝑡 ⋅⌾──╮\n│\n│   The chatbot has been\n│   successfully restarted\n│\n╰──────⌾⋅ ⌾ ⋅⌾──────╯", threadID);
    }
  },

  onStart: async function ({ message, getLang, commandName, event }) {
    try {
      const { data: { version } } = await axios.get("https://raw.githubusercontent.com/ntkhang03/Goat-Bot-V2/main/package.json");
      const { data: versions } = await axios.get("https://raw.githubusercontent.com/ntkhang03/Goat-Bot-V2/main/versions.json");

      const currentVersion = require("../../package.json").version;
      if (compareVersion(version, currentVersion) < 1)
        return message.reply(getLang("noUpdates", currentVersion));

      const newVersions = versions.slice(versions.findIndex(v => v.version == currentVersion) + 1);

      let fileWillUpdate = [...new Set(newVersions.map(v => Object.keys(v.files || {})).flat())]
        .sort()
        .filter(f => f?.length);
      const totalUpdate = fileWillUpdate.length;
      fileWillUpdate = fileWillUpdate
        .slice(0, 10)
        .map(file => ` - ${file}`).join("\n");

      let fileWillDelete = [...new Set(newVersions.map(v => Object.keys(v.deleteFiles || {}).flat()))]
        .sort()
        .filter(f => f?.length);
      const totalDelete = fileWillDelete.length;
      fileWillDelete = fileWillDelete
        .slice(0, 10)
        .map(file => ` - ${file}`).join("\n");

      message.reply(
        getLang(
          "updatePrompt",
          currentVersion,
          version,
          fileWillUpdate + (totalUpdate > 10 ? "\n" + getLang("andMore", totalUpdate - 10) : ""),
          totalDelete > 0 ? "\n" + getLang(
            "fileWillDelete",
            fileWillDelete + (totalDelete > 10 ? "\n" + getLang("andMore", totalDelete - 10) : "")
          ) : ""
        ), (err, info) => {
          if (err)
            return console.error(err);

          global.GoatBot.onReaction.set(info.messageID, {
            messageID: info.messageID,
            threadID: info.threadID,
            authorID: event.senderID,
            commandName
          });
        });
    } catch (error) {
      console.error(error);
      message.reply("╭──⌾⋅ 𝐾𝐴𝐾𝐴𝑆𝐻𝐼 𝐵𝑜𝑡 ⋅⌾──╮\n│\n│   ❌ | Update check failed\n│\n╰──────⌾⋅ ⌾ ⋅⌾──────╯");
    }
  },

  onReaction: async function ({ message, getLang, Reaction, event, commandName }) {
    const { userID } = event;
    if (userID != Reaction.authorID)
      return;

    try {
      const { data: lastCommit } = await axios.get('https://api.github.com/repos/ntkhang03/Goat-Bot-V2/commits/main');
      const lastCommitDate = new Date(lastCommit.commit.committer.date);
      
      if (new Date().getTime() - lastCommitDate.getTime() < 5 * 60 * 1000) {
        const minutes = Math.floor((new Date().getTime() - lastCommitDate.getTime()) / 1000 / 60);
        const seconds = Math.floor((new Date().getTime() - lastCommitDate.getTime()) / 1000 % 60);
        const minutesCooldown = Math.floor((5 * 60 * 1000 - (new Date().getTime() - lastCommitDate.getTime())) / 1000 / 60);
        const secondsCooldown = Math.floor((5 * 60 * 1000 - (new Date().getTime() - lastCommitDate.getTime())) / 1000 % 60);
        return message.reply(getLang("updateTooFast", minutes, seconds, minutesCooldown, secondsCooldown));
      }

      await message.reply(getLang("updateConfirmed"));
      
      execSync("node update", {
        stdio: "inherit"
      });
      fs.writeFileSync(dirBootLogTemp, event.threadID);

      message.reply(getLang("updateComplete"), (err, info) => {
        if (err)
          return console.error(err);

        global.GoatBot.onReply.set(info.messageID, {
          messageID: info.messageID,
          threadID: info.threadID,
          authorID: event.senderID,
          commandName
        });
      });
    } catch (error) {
      console.error(error);
      message.reply("╭──⌾⋅ 𝐾𝐴𝐾𝐴𝑆𝐻𝐼 𝐵𝑜𝑡 ⋅⌾──╮\n│\n│   ❌ | Update failed\n│\n╰──────⌾⋅ ⌾ ⋅⌾──────╯");
    }
  },

  onReply: async function ({ message, getLang, event }) {
    if (['yes', 'y'].includes(event.body?.toLowerCase())) {
      await message.reply(getLang("botWillRestart"));
      process.exit(2);
    }
  }
};

function compareVersion(version1, version2) {
  const v1 = version1.split(".");
  const v2 = version2.split(".");
  for (let i = 0; i < 3; i++) {
    if (parseInt(v1[i]) > parseInt(v2[i]))
      return 1;
    if (parseInt(v1[i]) < parseInt(v2[i]))
      return -1;
  }
  return 0;
}
