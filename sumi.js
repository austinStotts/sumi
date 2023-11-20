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

client.on("messageCreate", async (message) => {
    // console.log(message)
    if (message.content.startsWith("https://x.com") || message.content.startsWith("https://twitter.com")) {
        let data = message.content.split("com")[1]
        message.reply(`https://vxtwitter.com${data}`);
    }
    else if(message.content.toLowerCase().startsWith("hey sumi") || message.content.toLowerCase().startsWith("hello sumi") || message.content.toLowerCase().startsWith("hi sumi")) {
        message.react("💖");
        message.reply(`hii („• ᴗ •„)`);
    }
 })

client.login(token);