let ts = require("./t.js");
const token = ts.one + ts.two + ts.three;
let { Client, GatewayIntentBits } = require("discord.js");
let client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        // GatewayIntentBits.GuildMembers,
    ]
});

client.on("ready", () => {
    console.log("sumi ready!")
})

client.login(token)