const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "config.json");
let config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

function writeConfig(newConfig) {
  fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2), "utf-8");
  config = newConfig;
}

module.exports = {
  config: {
    name: "setprefix",
    aliases: ["prefix", "changeprefix"],
    version: "1.1",
    author: "Octavio Wina",
    role: 1,
    shortDescription: "Change le préfixe du bot en direct",
    longDescription: "Cette commande permet à un administrateur de changer le préfixe immédiatement",
    category: "settings"
  },
  onMessage: async ({ message, args, api, global }) => {
    if (!args[0]) {
      return api.sendMessage("╔═══ ⚠️ Erreur\n║ Veuillez indiquer le nouveau préfixe.\n║ Ex: !setprefix ?\n╚═══", message.threadID);
    }

    const newPrefix = args[0];

    if (config.changePrefix.enable && (!config.changePrefix.allowedRoles.includes(message.senderID))) {
      return api.sendMessage("╔═══ ⚠️ Interdit\n║ Vous n'êtes pas autorisé à changer le préfixe.\n╚═══", message.threadID);
    }

    config.prefix = newPrefix;
    writeConfig(config);

    if (global && typeof global.prefix !== "undefined") {
      global.prefix = newPrefix;
    }

    api.sendMessage(`╔═══ ✅ Succès\n║ Préfixe du bot changé en direct : ${newPrefix}\n╚═══`, message.threadID);
  }
};
