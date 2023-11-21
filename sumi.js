let ts = require("./t.js");
let { Client, GatewayIntentBits } = require("discord.js");
let client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.on("ready", () => {
    console.log("sumi ready!")
})

client.on("messageCreate", async (message) => {
    if (message.content.startsWith("https://x.com") || message.content.startsWith("https://twitter.com")) {
        let data = message.content.split("com")[1];
        message.channel.send(`https://vxtwitter.com${data}`);
    }
    else if(message.content.toLowerCase().startsWith("hey sumi") || message.content.toLowerCase().startsWith("hello sumi") || message.content.toLowerCase().startsWith("hi sumi") || message.content.toLowerCase().startsWith("wsg sumi")) {
        message.react("💖");
        message.reply(`hii („• ᴗ •„)`);
    }
})

client.login(ts);

// code written by steve - austin stotts
// please dont fuck with the token