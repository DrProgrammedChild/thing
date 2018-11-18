var database = require("./Database/database.js");
var shoputil = require("./shop.js");
var musicutil = require("./music.js");
var request = require("request");

function random(min,max) {
	return Math.floor(Math.random()*(max-min+1))+min;
}

module.exports = {
	commands: [
		{
			name: "say",
			category: "Admin",
			description: "Says something",
			execute: function(client,msg,args){
				msg.channel.send(args.join(" "));
				msg.delete();
			},
			args: [
				{name: "message", required: true}
			],
			rolesallowed: [
				"Helper",
				"Mod",
				"Admin",
				"Owner"
			]
		},
		{
			name: "kick",
			category: "Admin",
			description: "Kicks a user",
			execute: function(client,msg,args){
				let member = msg.mentions.members.first();
				if(member){
					if(member.kickable){
						member.kick();
					} else{
						msg.channel.send(":no_entry_sign: Error: Unable to kick user.");
					}
				} else{
					msg.channel.send(":no_entry_sign: Error: Please provide a user to kick.");
				}
			},
			args: [
				{name: "user", required: true}
			],
			rolesallowed: [
				"Mod",
				"Admin",
				"Owner"
			]
		},
		{
			name: "ban",
			category: "Admin",
			description: "Bans a user",
			execute: function(client,msg,args){
				let member = msg.mentions.members.first();
				if(member){
					if(member.kickable){
						member.ban();
					} else{
						msg.channel.send(":no_entry_sign: Error: Unable to ban user.");
					}
				} else{
					msg.channel.send(":no_entry_sign: Error: Please provide a ban to kick.");
				}
			},
			args: [
				{name: "user", required: true}
			],
			rolesallowed: [
				"Mod",
				"Admin",
				"Owner"
			]
		},
		{
			name: "tc",
			category: "Currency",
			description: "Displays how many toxic coins you (or someone else) has",
			execute: function(client,msg,args){
				database.getUser(msg.member)
					.then(user => {
						msg.channel.send("You have **" + user.tc + "** toxic coins.");
					})
					.catch(console.log);
			},
			args: false,
			rolesallowed: false
		},
		{
			name: "addcoins",
			category: "Admin",
			description: "Gives a user coins",
			execute: function(client,msg,args){
				if(msg.mentions.members.first()){
					database.getUser(msg.mentions.members.first())
						.then(user => {
							if(args[1]){
								let amount = parseInt(args[1]);
								if(amount){
									user.giveTc(amount);
								} else{
									msg.channel.send(":no_entry_sign: Error: Please provide a valid amount");
								}
							} else{
								msg.channel.send(":no_entry_sign: Error: Please provide a valid amount");
							}
						})
						.catch(console.log);
				} else{
					msg.channel.send(":no_entry_sign: Error: Please provide a valid user");
				}
			},
			args: [
				{name: "user", required: true},
				{name: "amount", required: true}
			],
			rolesallowed: [
				"Admin",
				"Owner"
			]
		},
		{
			name: "takecoins",
			category: "Admin",
			description: "Takes coins from a user",
			execute: function(client,msg,args){
				if(msg.mentions.members.first()){
					database.getUser(msg.mentions.members.first())
						.then(user => {
							if(args[1]){
								let amount = parseInt(args[1]);
								if(amount){
									user.takeTc(amount);
								} else{
									msg.channel.send(":no_entry_sign: Error: Please provide a valid amount");
								}
							} else{
								msg.channel.send(":no_entry_sign: Error: Please provide a valid amount");
							}
						})
						.catch(console.log);
				} else{
					msg.channel.send(":no_entry_sign: Error: Please provide a valid user");
				}
			},
			args: [
				{name: "user", required: true},
				{name: "amount", required: true}
			],
			rolesallowed: [
				"Admin",
				"Owner"
			]
		},
		{
			name: "kill",
			category: "Admin",
			description: "Takes the bot offline",
			execute: function(client,msg,args){
				process.exit(0);
			},
			args: false,
			rolesallowed: [
				"Owner"
			]
		},
		{
			name: "eval",
			category: "Admin",
			description: "Executes code",
			execute: function(client,msg,args){
				let code = args.join(" ");
				let retval = eval(code);
				msg.channel.send("`> " + retval + "`");
			},
			args: [
				{name: "code", required: true}
			],
			rolesallowed: [
				"Owner"
			]
		},
		{
			name: "ping",
			category: "Basic",
			description: "Pings discord",
			execute: function(client,msg,args){
				msg.channel.send("Pong!")
					.then(pong => {
						let pingtime = pong.createdTimestamp - msg.createdTimestamp;
						pong.edit("Pong! **" + pingtime + "ms**");
					})
					.catch(console.log);
			},
			args: false,
			rolesallowed: false
		},
		{
			name: "shop",
			category: "Currency",
			description: "DM's you a list of buyable items",
			execute: function(client,msg,args){
				msg.author.send({embed: shoputil.tc.embed()});
				msg.channel.send("DM'd you a list of buyable items");
			},
			args: false,
			rolesallowed: false
		},
		{
			name: "buy",
			category: "Currency",
			description: "Buys an item from the shop",
			execute: function(client,msg,args){
				let itemnum = args[0];
				if(itemnum){
					let num = parseInt(itemnum);
					if(num){
						shoputil.tc.buy(msg.member,num)
							.then(success => {
								msg.channel.send("Successfully bought item!");
							},err => {
								msg.channel.send(":no_entry_sign: Error: " + err);
							})
							.catch(console.log);
					} else{
						msg.channel.send(":no_entry_sign: Error: Please provide a valid item number");
					}
				} else{
					msg.channel.send(":no_entry_sign: Error: Please provide a valid item number");
				}
			},
			args: [
				{name: "itemnum", required: true}
			],
			rolesallowed: false
		},
		{
			name: "source",
			category: "Basic",
			description: "Some of the sexy programming behind the bot",
			execute: function(client,msg,args){
				msg.channel.send("I'll show you my source code if you show me yours ;)\nhttps://github.com/DrProgrammedChild/toxic-bot/");
			},
			args: false,
			rolesallowed: false
		},
		{
			name: "play",
			category: "Fun",
			description: "Plays a song",
			execute: function(client,msg,args){
				if(musicutil.playing){
					musicutil.queueAdd(args.join(" "),msg.author.username)
						.then(song => {
							msg.channel.send("Added **" + song.name + "** to queue.");
						})
						.catch(console.log);
				} else{
					if(msg.member.voiceChannel){
						musicutil.play(args.join(" "),msg.author.username,msg.member.voiceChannel,msg.channel);
					} else{
						msg.channel.send(":no_entry_sign: Error: You must be in a voice channel to use this command");
					}
				}
			},
			args: [
				{name: "song", required: true}
			],
			rolesallowed: false
		},
		{
			name: "pause",
			category: "Fun",
			description: "Pauses current song",
			execute: function(client,msg,args){
				musicutil.pause(msg);
			},
			args: false,
			rolesallowed: false
		},
		{
			name: "resume",
			category: "Fun",
			description: "Resumes current song",
			execute: function(client,msg,args){
				musicutil.resume(msg);
			},
			args: false,
			rolesallowed: false
		},
		{
			name: "disconnect",
			category: "Fun",
			description: "Disconnects from current voice channel",
			execute: function(client,msg,args){
				musicutil.disconnect(msg);
			},
			args: false,
			rolesallowed: false
		},
		{
			name: "queue",
			category: "Fun",
			description: "Displays queue",
			execute: function(client,msg,args){
				musicutil.getQueue()
					.then(queue => {
						let embed = {};
						embed.title = "Queue";
						embed.fields = [];
						embed.footer = {text: "Do -queue for queue"};
						for(let i = 0; i < queue.length; i++){
							let queueitem = queue[i];
							embed.fields.push({
								name: (i+1) + ") " + queueitem.name,
								value: "requested by **" + queueitem.requester + "**"
							});
						}
						msg.channel.send({embed: embed});
					})
					.catch(console.log);
			},
			args: false,
			rolesallowed: false
		},
		{
			name: "skip",
			category: "Fun",
			description: "Skips current song in queue",
			execute: function(client,msg,args){
				musicutil.skip(msg);
			},
			args: false,
			rolesallowed: false
		},
		{
			name: "meme",
			category: "Fun",
			description: "Gives you a MEME",
			execute: function(client,msg,args){
				let url;
				if(args[0] == "true"){
					url = "https://www.reddit.com/r/deepfriedmemes/new.json?sort=new";
				} else{
					url = "https://www.reddit.com/r/dankmemes/new.json?sort=new";
				}
				request(url,(err,res,body) => {
					let json = JSON.parse(body);
					let posts = json.data.children;
					let post = posts[random(0,posts.length)];
					while(post == undefined){
						post = posts[random(0,posts.length)];
					}
					msg.channel.send(post.data.title,{
						files: [
							post.data.url
						]
					});
				});
			},
			args: [
				{name: "deepfried", required: false}
			],
			rolesallowed: false
		},
		{
			name: "version",
			category: "Basic",
			description: "Version of the bot (and some legal stuff)",
			execute: function(client,msg,args){
				msg.channel.send("Version v1.0.0 (Full release)\nMade by _MFSec in assosiation with the Toxic cult\nCopyright 2018");
			},
			args: false,
			rolesallowed: false
		}
	]
};
