let ts = require("./t.js");
let { Client, GatewayIntentBits } = require("discord.js");
let client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

let rng = (low=0, high=100) => {

}

let faces = ["(⁀ᗢ⁀)","\\(^ヮ^)/","(„• ᴗ •„)","	⸜(⸝⸝⸝´꒳`⸝⸝⸝)⸝","( = ⩊ = )","(♡˙︶˙♡)","♡＼(￣▽￣)／♡","(´꒳`)♡","	\(〇_ｏ)/","╮(︶▽︶)╭","(*°ｰ°)ﾉ","(⊃｡•́‿•̀｡)⊃","(っ ᵔ◡ᵔ)っ","(｡•̀ᴗ-)✧","	|ʘ‿ʘ)╯","☆ﾐ(o*･ω･)ﾉ","	(=^･ｪ･^=)","U・ᴥ・U","	૮₍ ˶• ༝ •˶ ₎ა","	(; ・_・)――――C","( ˘▽˘)っ♨","	-●●●-ｃ(・・ )","( ・・)つ-●●●","( o˘◡˘o) ┌iii┐","	(〜￣▽￣)〜","(~‾▽‾)~","✺◟( • ω • )◞✺","	( ͠° ͟ʖ ͡°)","( . •́ _ʖ •̀ .)","(⌐■_■)","ଘ(੭ˊᵕˋ)੭* ੈ✩‧₊˚","(ノ°∀°)ノ⌒･*:.｡. .｡.:*･゜ﾟ･*☆","	(/￣ー￣)/~~☆’.･.･:★’.･.･:☆"]
let greeting = ["haii", "hi", "おはよう!", "おやすみ...", "こんにちは", "hey", "hello!", "greetings!", "Hola", "hi", "haaaaay", "hewwo", "HEY!", "hiiii", "boo!"];
let leaving = ["bye", "see you!", "see you", "bye bye", "goodnight!", "goodnight", "gn", "gn!", "sweet dreams"];

client.on("ready", () => {
    console.log("sumi ready!");
})

client.on("messageCreate", async (message) => {
    console.log(message)
    if (message.content.startsWith("https://x.com") || message.content.startsWith("https://twitter.com")) {
        let data = message.content.split(".com")[1];
        message.channel.send(`https://vxtwitter.com${data}`);
    }
    else if(message.content.toLowerCase().startsWith("hey sumi") || message.content.toLowerCase().startsWith("hello sumi") || message.content.toLowerCase().startsWith("hi sumi") || message.content.toLowerCase().startsWith("wsg sumi")) {
        message.react("💖");
        message.reply(`${greeting[Math.floor(Math.random()*greeting.length)]} ${faces[Math.floor(Math.random()*faces.length)]}`);
    }
    else if(message.content.toLowerCase().startsWith("bye sumi") || message.content.toLowerCase().startsWith("goodnight sumi") || message.content.toLowerCase().startsWith("gn sumi") || message.content.toLowerCase().startsWith("peace sumi")) {
        message.react("💖");
        message.reply(`${leaving[Math.floor(Math.random()*leaving.length)]} ${faces[Math.floor(Math.random()*faces.length)]}`);
    } 
    else if(message.author == "HaikuBot") {
        message.channel.send("great haiku");
    }
    // else {
    //     let command = message.content.split(" ");
    //     if(command[0].toLowerCase() == "sumi") {
    //         if(command[1].toLowerCase() == "rng") {
    //             let low = command[2];
    //             let high = command[3];

                
    //         }
    //     }
    // }
})

client.login(ts);

// code written by steve - austin stotts
// please dont fuck with the token