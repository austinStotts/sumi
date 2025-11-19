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



let makeGuild = (guild, message) => {
  ddb.get({
    TableName: "sumi",
    Key: { "guildid": guild.id }},
  (error, data) => {
    if (error) {
      console.log(error)
      message.channel.send("something really really bad happened sorry...");
    } else {
      if(data.Item == undefined) {
        // no guild found
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
            if(error) {
              console.log(error)
              message.channel.send("something really super bad happened... sorry...");
            }
            else {
              console.log("made new guild")
              message.channel.send("consider it done!");
            }
        })
        
      } else {
        // guild was found
        message.channel.send("cannot create what has already been created!");
      }
    }
  })
}

let addHello = (message) => {
  let guild = message.channel.guild;
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
            if(data.Item.members[message.author.id].hellos != undefined) {
              data.Item.members[message.author.id].hellos += 1;
              ddb.put({
                TableName: "sumi",
                Item : data.Item
              }, (error, data) => {
                if(error) {
                  console.log(error);
                } else {
                  // user was updated
                }
              })
            } else {
              data.Item.members[message.author.id].hellos = 1;
              ddb.put({
                TableName: "sumi",
                Item : data.Item
              }, (error, data) => {
                if(error) {
                  console.log(error);
                } else {
                  // user was updated
                }
              })
            }
        }
      }
  })
}

let addGoodbye = (message) => {
  let guild = message.channel.guild;
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
            if(data.Item.members[message.author.id].goodbyes != undefined) {
              // does have haiku property -> add 1
              data.Item.members[message.author.id].goodbyes += 1;
              ddb.put({
                TableName: "sumi",
                Item : data.Item
              }, (error, data) => {
                if(error) {
                  console.log(error);
                } else {
                  // user was updated
                }
              })
            } else {
              // does not have the haiku property
              data.Item.members[message.author.id].goodbyes = 1;
              ddb.put({
                TableName: "sumi",
                Item : data.Item
              }, (error, data) => {
                if(error) {
                  console.log(error);
                } else {
                  // user was updated
                }
              })
            }
        }
      }
  })
}

let addLink = (message) => {
  let guild = message.channel.guild;
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
            if(data.Item.members[message.author.id].links != undefined) {
              // does have haiku property -> add 1
              data.Item.members[message.author.id].links += 1;
              ddb.put({
                TableName: "sumi",
                Item : data.Item
              }, (error, data) => {
                if(error) {
                  console.log(error);
                } else {
                  // user was updated
                }
              })
            } else {
              // does not have the haiku property
              data.Item.members[message.author.id].links = 1;
              ddb.put({
                TableName: "sumi",
                Item : data.Item
              }, (error, data) => {
                if(error) {
                  console.log(error);
                } else {
                  // user was updated
                }
              })
            }
        }
      }
  })
}

