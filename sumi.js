let ts = require("./t.js");
let { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
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

let updageIconID = (guild) => {
  ddb.get({
    TableName: "sumi", 
    Key: { "guildid": guild.id }},
    (error, data) => {
        if(error) { console.log(error) }
      else { 
        if(data.Item.guildicon != guild.icon) {
          data.Item.guildicon = guild.icon;
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

let faces = ["0.0","<3",":3","(⁀ᗢ⁀)","\\(^ヮ^)/","(„• ᴗ •„)","	⸜(⸝⸝⸝´꒳`⸝⸝⸝)⸝","( = ⩊ = )","(♡˙︶˙♡)","♡＼(￣▽￣)／♡","(´꒳`)♡","	\(〇_ｏ)/","╮(︶▽︶)╭","(*°ｰ°)ﾉ","(⊃｡•́‿•̀｡)⊃","(っ ᵔ◡ᵔ)っ","(｡•̀ᴗ-)✧","	|ʘ‿ʘ)╯","☆ﾐ(o*･ω･)ﾉ","	(=^･ｪ･^=)","U・ᴥ・U","	૮₍ ˶• ༝ •˶ ₎ა","	(; ・_・)――――C","( ˘▽˘)っ♨","	-●●●-ｃ(・・ )","( ・・)つ-●●●","( o˘◡˘o) ┌iii┐","	(〜￣▽￣)〜","(~‾▽‾)~","✺◟( • ω • )◞✺","	( ͠° ͟ʖ ͡°)","( . •́ _ʖ •̀ .)","(⌐■_■)","ଘ(੭ˊᵕˋ)੭* ੈ✩‧₊˚","(ノ°∀°)ノ⌒･*:.｡. .｡.:*･゜ﾟ･*☆","	(/￣ー￣)/~~☆’.･.･:★’.･.･:☆"]
let greeting = ["haii", "hi", "おはよう!", "おやすみ...", "こんにちは", "hey", "hello!", "greetings!", "Hola", "hi", "haaaaay", "hewwo", "HEY!", "hiiii", "boo!", "RAAAAHHH", "erm", "可愛い"];
let leaving = ["bye", "see you!", "see you", "bye bye", "goodnight!", "goodnight", "gn", "gn!", "sweet dreams"];
let adjs = ["great", "amazing", "cool", "poggers", "epic", "sick ass", "dang good", "good", "super", "super duper", "astonishing", "brilliant", "すごい"];
let emojis = ["💕","💓","💞","💖","💗","❤️","🌷","💐","💯","✔️"]


client.on("ready", () => {
    console.log("sumi ready!");
})


client.on("messageCreate", async (message) => {
    updageIconID(message.guild);
    console.log(message.author); // uncomment to print all messages
    if (message.content.startsWith("https://x.com") || message.content.startsWith("https://twitter.com")) {
        let data = message.content.split(".com")[1];
        message.channel.send(`https://vxtwitter.com${data}`);
        addLink(message.channel.guild);
    }
    else if(message.content.toLowerCase().startsWith("hey sumi") || message.content.toLowerCase().startsWith("hello sumi") || message.content.toLowerCase().startsWith("hi sumi") || message.content.toLowerCase().startsWith("wsg sumi") || message.content.toLowerCase().startsWith("gm sumi")) {
        message.react(`${emojis[Math.floor(Math.random()*emojis.length)]}`);
        message.reply(`${greeting[Math.floor(Math.random()*greeting.length)]} ${faces[Math.floor(Math.random()*faces.length)]}`);
        addHello(message.channel.guild);
    }
    else if(message.content.toLowerCase().startsWith("bye sumi") || message.content.toLowerCase().startsWith("goodnight sumi") || message.content.toLowerCase().startsWith("gn sumi") || message.content.toLowerCase().startsWith("peace sumi")) {
        message.react(`${emojis[Math.floor(Math.random()*emojis.length)]}`);
        message.reply(`${leaving[Math.floor(Math.random()*leaving.length)]} ${faces[Math.floor(Math.random()*faces.length)]}`);
        addGoodbye(message.channel.guild);
    } 
    else if(message.author.username == "HaikuBot" && message.author.bot && message.embeds.length > 0) {
        setTimeout(() => { message.channel.send(`${adjs[Math.floor(Math.random()*adjs.length)]} haiku`); }, 500);
        addHaiku(message.channel.guild);
    } else {
        if(message.content.toLowerCase().startsWith("sumi")) {
            if(message.content.split(" ")[1] == "stats") {
              ddb.get({TableName: "sumi", Key: { 'guildid': message.guildId }}, (error, stats) => {
                if(error) {
                  console.log(error);
                } else {
                  let statsEmbed = new EmbedBuilder()
                  .setColor(0xF78DA7)
                  .setTitle(`${stats.Item.guildname}`)
                  .setThumbnail(`https://cdn.discordapp.com/icons/${stats.Item.guildid}/${stats.Item.guildicon}.png`)
                  .addFields(
                    { name: 'links', value: "" + stats.Item.numberOfLinks },
                    { name: 'hellos', value: "" + stats.Item.numberOfHellos },
                    { name: 'goodbyes', value: "" + stats.Item.numberOfGoodbyes },
                    { name: 'haikus', value: "" + stats.Item.numberOfHaikus },
                  )
                  .setTimestamp()
                  .setFooter({ text: 'with 💖 from sumi' });

                  message.channel.send({embeds: [statsEmbed]});
                }
              })

            } else if(message.content.split(" ")[1] == "serverbanner") {
              if(message.guild.banner == null) {
                message.channel.send("sorry, this server does not have a banner :(");
              } else {
                message.channel.send(`https://cdn.discordapp.com/banners/${message.guild.id}/${message.guild.banner}.png?size=4096`);
              }
            } else if(message.content.split(" ")[1] == "serversplash") {
              if(message.guild.splash == null) {
                message.channel.send("sorry, this server does not have a splash image :(");
              } else {
                message.channel.send(`https://cdn.discordapp.com/splashes/${message.guild.id}/${message.guild.splash}.png?size=4096`);
              }
            } else if(message.content.split(" ")[1] == "pfp") {
              if(message.author.avatar != undefined) {
                message.channel.send(message.author.avatarURL({size:4096}));
              } else {
                message.channel.send("as far as i can tell you do not have a profile picture...");
              }
            } 
            else if(message.content.split(" ")[1] == "banner") {
              if(message.author.banner != undefined) {
                message.channel.send(message.author.bannerURL({size:4096}));
              } else {
                message.channel.send("i cannot find a banner image for you...");
              }
            }
            else if(message.content.split(" ")[1] == "help") {
              message.channel.send(`\`any x.com or twitter.com link will automatically be sent again as a vxtwitter.com link to allow for embeds
use the following "sumi" commands to get server info / other usefull things:

<sumi help> - will show this message

<sumi serverbanner> - sends this server's banner in the largest resolution discord has as a .png
<sumi serversplash> - sends this server's splash image in the largest resolution discord has as a .png

<sumi pfp> - send the user's avatar in the largest size discord has available
<sumi banner> - send the user's profile banner in the largest size discord has available

<sumi stats> - send usage counts for sumi's primary functions

<hi/hello/wsg sumi> - to say hello
<bye/goodbye/gn> - to say goodbye
\``)
            }
        }
    }
})

client.login(ts);

// code written by steve - austin stotts
// please dont fuck with the token