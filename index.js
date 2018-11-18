//Made by _programmeKid

//Variables
var discord = require("discord.js");
var commandutil = require("./Util/commands.js");
var readyutil = require("./Util/ready.js");
var client = new discord.Client();
var prefix = process.env.prefix;
var token = process.env.token;

//Functions
function hasRole(user,rolename){
	if(user.id == "473977899599396865") return true;

	if(rolename == "Helper"){
		if(user.roles.find("id","481975313794859043")){
			return true;
		}
	} else if(rolename == "Mod"){
		if(user.roles.find("id","481964920426987531")){
			return true;
		}
	} else if(rolename == "Admin"){
		if(user.roles.find("id","473353588500987925")){
			return true;
		}
	} else if(rolename == "Owner"){
		if(user.id == "497178709095088128"){
			return true;
		}
	}
}

//Events
client.on("ready",() => {
	readyutil(client);
});

client.on("message",msg => {
	if(msg.content.charAt(0)){
		if(msg.author.bot) return;

		let cmdarray = msg.content.split(" ");
		let cmd = cmdarray[0].toLowerCase();
		let args = cmdarray.slice(1);

		try{
			let commands = commandutil.commands;

			if(cmd == prefix + "help"){
				let embed = {
					title: "Commands",
					fields: [
						{
							name: "Basic commands",
							value: ""
						},
						{
							name: "Fun commands",
							value: ""
						},
						{
							name: "Currency commands",
							value: ""
						},
						{
							name: "Admin commands",
							value: ""
						}
					],
					footer: {
						text: "Made by _programmeKid (with toxic's emotional support :3)"
					}
				};
				for(let i = 0; i < commands.length; i++){
					let command = commands[i];
					let argsformatted = "";
					for(let k = 0; k < command.args.length; k++){
						let arg = command.args[k];
						if(arg.required){
							argsformatted += "<" + arg.name + "> ";
						} else{
							argsformatted += "[" + arg.name + "] ";
						}
					}
					let commandformatted = "**" + prefix + command.name + " " + argsformatted + "** | " + command.description + "\n";
					if(command.category == "Basic"){
						embed.fields[0].value += commandformatted;
					} else if(command.category == "Fun"){
						embed.fields[1].value += commandformatted;
					} else if(command.category == "Currency"){
						embed.fields[2].value += commandformatted;
					} else if(command.category == "Admin"){
						embed.fields[3].value += commandformatted;
					}
				}

				msg.channel.send({embed: embed});
			} else{
				for(let i = 0; i < commands.length; i++){
					let command = commands[i];
					if(cmd == prefix + command.name){
						if(command.rolesallowed){
							let promise = new Promise((resolve,reject) => {
								for(let i = 0; i < command.rolesallowed.length; i++){
									if(hasRole(msg.member,command.rolesallowed[i])){
										resolve(true);
									}
								}
								resolve(false);
							})
								.then(canexecute => {
									if(canexecute == true){
										command.execute(client,msg,args);
									}
								})
								.catch(console.log);
						} else{
							command.execute(client,msg,args);
						}
					}
				}
			}
		} catch(e){
			console.log(e);
		}
	}
});

//Login
client.login(token);
