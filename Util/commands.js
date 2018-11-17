var database = require("./Database/database.js");
var shoputil = require("./shop.js");

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
		}
	]
};