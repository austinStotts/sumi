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
            "numberOfLinks": 0,
            "isSendingLinks": true,
            "members": {}
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
            else { console.log(response) }
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
            else { console.log(response) }
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
            else { console.log(response) }
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
            else { console.log(response) }
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
            else { console.log(response) }
          })
        }
      }
  })
}

let toggleLinks = (guild) => {
  ddb.get({
    TableName: "sumi", 
    Key: { "guildid": guild.id }},
    (error, data) => {
        if(error) { console.log(error) }
      else { 
        data.Item.isSendingLinks = !data.Item.isSendingLinks;
        ddb.put({
          TableName: "sumi",
          Item: data.Item
        }, (error, response) => {
          if(error) { console.log(error) }
          else { console.log(response) }
        })
      }
  })
}

let toggleUserLinks = (userid, guildid) => {
  ddb.get({
    TableName: "sumi", 
    Key: { "guildid": guildid }},
    (error, data) => {
        if(error) { console.log(error) }
      else { 
        data.Item.members[userid].sendLinks = !data.Item.members[userid].sendLinks;
        ddb.put({
          TableName: "sumi",
          Item: data.Item
        }, (error, response) => {
          if(error) { console.log(error) }
          else { console.log(response) }
        })
      }
  })
}

let getLinkStatus = (guild) => {
  ddb.get({
    TableName: "sumi", 
    Key: { "guildid": guild.id }},
    (error, data) => {
        if(error) { console.log(error) }
      else {
        return data.Item.isSendingLinks;
      }
  })
}

let addUser = (userid, guildid, username) => {
  ddb.get({
    TableName: "sumi", 
    Key: { "guildid": guildid }},
    (error, data) => {
        if(error) { console.log(error) }
      else { 
        // console.log(data.Item.members);
        let member = data.Item.members[userid];
        if(member != undefined) {
          // user is already in db
        } else {
          // user is new > add to db
          data.Item.members[userid] = {
            name: username,
            sendLinks: false,
            messages: 0,
            hellos: 0,
            goodbyes: 0,
            helloToday: false,
            goodbyeToday: false,
            sumiscore: 0,
          }
          ddb.put({
            TableName: "sumi",
            Item : data.Item
          }, (error, data) => {
            if(error) {
              console.log(error);
            } else {
              // user was added
            }
          })
        }
      }
  })
}


let faces = ["0.0","<3",":3","(⁀ᗢ⁀)","\\(^ヮ^)/","(„• ᴗ •„)","	⸜(⸝⸝⸝´꒳`⸝⸝⸝)⸝","( = ⩊ = )","(♡˙︶˙♡)","♡＼(￣▽￣)／♡","(´꒳`)♡","	\(〇_ｏ)/","╮(︶▽︶)╭","(*°ｰ°)ﾉ","(⊃｡•́‿•̀｡)⊃","(っ ᵔ◡ᵔ)っ","(｡•̀ᴗ-)✧","	|ʘ‿ʘ)╯","☆ﾐ(o*･ω･)ﾉ","	(=^･ｪ･^=)","U・ᴥ・U","	૮₍ ˶• ༝ •˶ ₎ა","	(; ・_・)――――C","( ˘▽˘)っ♨","	-●●●-ｃ(・・ )","( ・・)つ-●●●","( o˘◡˘o) ┌iii┐","	(〜￣▽￣)〜","(~‾▽‾)~","✺◟( • ω • )◞✺","	( ͠° ͟ʖ ͡°)","( . •́ _ʖ •̀ .)","(⌐■_■)","ଘ(੭ˊᵕˋ)੭* ੈ✩‧₊˚","(ノ°∀°)ノ⌒･*:.｡. .｡.:*･゜ﾟ･*☆","	(/￣ー￣)/~~☆’.･.･:★’.･.･:☆"]
let greeting = ["haii", "hi", "おはよう!", "おやすみ...", "こんにちは", "hey", "hello!", "greetings!", "Hola", "hi", "haaaaay", "hewwo", "HEY!", "hiiii", "boo!", "RAAAAHHH", "erm", "可愛い"];
let leaving = ["bye", "see you!", "see you", "bye bye", "goodnight!", "goodnight", "gn", "gn!", "sweet dreams"];
let adjs = ["great", "amazing", "cool", "poggers", "epic", "sick ass", "dang good", "good", "super", "super duper", "astonishing", "brilliant", "すごい", "lame ass", "boring", "silly"];
let emojis = ["💕","💓","💞","💖","💗","❤️","🌷","💐","💯","✔️"];

let birthdays = [{name: "steve ♡(>ᴗ•)", month: 0, day: 28}, {name: "wisp ( o˘◡˘o) ┌iii┐", month: 0, day: 31}];
let holidays = [{name: "usa #1 🦅", month: 6, day: 4}, {name: "memorializing", month: 4, day: 29}, {name: "no work day!", month: 8, day: 2}, {name: "911", month: 8, day: 11}]

