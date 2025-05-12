const moment = require("moment-timezone");

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
    name: "accept",
    aliases: ['acp'],
    version: "1.0",
    author: "messie osango",
    countDown: 8,
    role: 2,
    shortDescription: "Accepter les utilisateurs",
    longDescription: "Gérer les demandes d'amis",
    category: "Utility",
  },

  onReply: async function ({ message, Reply, event, api, commandName }) {
    const { author, listRequest, messageID } = Reply;
    if (author !== event.senderID) return api.sendMessage(formatBox('Commande réservée à l\'expéditeur'), event.threadID);
    const args = event.body.replace(/ +/g, " ").toLowerCase().split(" ");

    clearTimeout(Reply.unsendTimeout);

    const form = {
      av: api.getCurrentUserID(),
      fb_api_caller_class: "RelayModern",
      variables: {
        input: {
          source: "friends_tab",
          actor_id: api.getCurrentUserID(),
          client_mutation_id: Math.round(Math.random() * 19).toString()
        },
        scale: 3,
        refresh_num: 0
      }
    };

    const success = [];
    const failed = [];

    if (args[0] === "add") {
      form.fb_api_req_friendly_name = "FriendingCometFriendRequestConfirmMutation";
      form.doc_id = "3147613905362928";
    }
    else if (args[0] === "del") {
      form.fb_api_req_friendly_name = "FriendingCometFriendRequestDeleteMutation";
      form.doc_id = "4108254489275063";
    }
    else {
      return api.sendMessage(formatBox('Usage: <add | del> <numéro | "all">'), event.threadID, event.messageID);
    }

    let targetIDs = args.slice(1);

    if (args[1] === "all") {
      targetIDs = [];
      const lengthList = listRequest.length;
      for (let i = 1; i <= lengthList; i++) targetIDs.push(i);
    }

    const newTargetIDs = [];
    const promiseFriends = [];

    for (const stt of targetIDs) {
      const u = listRequest[parseInt(stt) - 1];
      if (!u) {
        failed.push(`Numéro ${stt} introuvable`);
        continue;
      }
      form.variables.input.friend_requester_id = u.node.id;
      form.variables = JSON.stringify(form.variables);
      newTargetIDs.push(u);
      promiseFriends.push(api.httpPost("https://www.facebook.com/api/graphql/", form));
      form.variables = JSON.parse(form.variables);
    }

    const lengthTarget = newTargetIDs.length;
    for (let i = 0; i < lengthTarget; i++) {
      try {
        const friendRequest = await promiseFriends[i];
        if (JSON.parse(friendRequest).errors) {
          failed.push(newTargetIDs[i].node.name);
        }
        else {
          success.push(newTargetIDs[i].node.name);
        }
      }
      catch (e) {
        failed.push(newTargetIDs[i].node.name);
      }
    }

    if (success.length > 0) {
      api.sendMessage(formatBox(`${args[0] === 'add' ? 'Acceptés' : 'Refusés'} (${success.length}):\n${success.join("\n")}${failed.length > 0 ? `\n\nÉchecs (${failed.length}):\n${failed.join("\n")}` : ""}`), event.threadID, event.messageID);
    } else {
      api.unsendMessage(messageID);
      return api.sendMessage(formatBox("Réponse invalide"), event.threadID);
    }

    api.unsendMessage(messageID);
  },

  onStart: async function ({ event, api, commandName }) {
    const form = {
      av: api.getCurrentUserID(),
      fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
      fb_api_caller_class: "RelayModern",
      doc_id: "4499164963466303",
      variables: JSON.stringify({ input: { scale: 3 } })
    };
    const listRequest = JSON.parse(await api.httpPost("https://www.facebook.com/api/graphql/", form)).data.viewer.friending_possibilities.edges;
    let msg = "Demandes en attente:\n";
    let i = 0;
    for (const user of listRequest) {
      i++;
      msg += (`\n${i}. Nom: ${user.node.name}`
        + `\nID: ${user.node.id}`
        + `\nLien: ${user.node.url.replace("www.facebook", "fb")}`
        + `\nDate: ${moment(user.time * 1009).tz("Asia/Manila").format("DD/MM/YYYY HH:mm:ss")}\n`);
    }
    api.sendMessage(formatBox(`${msg}\nRépondre avec: <add | del> <numéro | "all">`), event.threadID, (e, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName,
        messageID: info.messageID,
        listRequest,
        author: event.senderID,
        unsendTimeout: setTimeout(() => {
          api.unsendMessage(info.messageID);
        }, this.config.countDown * 20000)
      });
    }, event.messageID);
  }
};
