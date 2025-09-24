const}, []);
form.attachment = (await Promise.allSettled(attachments))
  .filter(({ status }) => status == "fulfilled")
  .map(({ value }) => value);

const groupName = "DarkMode Realm";

const welcomeMessages = [
  `🖤✨ Bienvenue à toi ${event.userName} dans notre groupe ${groupName}. Je te souhaite une journée pleine de mystères et d'aventures 🌑⚡`,
  `🌌 Bienvenue à toi ${event.userName} dans notre groupe ${groupName}. Que ton voyage dans l’ombre soit inoubliable 🕶️`,
  `⚡ Bienvenue à toi ${event.userName} dans notre groupe ${groupName}. Je te souhaite une journée sombre mais inspirante 🖤✨`,
  `🌑 Bienvenue à toi ${event.userName} dans notre groupe ${groupName}. Que la nuit illumine ton chemin 🔮`,
  `🖤 Bienvenue à toi ${event.userName} dans notre groupe ${groupName}. Je te souhaite une journée pleine d’énergie dark 🌌`,
  `🌒 Bienvenue à toi ${event.userName} dans notre groupe ${groupName}. Puisses-tu découvrir des secrets cachés dans l’ombre 🖤`,
  `🌘 Bienvenue à toi ${event.userName} dans notre groupe ${groupName}. Que chaque instant passé ici soit une expérience unique ⚡`,
  `🕶️ Bienvenue à toi ${event.userName} dans notre groupe ${groupName}. Prépare-toi à explorer les profondeurs du dark mode 🌑`,
  `🔮 Bienvenue à toi ${event.userName} dans notre groupe ${groupName}. Je te souhaite une journée où l’obscurité devient lumière 🌌`,
  `⚔️ Bienvenue à toi ${event.userName} dans notre groupe ${groupName}. Que la force du dark mode t’accompagne toujours 🖤`,
  `🌑 Bienvenue ${event.userName}. Ici ${groupName}, nous honorons l’obscurité et la force. Puisses-tu y trouver ta voie.`,
  `🖤 Bienvenue à toi ${event.userName} dans ${groupName}. Que ton voyage soit mystérieux et puissant.`,
  `✨ Bienvenue ${event.userName}, l’ombre t’accueille dans ${groupName}. Prépare-toi à découvrir l’inconnu.`,
  `🌌 Bienvenue à toi ${event.userName} dans ${groupName}. La nuit est ton guide, et l’obscurité ton alliée.`,
  `⚡ Bienvenue ${event.userName}. Ici dans ${groupName}, l’énergie obscure est reine.`,
  `🔮 Bienvenue à toi ${event.userName}. Que ton passage par ${groupName} soit gravé dans l’ombre éternelle.`,
  `🕶️ Salut ${event.userName}, bienvenue dans ${groupName}. Le style dark t’ouvre ses portes.`,
  `🌑 Bienvenue ${event.userName}, tu entres dans un lieu où l’obscurité est lumière.`,
  `🖤 Bienvenue ${event.userName} dans ${groupName}. Que la force sombre t’accompagne.`,
  `⚔️ Bienvenue ${event.userName}, prépare-toi à un voyage sans retour dans ${groupName}.`,
  `🌒 Bienvenue ${event.userName} dans ${groupName}. L’ombre t’attend.`,
  `🌘 Bienvenue ${event.userName}, laisse la nuit guider tes pas dans ${groupName}.`,
  `🖤 Bienvenue ${event.userName}, que ton cœur batte au rythme du dark mode dans ${groupName}.`,
  `🌌 Bienvenue ${event.userName}, l’obscurité t’accueille dans ${groupName}.`,
  `✨ Bienvenue ${event.userName}, tu es désormais un élément du royaume ${groupName}.`,
  `⚡ Bienvenue ${event.userName}, entre et découvre les secrets de ${groupName}.`,
  `🔮 Bienvenue ${event.userName}, la magie obscure de ${groupName} t’engloutit.`,
  `🕶️ Bienvenue ${event.userName}, sois prêt pour une expérience dark inoubliable.`,
  `🌑 Bienvenue ${event.userName}, que ton chemin dans ${groupName} soit puissant.`,
  `🖤 Bienvenue ${event.userName}, la nuit t’accueille avec passion.`,
  `⚔️ Bienvenue ${event.userName}, que la force obscure soit avec toi.`,
  `🌒 Bienvenue ${event.userName}, découvre le mystère de ${groupName}.`,
  `🌘 Bienvenue ${event.userName}, plonge dans l’ombre infinie.`,
  `🖤 Bienvenue ${event.userName}, sois l’ombre qui éclaire ${groupName}.`,
  `🌌 Bienvenue ${event.userName}, laisse-toi guider par la nuit.`,
  `✨ Bienvenue ${event.userName}, ton voyage dark commence ici.`,
  `⚡ Bienvenue ${event.userName}, que l’énergie obscure t’inspire.`,
  `🔮 Bienvenue ${event.userName}, l’ombre t’ouvre ses portes.`,
  `🕶️ Bienvenue ${event.userName}, sois prêt à explorer l’inconnu.`,
  `🌑 Bienvenue ${event.userName}, que ton cœur batte au rythme du dark mode.`,
  `🖤 Bienvenue ${event.userName}, prépare-toi pour une expérience unique.`,
  `⚔️ Bienvenue ${event.userName}, sois l’ombre qui guide ${groupName}.`,
  `🌒 Bienvenue ${event.userName}, la nuit est ton alliée.`,
  `🌘 Bienvenue ${event.userName}, découvre l’univers obscur.`,
  `🖤 Bienvenue ${event.userName}, que ton passage dans ${groupName} soit éternel.`,
  `🌌 Bienvenue ${event.userName}, la force du dark mode t’accompagne.`,
  `✨ Bienvenue ${event.userName}, sois l’étoile dans la nuit.`,
  `⚡ Bienvenue ${event.userName}, laisse l’ombre te guider.`,
  `🔮 Bienvenue ${event.userName}, entre dans ${groupName} et découvre la puissance obscure.`,
  `🕶️ Bienvenue ${event.userName}, sois l’ombre immortelle de ${groupName}.`,
  `🌑 Bienvenue ${event.userName}, le royaume de l’ombre s’ouvre pour toi.`,
  `🖤 Bienvenue ${event.userName}, laisse-toi envoûter par l’obscurité.`,
  `⚔️ Bienvenue ${event.userName}, que ta quête commence ici et maintenant.`,
  `🌒 Bienvenue ${event.userName}, plonge dans un univers infini.`,
  `🌘 Bienvenue ${event.userName}, que chaque pas soit un mystère.`,
  `🖤 Bienvenue ${event.userName}, sois la lumière dans les ténèbres.`,
  `🌌 Bienvenue ${event.userName}, découvre l’âme du dark mode.`,
  `✨ Bienvenue ${event.userName}, ouvre les portes de l’ombre.`,
  `⚡ Bienvenue ${event.userName}, laisse l’énergie obscure t’envahir.`,
  `🔮 Bienvenue ${event.userName}, sois prêt à vivre l’inconnu.`,
  `🕶️ Bienvenue ${event.userName}, l’aventure dark commence maintenant.`,
  `🌑 Bienvenue ${event.userName}, que la nuit guide tes pas.`,
  `🖤 Bienvenue ${event.userName}, sois l’écho dans l’obscurité.`,
  `⚔️ Bienvenue ${event.userName}, prépare-toi à l’infini.`,
  `🌒 Bienvenue ${event.userName}, que l’ombre soit ton alliée.`,
  `🌘 Bienvenue ${event.userName}, découvre la force cachée.`,
  `🖤 Bienvenue ${event.userName}, sois l’âme du royaume sombre.`,
  `🌌 Bienvenue ${event.userName}, entre dans l’ère du dark mode.`,
  `✨ Bienvenue ${event.userName}, sois l’étoile noire.`,
  `⚡ Bienvenue ${event.userName}, que ton énergie soit obscure.`,
  `🔮 Bienvenue ${event.userName}, sois l’élu de l’ombre.`,
  `🕶️ Bienvenue ${event.userName}, le royaume sombre t’accueille.`
];

