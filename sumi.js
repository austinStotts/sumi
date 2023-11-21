let ts = require("./t.js");
let { Client, GatewayIntentBits } = require("discord.js");
let client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

require("dotenv").config(); 
const AWS = require("aws-sdk");
AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.ACCESSKEY,
  secretAccessKey: process.env.SECRETACCESSKEY,
});

let ddb = new AWS.DynamoDB.DocumentClient();

let getStats = async (guildid) => {
  ddb.get({TableName: "sumi", Key: { 'guildid': guildid }}, (error, data) => {
    if(error) {
      console.log(error);
      console.log("ERROR\n\n\n")
    } else {
      return data;
    }
  })
}

let makeGuild = (guild) => {
    ddb.put({
        TableName: "sumi",
        Item: {
            "guildid": guild.id,
            "guildicon": guild.icon,
            "guildname": guild.name,
            "numberOfHellos": 0,
            "numberOfGoodbyes": 0,
            "numberOfHaikus": 0,
            "numberOfLinks": 0
        }
    }, (error, response) => {
        if(error) { console.log(error) }
        else { console.log("make new guild") }
    })
}

let addHello = (guild) => {
  ddb.get({
    TableName: "sumi", 
    Key: { "guildid": guild.id }},
    (error, data) => {
      if(error) { console.log(error) }
      else { 
        if(data.Item == undefined) {
            makeGuild(guild);
        } else {
            data.Item.numberOfHellos += 1;
            ddb.put({
            TableName: "sumi",
            Item: data.Item
            }, (error, response) => {
            if(error) { console.log(error) }
            else { console.log(response, "RESPONSE") }
            })
        }
      }
  })
}

let addGoodbye = (guild) => {
  ddb.get({
    TableName: "sumi", 
    Key: { "guildid": guild.id }},
    (error, data) => {
      if(error) { console.log(error) }
      else { 
        if(data.Item == undefined) {
            makeGuild(guild);
        } else {
            data.Item.numberOfGoodbyes += 1;
            ddb.put({
            TableName: "sumi",
            Item: data.Item
            }, (error, response) => {
            if(error) { console.log(error) }
            else { console.log(response, "RESPONSE") }
            })
        }
      }
  })
}

let addLink = (guild) => {
  ddb.get({
    TableName: "sumi", 
    Key: { "guildid": guild.id }},
    (error, data) => {
        if(error) { console.log(error) }
      else { 
        if(data.Item == undefined) {
            makeGuild(guild);
        } else {
            data.Item.numberOfLinks += 1;
            ddb.put({
            TableName: "sumi",
            Item: data.Item
            }, (error, response) => {
            if(error) { console.log(error) }
            else { console.log(response, "RESPONSE") }
            })
        }
      }
  })
}

let addHaiku = (guild) => {
  ddb.get({
    TableName: "sumi", 
    Key: { "guildid": guild.id }},
    (error, data) => {
        if(error) { console.log(error) }
      else { 
        if(data.Item == undefined) {
            makeGuild(guild);
        } else {
            data.Item.numberOfHaikus += 1;
            ddb.put({
            TableName: "sumi",
            Item: data.Item
            }, (error, response) => {
            if(error) { console.log(error) }
            else { console.log(response, "RESPONSE") }
            })
        }
      }
  })
}

let faces = ["(⁀ᗢ⁀)","\\(^ヮ^)/","(„• ᴗ •„)","	⸜(⸝⸝⸝´꒳`⸝⸝⸝)⸝","( = ⩊ = )","(♡˙︶˙♡)","♡＼(￣▽￣)／♡","(´꒳`)♡","	\(〇_ｏ)/","╮(︶▽︶)╭","(*°ｰ°)ﾉ","(⊃｡•́‿•̀｡)⊃","(っ ᵔ◡ᵔ)っ","(｡•̀ᴗ-)✧","	|ʘ‿ʘ)╯","☆ﾐ(o*･ω･)ﾉ","	(=^･ｪ･^=)","U・ᴥ・U","	૮₍ ˶• ༝ •˶ ₎ა","	(; ・_・)――――C","( ˘▽˘)っ♨","	-●●●-ｃ(・・ )","( ・・)つ-●●●","( o˘◡˘o) ┌iii┐","	(〜￣▽￣)〜","(~‾▽‾)~","✺◟( • ω • )◞✺","	( ͠° ͟ʖ ͡°)","( . •́ _ʖ •̀ .)","(⌐■_■)","ଘ(੭ˊᵕˋ)੭* ੈ✩‧₊˚","(ノ°∀°)ノ⌒･*:.｡. .｡.:*･゜ﾟ･*☆","	(/￣ー￣)/~~☆’.･.･:★’.･.･:☆"]
let greeting = ["haii", "hi", "おはよう!", "おやすみ...", "こんにちは", "hey", "hello!", "greetings!", "Hola", "hi", "haaaaay", "hewwo", "HEY!", "hiiii", "boo!"];
let leaving = ["bye", "see you!", "see you", "bye bye", "goodnight!", "goodnight", "gn", "gn!", "sweet dreams"];
let adjs = ["great", "amazing", "cool", "poggers", "epic", "sick ass", "dang good", "good", "super", "super duper", "astonishing", "brilliant"]

client.on("ready", () => {
    console.log("sumi ready!");
})


client.on("messageCreate", async (message) => {
    // console.log(message); // uncomment to print all messages
    if (message.content.startsWith("https://x.com") || message.content.startsWith("https://twitter.com")) {
        let data = message.content.split(".com")[1];
        message.channel.send(`https://vxtwitter.com${data}`);
        addLink(message.channel.guild);
    }
    else if(message.content.toLowerCase().startsWith("hey sumi") || message.content.toLowerCase().startsWith("hello sumi") || message.content.toLowerCase().startsWith("hi sumi") || message.content.toLowerCase().startsWith("wsg sumi") || message.content.toLowerCase().startsWith("gm sumi")) {
        message.react("💖");
        message.reply(`${greeting[Math.floor(Math.random()*greeting.length)]} ${faces[Math.floor(Math.random()*faces.length)]}`);
        addHello(message.channel.guild);
    }
    else if(message.content.toLowerCase().startsWith("bye sumi") || message.content.toLowerCase().startsWith("goodnight sumi") || message.content.toLowerCase().startsWith("gn sumi") || message.content.toLowerCase().startsWith("peace sumi")) {
        message.react("💖");
        message.reply(`${leaving[Math.floor(Math.random()*leaving.length)]} ${faces[Math.floor(Math.random()*faces.length)]}`);
        addGoodbye(message.channel.guild);
    } 
    else if(message.author.username == "HaikuBot" && message.author.bot && message.embeds.length > 0) {
        setTimeout(() => { message.channel.send(`${adjs[Math.floor(Math.random()*adjs.length)]} haiku`); }, 500);
        addHaiku(message.channel.guild);
    } else {
        if(message.content.toLowerCase().startsWith("sumi")) {
            if(message.content.split(" ")[1] == "stats") {
                let stats = await getStats(message.channel.guildId);
                message.channel.send(`
                sumi stats for: ${stats.guildname}

                number of hellos: ${stats.numberOfHellos}
                number of hellos: ${stats.numberOfGoodbyes}
                number of hellos: ${stats.numberOfLinks}
                number of hellos: ${stats.numberOfHaikus}
                `)
            }
        }
    }
})

client.login(ts);

// code written by steve - austin stotts
// please dont fuck with the token