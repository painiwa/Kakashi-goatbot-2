const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
        config: {
                name: "admin",
                version: "1.6",
                author: "Messie Osango", 
                countDown: 5,
                role: 2,
                description: {
                        vi: "Thêm, xóa, sửa quyền admin",
                        fr: "Ajouter, supprimer ou modifier les administrateurs" 
                },
                category: "box chat",
                guide: {
                        vi: '   {pn} [add | -a] <uid | @tag>: Thêm quyền admin cho người dùng'
                                + '\n          {pn} [remove | -r] <uid | @tag>: Xóa quyền admin của người dùng'
                                + '\n          {pn} [list | -l]: Liệt kê danh sách admin',
                        fr: '   {pn} [add | -a] <uid | @tag>: Ajouter un administrateur'
                                + '\n          {pn} [remove | -r] <uid | @tag>: Retirer un administrateur'
                                + '\n          {pn} [list | -l]: Liste des administrateurs'
                }
        },

        langs: {
                vi: {
                        added: "✅ | Đã thêm quyền admin cho %1 người dùng:\n%2",
                        alreadyAdmin: "\n⚠️ | %1 người dùng đã có quyền admin từ trước rồi:\n%2",
                        missingIdAdd: "⚠️ | Vui lòng nhập ID hoặc tag người dùng muốn thêm quyền admin",
                        removed: "✅ | Đã xóa quyền admin của %1 người dùng:\n%2",
                        notAdmin: "⚠️ | %1 người dùng không có quyền admin:\n%2",
                        missingIdRemove: "⚠️ | Vui lòng nhập ID hoặc tag người dùng muốn xóa quyền admin",
                        listAdmin: "👑 | Danh sách admin:\n%1"
                },
                fr: { 
                        added: "╭───⌾⋅ 𝐾𝐴𝐾𝐴𝑆𝐻𝐼 𝐵𝑜𝑡 ⋅⌾───╮\n│\n│   ✅ %1 administrateur(s) ajouté(s):\n│   %2\n│\n╰──────⌾⋅ ⌾ ⋅⌾──────╯",
                        alreadyAdmin: "\n╭───⌾⋅ 𝐴𝑉𝐸𝑅𝑇𝐼𝑆𝑆𝐸𝑀𝐸𝑁𝑇 ⋅⌾───╮\n│\n│   ⚠️ %1 utilisateur(s) déjà admin:\n│   %2\n│\n╰──────⌾⋅ ⌾ ⋅⌾──────╯",
                        missingIdAdd: "╭───⌾⋅ 𝐸𝑅𝑅𝐸𝑈𝑅 ⋅⌾───╮\n│\n│   ⚠️ Veuillez spécifier un ID ou taguer un utilisateur\n│\n╰──────⌾⋅ ⌾ ⋅⌾──────╯",
                        removed: "╭───⌾⋅ 𝐾𝐴𝐾𝐴𝑆𝐻𝐼 𝐵𝑜𝑡 ⋅⌾───╮\n│\n│   ✅ %1 administrateur(s) retiré(s):\n│   %2\n│\n╰──────⌾⋅ ⌾ ⋅⌾──────╯",
                        notAdmin: "\n╭───⌾⋅ 𝐴𝑉𝐸𝑅𝑇𝐼𝑆𝑆𝐸𝑀𝐸𝑁𝑇 ⋅⌾───╮\n│\n│   ⚠️ %1 utilisateur(s) non administrateur:\n│   %2\n│\n╰──────⌾⋅ ⌾ ⋅⌾──────╯",
                        missingIdRemove: "╭───⌾⋅ 𝐸𝑅𝑅𝐸𝑈𝑅 ⋅⌾───╮\n│\n│   ⚠️ Veuillez spécifier un ID ou taguer un utilisateur\n│\n╰──────⌾⋅ ⌾ ⋅⌾──────╯",
                        listAdmin: "╭──────⌾⋅ 𝐴𝐷𝑀𝐼𝑁𝑆 ⋅⌾──────╮\n│\n│   👑 Liste des administrateurs:\n│   %1\n│\n╰──────⌾⋅ ⌾ ⋅⌾──────╯"
                }
        },

        onStart: async function ({ message, args, usersData, event, getLang }) {
                switch (args[0]) {
                        case "add":
                        case "-a": {
                                if (args[1]) {
                                        let uids = [];
                                        if (Object.keys(event.mentions).length > 0)
                                                uids = Object.keys(event.mentions);
                                        else if (event.messageReply)
                                                uids.push(event.messageReply.senderID);
                                        else
                                                uids = args.filter(arg => !isNaN(arg));
                                        const notAdminIds = [];
                                        const adminIds = [];
                                        for (const uid of uids) {
                                                if (config.adminBot.includes(uid))
                                                        adminIds.push(uid);
                                                else
                                                        notAdminIds.push(uid);
                                        }

                                        config.adminBot.push(...notAdminIds);
                                        const getNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
                                        writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
                                        return message.reply(
                                                (notAdminIds.length > 0 ? getLang("added", notAdminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
                                                + (adminIds.length > 0 ? getLang("alreadyAdmin", adminIds.length, adminIds.map(uid => `• ${uid}`).join("\n")) : "")
                                        );
                                }
                                else
                                        return message.reply(getLang("missingIdAdd"));
                        }
                        case "remove":
                        case "-r": {
                                if (args[1]) {
                                        let uids = [];
                                        if (Object.keys(event.mentions).length > 0)
                                                uids = Object.keys(event.mentions)[0];
                                        else
                                                uids = args.filter(arg => !isNaN(arg));
                                        const notAdminIds = [];
                                        const adminIds = [];
                                        for (const uid of uids) {
                                                if (config.adminBot.includes(uid))
                                                        adminIds.push(uid);
                                                else
                                                        notAdminIds.push(uid);
                                        }
                                        for (const uid of adminIds)
                                                config.adminBot.splice(config.adminBot.indexOf(uid), 1);
                                        const getNames = await Promise.all(adminIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
                                        writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
                                        return message.reply(
                                                (adminIds.length > 0 ? getLang("removed", adminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
                                                + (notAdminIds.length > 0 ? getLang("notAdmin", notAdminIds.length, notAdminIds.map(uid => `• ${uid}`).join("\n")) : "")
                                        );
                                }
                                else
                                        return message.reply(getLang("missingIdRemove"));
                        }
                        case "list":
                        case "-l": {
                                const getNames = await Promise.all(config.adminBot.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
                                return message.reply(getLang("listAdmin", getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")));
                        }
                        default:
                                return message.SyntaxError();
                }
        }
};
