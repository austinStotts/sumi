require("dotenv").config(); 
const AWS = require("aws-sdk");
AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.ACCESSKEY,
  secretAccessKey: process.env.SECRETACCESSKEY,
});

let ddb = new AWS.DynamoDB.DocumentClient();

let getStats = (guildid) => {
  ddb.get({TableName: "sumi", Key: { 'guildid': guildid }}, (error, data) => {
    if(error) {
      console.log(error);
      console.log("ERROR\n\n\n")
    } else {
      return data;
    }
  })
}

let addHello = (guildid) => {
  ddb.get({
    TableName: "sumi", 
    Key: { "guildid": guildid }},
    (error, data) => {
      if(error) { console.log(error) }
      else { 
        data.Item.numberOfHellos += 1;
        ddb.put({
          TableName: "sumi",
          Item: data.Item
        }, (error, response) => {
          if(error) { console.log(error) }
          else { console.log(response, "RESPONSE") }
        })
      }
  })
}

let addGoodbye = (guildid) => {
  ddb.get({
    TableName: "sumi", 
    Key: { "guildid": guildid }},
    (error, data) => {
      if(error) { console.log(error) }
      else { 
        data.Item.numberOfGoodbyes += 1;
        ddb.put({
          TableName: "sumi",
          Item: data.Item
        }, (error, response) => {
          if(error) { console.log(error) }
          else { console.log(response, "RESPONSE") }
        })
      }
  })
}

let addLink = (guildid) => {
  ddb.get({
    TableName: "sumi", 
    Key: { "guildid": guildid }},
    (error, data) => {
      if(error) { console.log(error) }
      else { 
        data.Item.numberOfLinks += 1;
        ddb.put({
          TableName: "sumi",
          Item: data.Item
        }, (error, response) => {
          if(error) { console.log(error) }
          else { console.log(response, "RESPONSE") }
        })
      }
  })
}

let addHaiku = (guildid) => {
  ddb.get({
    TableName: "sumi", 
    Key: { "guildid": guildid }},
    (error, data) => {
      if(error) { console.log(error) }
      else { 
        data.Item.numberOfHaiku += 1;
        ddb.put({
          TableName: "sumi",
          Item: data.Item
        }, (error, response) => {
          if(error) { console.log(error) }
          else { console.log(response, "RESPONSE") }
        })
      }
  })
}

module.exports = {getStats, addGoodbye, addHaiku, addHello, addLink}


