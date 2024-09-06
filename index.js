process.on("unhandledRejection", error => {
  return console.log(error)
}); // يمنع ايرور عن اطفاء البروجكت 

const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello Express app!')
});

app.listen(3000, () => {
  console.log('server started');
});


const Discord = require("discord.js");
require("discord-reply")
const client = new Discord.Client();
const disbut = require("discord-buttons")
disbut(client)
const {MessageButton, MessageMenu, MessageMenuOption, MessageActionRow} = require("discord-buttons");
const fs = require("fs");
const mdb = JSON.parse(fs.readFileSync('./onoff.json', 'UTF8'));
const db = require("quick.db");
const devs = ["1096282633048170576","1096282633048170576","1262739650238484491"]
setTimeout(() => {
  if (!client || !client.user) {
    console.log("Client Not Login, Process Kill")
    process.kill(1);
  } else {
    console.log("Client Login")
  }
}, 3*1000*60);

client.on("message",async message =>{
  if(message.content.startsWith("!لف")){

    if(mdb.onoff == "off") return message.lineReplyNoMention("**النظام مغلق حالياً ، يرجى الإنتظار لين نفتحه .**");  
         if(!message.channel.name.startsWith(`ticket-`)) return message.channel.send(` لا يمكنك افتح تذكرة من فضلك.`,true);
  let embed = new Discord.MessageEmbed()
  .setColor("BLUE").setAuthor(message.author.username , message.author.displayAvatarURL({dynamic:true})).setTimestamp().setFooter("Hollywood", message.guild.iconURL()).setTitle("**عجلة حظ gex**").addField("Spin Normel" , "تحتاج الى invites واحد للحصول على نقطه.").addField("Legend spin","تحتاج إلى invites اثنين للحصول على نقطتين.")
let normal = new MessageButton()
.setLabel('Normal spin')
.setStyle('green')
.setID(`normal_${message.author.id}`)

    let legend = new MessageButton()
.setLabel('Legend spin')
.setStyle('green')
.setID(`legend_${message.author.id}`)

let cancel = new MessageButton()
.setLabel('Cancel ❌')
.setStyle('red')
.setID(`cancel_${message.author.id}`)

message.channel.send({
  embed:embed,
  buttons:[normal , legend , cancel]
}).then((msg) =>{
  const filter = (button) => button.clicker.user.id === message.author.id;
const collector = msg.createButtonCollector(filter, { time: 60000 , max:1}); 

collector.on('collect',b =>{
  if(b.id == `cancel_${message.author.id}`){
    message.lineReplyNoMention("تم الإلغاء").then((mm) =>{
      setTimeout(()=>{
        mm.delete()
        msg.delete
      },3000)
    })
    
    }else if(b.id == `normal_${message.author.id}`){
    if(!db.has(message.author.id) || db.get(`${message.author.id}.spins`) < 1) return message.lineReplyNoMention("ليس لديك أي نقطة");
    db.subtract(`${message.author.id}.spins`,1)
    
    let rewn = ["20k","20k","30k","20k","30k","20k","30k","30k","20k"]
  let praise = rewn[Math.floor(Math.random() * rewn.length)];
     message.lineReplyNoMention(`مبروك لقد فزت ب ${praise}`)
          
     if(message.channel.name.startsWith("ticket")){
       message.channel.setName(`${praise}`)
     }
     
  }else if(b.id == `legend_${message.author.id}`){
    if(!db.has(message.author.id) || db.get(`${message.author.id}.spins`) < 1) return message.lineReplyNoMention("ليس لديك أي نقطة");
if(db.get(`${message.author.id}.spins`) < 2) return message.lineReplyNoMention("You need more points");
db.subtract(`${message.author.id}.spins`,2)

   let rewn = ["20k","30k","40k","50k","60k","75k","80k","90k","100k"]
  let praise = rewn[Math.floor(Math.random() * rewn.length)];
 message.lineReplyNoMention(`مبروك لقد فزت ب ${praise}`)
          
     if(message.channel.name.startsWith("ticket")){
       message.channel.setName(`ticket ${praise}`)
     }
    
  }
})
/*
collector.on("end", (b) =>{
  msg.delete()
  message.lineReply("**أنتهى الوقت و لم تقم باختيار اي شئ**")
})*/

})


  }
  
  if(message.content.startsWith('_add')){
    let num;
    if(devs.includes(message.author.id)){
      let args = message.content.split(' ').slice(1);
    
      if(!args[0]) return message.lineReply('منشن العضو')
    
      let men = message.mentions.users.first()
      if(args[1]){num = args[1]}else{num = 1}
     
      if(men){
        if(db.has(men.id)){
          db.add(`${men.id}.spins`,num)
        }else{
          db.set(`${men.id}`,{ spins:num })
        }
        message.lineReply("Done")
      }
    }
  }
})