const extraDarkEffects = [
  "🌑 Nuit éternelle.",
  "🖤 Énergie obscure.",
  "⚡ Puissance infinie.",
  "🔮 Vision obscure.",
  "🌌 Voyage dans l’ombre.",
  "🕶️ Mystère sans fin.",
  "✨ Éclat dans l’obscurité.",
  "⚔️ Force obscure.",
  "🌒 Ombre profonde.",
  "🌘 Secret nocturne.",
  "🖤 Ombres silencieuses.",
  "🌌 Horizon obscur.",
  "🔮 Sagesse obscure.",
  "⚡ Flamme noire.",
  "🕶️ Crépuscule éternel."
];

const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
const randomEffect = extraDarkEffects[Math.floor(Math.random() * extraDarkEffects.length)];

form.body = `
━━━━━━━━━━━━━━━━━━
🖤✨ 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗗𝗔𝗥𝗞𝗠𝗢𝗗𝗘
━━━━━━━━━━━━━━━━━━

${randomWelcome}

━━━━━━━━━━━━━━━━━━
${randomEffect}
━━━━━━━━━━━━━━━━━━
💀 ${event.userName}, sois prêt à plonger dans l'obscurité.
`;

message.send(form);
delete global.temp.welcomeEvent[threadID];
}, 1500);
};
}
}; 