let addHaiku = (message, authorid, valid) => {
  let guild = message.channel.guild;
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
            if(valid) {
              if(data.Item.members[authorid].haikus != undefined) {
                // does have haiku property -> add 1
                data.Item.members[authorid].haikus += 1;
                ddb.put({
                  TableName: "sumi",
                  Item : data.Item
                }, (error, data) => {
                  if(error) {
                    console.log(error);
                  } else {
                    // user was updated
                  }
                })
              } else {
                // does not have the haiku property
                data.Item.members[authorid].haikus = 1;
                ddb.put({
                  TableName: "sumi",
                  Item : data.Item
                }, (error, data) => {
                  if(error) {
                    console.log(error);
                  } else {
                    // user was updated
                  }
                })
              }
            }
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
          // user is new -> add to db
          data.Item.members[userid] = {
            name: username,
            sendLinks: false,
            messages: 0,
            hellos: 0,
            goodbyes: 0,
            helloToday: false,
            goodbyeToday: false,
            haikus: 0,
            links: 0,
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

let adjs = [
  "great",
  "great",
  "great",
  "cool",
  "cool",
  "cool",
  "vivid",
  "vivid",
  "vivid",
  "delightful",
  "delightful",
  "delightful",
  "sickening",
  "sickening",
  "sickening",
  "helpful",
  "helpful",
  "helpful",
  "silly",
  "silly",
  "silly",
  "amazing",
  "amazing",
  "amazing",
  "ancient",
  "ancient",
  "gentle",
  "gentle",
  "epic",
  "epic",
  "boring",
  "boring",
  "super",
  "super",
  "astonishing",
  "astonishing",
  "brilliant",
  "brilliant",
  "super duper",
  "super duper",
  "embarrassing",
  "embarrassing",
  "overrated",
  "overrated",
  "lame ass",
  "すごい",
  "sick ass",
  "prime time",
  "dang good",
  "explosive",
  "whimsical",
  "putrid",
  "complicated",
  "mouthwatering",
  "finger licking",
  "horny",
  "poggers",
  "is that even a",
  "good",
  "poop",
  "[REDACTED]",
  `Hahahahaha\nHahahahahahaha\nHahahahaha\n`,
  `⣿⠊⢰⢇⢙⠊⣼⣶⣾⣭⣍⡉⠽⢿⠿⠶⣶⣮⠍⠎⢿⣿⣿⣿⣦⠹\n⠿⢾⣪⣮⢀⣾⣿⣿⣿⣿⣿⣿⣷⣶⣶⣄⠛⠿⢶⣷⡈⣿⣿⣿⣿⠐\n⣷⣴⡬⢡⣾⣿⣿⣿⣿⣿⣿⣿⣿⣟⣛⣛⣛⣓⠂⢲⠄⣿⣿⣿⣿⣆\n⡙⠛⢠⣿⣿⡿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⢸⣿⣿⠙⣿\n⣿⢁⣿⠟⣡⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⣟⡻⢿⣿⢸⣿⣿⠄⣿\n⡏⡼⢫⣼⣿⣿⣿⢿⣿⣿⣿⣿⣿⣿⣿⣞⣭⣤⣤⣤⣬⠸⣿⣿⠄⣿\n⠃⣷⣿⣿⡟⠵⠊⣑⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⣿⣿⠄⣿\n⠄⠘⣿⣿⠁⣴⣾⣿⣿⣿⣿⣿⢹⣿⣿⣿⣿⣿⣿⣿⣿⡇⣿⣿⢠⣿\n⠄⠰⣆⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢋⣿⣿⣿⣿⡿⠇⡿⡁⣸⣿\n⡀⣀⠙⠳⡘⢿⣿⣿⣿⣿⣿⣤⣥⣿⣶⣿⣿⣿⣿⡿⢃⠄⣓⢁⣿⣯\n⣷⡈⠆⠄⠠⠈⡻⢿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠉⡀⢍⠁⢁⣼⣿⢋\n⢿⣿⣦⢵⠐⡩⠁⡄⡌⡉⠟⣿⣻⣟⣋⣥⣶⡀⡁⡃⠪⣠⣼⣿⣟⣼ \n`
];


let faces = ["0.0","<3",":3","(⁀ᗢ⁀)","\\(^ヮ^)/","(„• ᴗ •„)","	⸜(⸝⸝⸝´꒳`⸝⸝⸝)⸝","( = ⩊ = )","(♡˙︶˙♡)","♡＼(￣▽￣)／♡","(´꒳`)♡","	\(〇_ｏ)/","╮(︶▽︶)╭","(*°ｰ°)ﾉ","(⊃｡•́‿•̀｡)⊃","(っ ᵔ◡ᵔ)っ","(｡•̀ᴗ-)✧","	|ʘ‿ʘ)╯","☆ﾐ(o*･ω･)ﾉ","	(=^･ｪ･^=)","U・ᴥ・U","	૮₍ ˶• ༝ •˶ ₎ა","	(; ・_・)――――C","( ˘▽˘)っ♨","	-●●●-ｃ(・・ )","( ・・)つ-●●●","( o˘◡˘o) ┌iii┐","	(〜￣▽￣)〜","(~‾▽‾)~","✺◟( • ω • )◞✺","	( ͠° ͟ʖ ͡°)","( . •́ _ʖ •̀ .)","(⌐■_■)","ଘ(੭ˊᵕˋ)੭* ੈ✩‧₊˚","(ノ°∀°)ノ⌒･*:.｡. .｡.:*･゜ﾟ･*☆","	(/￣ー￣)/~~☆’.･.･:★’.･.･:☆"]
let greeting = ["haii", "hi", "おはよう!", "おやすみ...", "こんにちは", "hey", "hello!", "greetings!", "Hola", "hi", "haaaaay", "hewwo", "HEY!", "hiiii", "boo!", "RAAAAHHH", "erm", "可愛い"];
let leaving = ["bye", "see you!", "see you", "bye bye", "goodnight!", "goodnight", "gn", "gn!", "sweet dreams"];
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
  // updageIconID(message.guild);
  addUser(message.author.id, message.guild.id, message.author.displayName);
  // console.log(message); // uncomment to print all messages

  // new link check
  let words = message.content.split(" ");
  words.forEach(word => {
    if(word.startsWith("https://x.com") || word.startsWith("https://twitter.com")) {
      ddb.get({
        TableName: "sumi", 
        Key: { "guildid": message.guild.id }},
        (error, data) => {
            if(error) { console.log(error) }
          else {
            if(data.Item.isSendingLinks && data.Item.members[message.author.id].sendLinks) {
              let data = word.split(".com")[1];
              message.suppressEmbeds();
              message.reply(`https://fxtwitter.com${data}`);
              addLink(message);
            } else {
              console.log("links are turned off");
            }
          }
      })
    }
  })

  if (message.content.startsWith("https://x.com") || message.content.startsWith("https://twitter.com")) {
    // needs to be cleaned up


    // ddb.get({
    //   TableName: "sumi", 
    //   Key: { "guildid": message.guild.id }},
    //   (error, data) => {
    //       if(error) { console.log(error) }
    //     else {
    //       if(data.Item.isSendingLinks && data.Item.members[message.author.id].sendLinks) {
    //         let data = message.content.split(".com")[1];
    //         message.suppressEmbeds();
    //         message.reply(`https://fxtwitter.com${data}`);
    //         addLink(message);
    //       } else {
    //         console.log("links are turned off");
    //       }
    //     }
    // })
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

  // thank you sumi
  else if(message.content.toLowerCase().startsWith("thank you sumi") || 
          message.content.toLowerCase().startsWith("ty sumi") || 
          message.content.toLowerCase().startsWith("thanks sumi") ||
          message.content.toLowerCase().startsWith("bless you sumi")
        ){
    message.react(`${emojis[Math.floor(Math.random()*emojis.length)]}`);
    message.reply(`my pleasure`);
  }

  // hey sumi
  else if(message.content.toLowerCase().startsWith("hey sumi") || 
          message.content.toLowerCase().startsWith("hello sumi") || 
          message.content.toLowerCase().startsWith("hi sumi") || 
          message.content.toLowerCase().startsWith("wsg sumi") || 
          message.content.toLowerCase().startsWith("gm sumi") ||
          message.content.toLowerCase().startsWith("yo sumi")
        ){
      message.react(`${emojis[Math.floor(Math.random()*emojis.length)]}`);
      message.reply(`${greeting[Math.floor(Math.random()*greeting.length)]} ${faces[Math.floor(Math.random()*faces.length)]}`);
      addHello(message);
  }

  // bye sumi
  else if(message.content.toLowerCase().startsWith("bye sumi") || 
          message.content.toLowerCase().startsWith("goodnight sumi") || 
          message.content.toLowerCase().startsWith("gn sumi") || 
          message.content.toLowerCase().startsWith("peace sumi")
        ){
      message.react(`${emojis[Math.floor(Math.random()*emojis.length)]}`);
      message.reply(`${leaving[Math.floor(Math.random()*leaving.length)]} ${faces[Math.floor(Math.random()*faces.length)]}`);
      addGoodbye(message);
  } 
  // reply to haikubot
  else if(message.author.username == "HaikuBot" && message.author.bot && message.embeds.length > 0) {
      setTimeout(() => { message.channel.send(`${adjs[Math.floor(Math.random()*adjs.length)]} haiku`); }, 500);
      message.channel.messages.fetch({ limit: 2 })
      .then(messages => {
        // console.log(message.embeds[0])
        console.log(messages.last().member.nickname)
        console.log(message.embeds[0].data.footer.text.split(" ")[1])
        if(messages.last().member.nickname == message.embeds[0].data.footer.text.split(" ")[1]) {
          console.log("TRUE")
          addHaiku(message, messages.last().author.id, true)
        } else {
          addHaiku(message, "-1", false)
        }
      })
      .catch(error => { console.log(error) })
      
  } 

  // reply methods
  // replying to sumi
  else if(message.mentions.repliedUser != undefined){
    if(message.mentions.repliedUser.id == "1176256487035785257" && message.content.toLowerCase() == "delete") {
      message.channel.messages.delete(message.reference.messageId);
      message.delete();
    }
    else if (message.content.toLowerCase().split(" ")[0] == "sumi" && message.content.toLowerCase().split(" ")[1] == "translate") {
      console.log("translating message!");
      message.fetchReference()
      .then(data => {
        let from_lang = 'auto';
        let to_lang = message.content.toLowerCase().split(" ")[2];
        let text_to_translate = data.content;

        const translate = new AWS.Translate();

        const params = {
          SourceLanguageCode: from_lang,
          TargetLanguageCode: to_lang,
          Text: text_to_translate,
        };
  
        translate.translateText(params, (err, data) => {
          if (err) {
            console.log("Error translating text:", err);
            message.channel.send("erm that did not work... maybe YOU did something wrong!");
          } else {
            console.log("Translated text:", data.TranslatedText);
            message.channel.send(data.TranslatedText);
          }
        });
      })
      .catch(err => {console.log("failure to fetch replied message")})
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
      // <mystats> show personal stats
      if(message.content.split(" ")[1] == "mystats" || message.content.split(" ")[1] == "ms") {
        ddb.get({TableName: "sumi", Key: { 'guildid': message.guildId }}, (error, stats) => {
          if(error) {
            console.log(error);
          } else {
            let statsEmbed = new EmbedBuilder()
            .setColor(0xF78DA7)
            .setTitle(`${stats.Item.members[message.author.id].name}`)
            .setThumbnail(`${message.author.avatarURL({size:4096})}`)
            .addFields(
              { name: 'links', value: "" + stats.Item.members[message.author.id].links },
              { name: 'hellos', value: "" + stats.Item.members[message.author.id].hellos },
              { name: 'goodbyes', value: "" + stats.Item.members[message.author.id].goodbyes },
              { name: 'haikus', value: "" + stats.Item.members[message.author.id].haikus },
              { name: 'send links?', value: "" + stats.Item.members[message.author.id].sendLinks },
            )
            .setTimestamp()
            .setFooter({ text: 'with 💖 from sumi' });

            message.channel.send({embeds: [statsEmbed]});
          }
        })
      }
      // a stand in until i automate the db creation when she joins a server for the first time
      else if(message.content.split(" ")[1] == "create") {
        if(message.member.permissions.has("ManageChannels")) {
          makeGuild(message.guild, message);
        } else {
          message.channel.send("🚫 permission denied 🚫");
        }
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
      // send language codes
      else if(message.content.split(" ")[1] == "languages") {
        message.channel.send(languages);
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
            Object.keys(data).forEach((key, i) => { memberslist.push(`${i+1}: ${data[key].name} - ${data[key].sumiscore}`) })
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
__________________________________
<sumi help> - will show this message
__________________________________
<sumi serverbanner || sb> - sends this server's banner in the largest resolution discord has as a .png
<sumi serversplash || ss> - sends this server's splash image in the largest resolution discord has as a .png
🔒 <sumi serverdata || sd> - show guild data from discord
__________________________________
<sumi pfp> - send the user's avatar in the largest size discord has available
<sumi banner || bn> - send the user's profile banner in the largest size discord has available
<sumi mydata || md> - show user data from discord
__________________________________
<sumi stats || st> - send usage counts for sumi's primary functions
<sumi mystats || ms>* - show personal counts and settings (coming soon)
<sumi members || mb> - list all members sumi keeps track of (buggy)
__________________________________
🔒 <sumi toggle || tg> - turn on/off link sending for entire server
<sumi toggleme || tm>* - turn on/off link sending for individual
__________________________________
<hi/hello/wsg sumi> - to say hello
<bye/goodbye/gn sumi> - to say goodbye
__________________________________
<sumi translate [country code]> *in a reply* - to translate a message
<sumi languages> - to list all available language codes
__________________________________
<delete> *in a reply* - to delete sumi's message / sumi can only delete her own messages

*server settings override any personal settings
**if sumi is new to your server and not working as intended - use <sumi create> to make sure your guild has been added to the database! 
[WARNING] - <sumi create> will reset your server to default settings and stats
\`\`\`
`

const languages = `
\`\`\`
Afrikaans:         	af
Albanian:	          sq
Amharic:	          am
Arabic:	            ar
Armenian:	          hy
Azerbaijani:	      az
Bengali:	          bn
Bosnian:	          bs
Bulgarian:	        bg
Catalan:	          ca
Chinese (Simp):	    zh
Chinese (Trad):	    zh-TW
Croatian:	          hr
Czech:	            cs
Danish:	            da
Dari:	              fa-AF
Dutch:	            nl
English:	          en
Estonian:	          et
Farsi (Persian):	  fa
Filipino, Tagalog:	tl
Finnish:	          fi
French:	            fr
French (Canada):	  fr-CA
Georgian:	          ka
German:	            de
Greek:	            el
Gujarati:	          gu
Haitian Creole:	    ht
Hausa:	            ha
Hebrew:	            he
Hindi:	            hi
Hungarian:	        hu
Icelandic:	        is
Indonesian:	        id
Irish:	            ga
Italian:	          it
Japanese:	          ja
Kannada:	          kn
Kazakh:	            kk
Korean:	            ko
Latvian:	          lv
Lithuanian:	        lt
Macedonian:	        mk
Malay:	            ms
Malayalam:	        ml
Maltese:	          mt
Marathi:	          mr
Mongolian:	        mn
Norwegian (Bokmål):	no
Pashto:	            ps
Polish:	            pl
Portuguese (Braz):	pt
Portuguese (Port):	pt-PT
Punjabi:	          pa
Romanian:	          ro
Russian:	          ru
Serbian:	          sr
Sinhala:	          si
Slovak:	            sk
Slovenian:	        sl
Somali:	            so
Spanish:	          es
Spanish (Mexico):	  es-MX
Swahili:	          sw
Swedish:	          sv
Tamil:	            ta
Telugu:	            te
Thai:	              th
Turkish:	          tr
Ukrainian:	        uk
Urdu:	              ur
Uzbek:	            uz
Vietnamese:	        vi
Welsh:	            cy
\`\`\`
`