const invites = {};
const wait = require('util').promisify(setTimeout);

client.on('ready', async () => {
  await wait(1000);
client.guilds.cache.forEach(g => {
  g.fetchInvites().then(guildInvites => {
   invites[g.id] = guildInvites;
    });
  });
});



client.on('guildMemberAdd', member => {
  if(!db.get('mario.members').includes(member.id)){
member.guild.fetchInvites().then(guildInvites => {
    const ei = invites[member.guild.id];
    
    invites[member.guild.id] = guildInvites;
    const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
    
    const inviter = client.users.cache.get(invite.inviter.id) || client.users.cache.get(member.guild.owner.id)
    
    db.push('mario.members',member.id) 
   if(db.has(`${inviter.id}`)){
     db.add(`${inviter.id}.spins`,1)
   }else{ db.set(`${inviter.id}`, { spins:1 })}
    })
  }
});



client.on("message" , message =>{
 let msg = message;
 let spinc;
  if(!message.guild) return;
  if(message.author.bot) return;
  if(message.content.startsWith('$points') ||message.content.startsWith('$ points')){
    if(!db.has(message.author.id)){
  spinc = 0;
    }else{ 
      spinc = db.get(`${message.author.id}.spins`)
    }
    
    if(spinc == 0) return message.lineReply("**ليس لديك أي نقطة**");
    if(spinc == 1) return message.lineReply("**You have only 1 point**");
    message.lineReply(`You have ${spinc} points`)
  }
})

client.on("message" , message =>{
  if(message.content.startsWith('$lb')){
    if(message.member.hasPermission("ADMINISTRATOR")){
      let embed = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle("**Points Leaderboard**")
      .setAuthor(message.author.username,message.author.displayAvatarURL({ dynamic:true}))
      .setTimestamp()
	.setFooter('Hollywood ', message.guild.iconURL());
	
let num;
let mmm = [];
db.fetchAll({}).forEach(mm =>{
  if(mm.ID !=='mario'){
    mmm.push({name:mm.ID,spins: db.get(`${mm.ID}.spins`)})
  }
})
mmm.sort((a,b) => a.spins - b.spins).reverse()
if(mmm.length < 10){
  num = mmm.length;
}else{ num = 10}
for(let i=0;i<num;i++){
  let user = client.users.cache.get(mmm[i].name)
embed.addField(`${Math.floor(i + 1)}# With ${mmm[i].spins} points`, user)
}

message.lineReply(embed)
    }
  }
})



client.on("message" , message =>{
  if(!devs.includes(message.author.id)) return;
  if(message.content == '-clear'){
    message.lineReplyNoMention("loading..")
    db.fetchAll({}).forEach(mm =>{
  if(mm.ID !=='mario'){
     db.set(mm.ID, { spins:0})
  }
})
message.lineReplyNoMention("done")
  }
})



client.on("message" , message =>{
  if(!devs.includes(message.author.id)) return;
  if(message.content == '$off spins'){
    if(mdb.onoff == 'off')return message.lineReplyNoMention("Spins already off")
    mdb.onoff = "off";
		message.channel.send("Spins is off now :)");
	}
	fs.writeFile('./onoff.json', JSON.stringify(mdb), function(e) {
		if (e) throw e;
	})
	
	if(message.content == '$on spins'){
    if(mdb.onoff == 'on')return message.lineReplyNoMention("Spins already on")
    mdb.onoff = "on";
		message.channel.send("العجلة تحت التشغيل :)");
	}
	fs.writeFile('./onoff.json', JSON.stringify(mdb), function(e) {
		if (e) throw e;
	})
	});
	
client.on("ready",()=>{
client.user.setActivity("gex.", { type: 'WATCHING' })
  .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
  .catch(console.error);
})
client.login(process.env.token);