client.on("ready", () => {
    console.log("sumi ready!");

    setInterval(() => {
      let date = new Date();
      let month = date.getMonth(); //0
      let day = date.getDate(); //1
      let isBirthday = false;
      let isHoliday = false;
      for(let i = 0; i < birthdays.length; i++) {
        if(month == birthdays[i].month && day == birthdays[i].day) {
          client.user.setActivity(`hbd ${birthdays[i].name}`);
          isBirthday = true;
        }
      }
      for(let i = 0; i < holidays.length; i++) {
        if(month == holidays[i].month && day == holidays[i].day) {
          client.user.setActivity(`${holidays[i].name}`);
          isHoliday = true;
        }
      }
      if(!isBirthday && !isHoliday) { client.user.setActivity("૮₍ ˶• ༝ •˶ ₎ა") }
    }, 10000)
})



client.on("messageCreate", (message) => {
  updageIconID(message.guild);
  addUser(message.author.id, message.guild.id, message.author.displayName);
  // console.log(message); // uncomment to print all messages

  if (message.content.startsWith("https://x.com") || message.content.startsWith("https://twitter.com")) {
    ddb.get({
      TableName: "sumi", 
      Key: { "guildid": message.guild.id }},
      (error, data) => {
          if(error) { console.log(error) }
        else {
          if(data.Item.isSendingLinks && data.Item.members[message.author.id].sendLinks) {
            let data = message.content.split(".com")[1];
            message.suppressEmbeds();
            message.reply(`https://vxtwitter.com${data}`);
            addLink(message.channel.guild);
          } else {
            console.log("links are turned off");
          }
        }
    })
  }
  else if (message.content.startsWith("https://tiktok.com") || message.content.startsWith("https://www.tiktok.com")) {
    ddb.get({
      TableName: "sumi", 
      Key: { "guildid": message.guild.id }},
      (error, data) => {
          if(error) { console.log(error) }
        else {
          if(data.Item.isSendingLinks && data.Item.members[message.author.id].sendLinks) {
            let data = message.content.split(".com")[1];
            message.suppressEmbeds();
            message.reply(`https://vxtiktok.com${data}`);
            message.channel.send("tiktok is still a work in progress...");
            addLink(message.channel.guild);
          } else {
            console.log("links are turned off");
          }
        }
    })
  }
  // hey sumi
  else if(message.content.toLowerCase().startsWith("hey sumi") || message.content.toLowerCase().startsWith("hello sumi") || message.content.toLowerCase().startsWith("hi sumi") || message.content.toLowerCase().startsWith("wsg sumi") || message.content.toLowerCase().startsWith("gm sumi")) {
      message.react(`${emojis[Math.floor(Math.random()*emojis.length)]}`);
      message.reply(`${greeting[Math.floor(Math.random()*greeting.length)]} ${faces[Math.floor(Math.random()*faces.length)]}`);
      addHello(message.channel.guild);
  }
  // bye sumi
  else if(message.content.toLowerCase().startsWith("bye sumi") || message.content.toLowerCase().startsWith("goodnight sumi") || message.content.toLowerCase().startsWith("gn sumi") || message.content.toLowerCase().startsWith("peace sumi")) {
      message.react(`${emojis[Math.floor(Math.random()*emojis.length)]}`);
      message.reply(`${leaving[Math.floor(Math.random()*leaving.length)]} ${faces[Math.floor(Math.random()*faces.length)]}`);
      addGoodbye(message.channel.guild);
  } 
  // reply to haikubot
  else if(message.author.username == "HaikuBot" && message.author.bot && message.embeds.length > 0) {
      setTimeout(() => { message.channel.send(`${adjs[Math.floor(Math.random()*adjs.length)]} haiku`); }, 500);
      addHaiku(message.channel.guild);
  } 

  else if(message.mentions.repliedUser != undefined){
    if(message.mentions.repliedUser.id == "1176256487035785257" && message.content.toLowerCase() == "delete") {
      message.channel.messages.delete(message.reference.messageId);
      message.delete();
    }
  }
  // <sumi> commands
  else {
    if(message.content.toLowerCase().startsWith("sumi")) {
      // <stats> show server stats
      if(message.content.split(" ")[1] == "stats" || message.content.split(" ")[1] == "st") {
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
              { name: 'send links?', value: "" + stats.Item.isSendingLinks },
            )
            .setTimestamp()
            .setFooter({ text: 'with 💖 from sumi' });

            message.channel.send({embeds: [statsEmbed]});
          }
        })
      }
      // <serverbanner> send the server's banner image
      else if(message.content.split(" ")[1] == "serverbanner" || message.content.split(" ")[1] == "sb") {
        if(message.guild.banner == null) {
          message.channel.send("sorry, this server does not have a banner :(");
        } else {
          message.channel.send(`https://cdn.discordapp.com/banners/${message.guild.id}/${message.guild.banner}.png?size=4096`);
        }
      } 
      // <serversplash> send the server's splash image
      else if(message.content.split(" ")[1] == "serversplash" || message.content.split(" ")[1] == "ss") {
        if(message.guild.splash == null) {
          message.channel.send("sorry, this server does not have a splash image :(");
        } else {
          message.channel.send(`https://cdn.discordapp.com/splashes/${message.guild.id}/${message.guild.splash}.png?size=4096`);
        }
      } 
      // <pfp> send the users profile picture
      else if(message.content.split(" ")[1] == "pfp") {
        if(message.author.avatar != undefined) {
          message.channel.send(message.author.avatarURL({size:4096}));
        } else {
          message.channel.send("as far as i can tell you do not have a profile picture...");
        }
      }
      // <banner> send the users banner image - NOT WORKING! 
      else if(message.content.split(" ")[1] == "banner" || message.content.split(" ")[1] == "bn") {
        if(message.author.banner != undefined) {
          message.channel.send(message.author.bannerURL({size:4096}));
        } else {
          message.channel.send("i cannot find a banner image for you...");
        }
      }
      // send command info
      else if(message.content.split(" ")[1] == "help") {
        message.channel.send(helptext);
      }
      // toggle the server sendlink status
      else if(message.content.split(" ")[1] == "toggle" || message.content.split(" ")[1] == "tg") { 
        if(message.member.permissions.has("ManageChannels")) {
          toggleLinks(message.guild);
          message.channel.send("ok! :3");
        } else {
          message.channel.send("🚫 permission denied 🚫");
        }
      }
      // toggle the users sendlink status
      else if(message.content.split(" ")[1] == "toggleme" || message.content.split(" ")[1] == "tm") {
        toggleUserLinks(message.author.id, message.guild.id);
        message.channel.send(`got it ${message.author.displayName}! ( ˘▽˘)っ♨`);
      }
      // send list of members and score
      else if(message.content.split(" ")[1] == "members" || message.content.split(" ")[1] == "mb") {
        ddb.get({TableName: "sumi", Key: { 'guildid': message.guildId }}, (error, stats) => {
          if(error) {
            console.log(error);
          } else {
            let data = stats.Item.members;
            let memberslist = [];
            Object.keys(data).forEach((key, i) => { memberslist.push(`${i+1}: ${data[key].name}`) })
            // console.log(stats.Item.members)
            // console.log(...memberslist)
            let membersEmbed = new EmbedBuilder()
            .setColor(0xF78DA7)
            .setTitle(`${stats.Item.guildname}`)
            .setThumbnail(`https://cdn.discordapp.com/icons/${stats.Item.guildid}/${stats.Item.guildicon}.png`)
            .setDescription(memberslist.join('\n'))
            .setTimestamp()
            .setFooter({ text: 'with 💖 from sumi' });

            message.channel.send({embeds: [membersEmbed]});
          }
        })
      }

      else if (message.content.split(" ")[1] == "serverdata" || message.content.split(" ")[1] == "sd") {
        if(message.member.permissions.has("ManageChannels")) {
          let data = [];
          Object.keys(message.guild).forEach(key => {
            if(typeof message.guild[key] == "object") {
              if(message.guild[key] != undefined) {
                // console.log(message.guild[key])
                data.push(`${key}: [LOOP]`);
              } else {
                data.push(`${key}: ${message.guild[key]}`);
              }
            } else {
              data.push(`${key}: ${message.guild[key]}`)
            }
          })
          message.channel.send(`
          \`\`\`
          \n${data.join("\n")}
          \`\`\`
          `)
          toggleLinks(message.guild);
          message.channel.send("ok! :3");
        } else {
          message.channel.send("🚫 permission denied 🚫");
        }
      } 
      
      else if (message.content.split(" ")[1] == "mydata" || message.content.split(" ")[1] == "md") {
        let data = [];
        Object.keys(message.author).forEach(key => { data.push(`${key}: ${message.author[key]}`) })
        message.channel.send(`
        \`\`\`
        \n${data.join("\n")}
        \`\`\`
        `)
      }
    }
  }
})

