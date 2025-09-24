  module.exports = {
  name: "welcome",
  event: async function ({ event, api }) {
    const { threadID, senderID } = event;

    setTimeout(async () => {
      try {
        const userInfo = await api.getUserInfo(senderID);
        const threadInfo = await api.getThreadInfo(threadID);

        const userName = userInfo[senderID]?.name || "Invité";
        const groupName = threadInfo.threadName || "notre groupe";

        let form = {};
        if (global.temp?.welcomeEvent?.[threadID]) {
          const attachments = global.temp.welcomeEvent[threadID];
          form.attachment = (
            await Promise.allSettled(attachments)
          )
            .filter(({ status }) => status === "fulfilled")
            .map(({ value }) => value);
        }

        const kakashiFrame1 = `
╔═════════════════════════════╗
║ 🌸 Salut ${userName} 🌸      ║
║ Bienvenue à toi dans        ║
║ notre groupe ${groupName} ║
║ 🖤 - Kakashi Bot - 🖤         ║
╚═════════════════════════════╝
`;

        const kakashiFrame2 = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🥷 Salut ${userName} 🥷       ┃
┃ Bienvenue dans               ┃
┃ ${groupName}                 ┃
┃ ⚔️ Kakashi veille sur toi ⚔️ ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
`;

        const kakashiFrame3 = `
╭─────────────✦────────────╮
│ 🌸 Salut ${userName} 🌸     │
│ Bienvenue à toi dans      │
│ notre groupe ${groupName} │
│ 💫 Kakashi te souhaite    │
│ une journée pleine de paix│
╰─────────────✦────────────╯
`;

        const frames = [kakashiFrame1, kakashiFrame2, kakashiFrame3];
        const randomFrame = frames[Math.floor(Math.random() * frames.length)];

        await api.sendMessage({
          body: randomFrame + "\n💫 Passe une excellente journée !",
          attachment: form.attachment || []
        }, threadID);

        delete global.temp.welcomeEvent[threadID];

      } catch (error) {
        console.error(error);
      }
    }, 1500);
  }
};