client.login(ts);

// code written by steve - austin stotts
// please dont fuck with the token



let helptext = 
`
\`\`\`

any x.com or twitter.com link will automatically be sent again as a vxtwitter.com link to allow for embeds
use the following <sumi> commands to get server info / other usefull things:
——————————————————————————————————
__________________________________
<sumi help> - will show this message
——————————————————————————————————
__________________________________
<sumi serverbanner || sb> - sends this server's banner in the largest resolution discord has as a .png
<sumi serversplash || ss> - sends this server's splash image in the largest resolution discord has as a .png
🔒 <sumi serverdata || sd> - show guild data from discord
——————————————————————————————————
__________________________________
<sumi pfp> - send the user's avatar in the largest size discord has available
<sumi banner || bn> - send the user's profile banner in the largest size discord has available
<sumi mydata || md> - show user data from discord
——————————————————————————————————
__________________________________
<sumi stats || st> - send usage counts for sumi's primary functions
<sumi mystats || ms>* - show personal counts and settings (coming soon)
<sumi members || mb> - list all members sumi keeps track of (buggy)
——————————————————————————————————
__________________________________
🔒 <sumi toggle || tg> - turn on/off link sending for entire server
<sumi toggleme || tm>* - turn on/off link sending for individual
——————————————————————————————————
__________________________________
<hi/hello/wsg sumi> - to say hello
<bye/goodbye/gn sumi> - to say goodbye
——————————————————————————————————

*server settings override any personal settings
\`\`\`
`