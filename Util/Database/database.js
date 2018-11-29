var fs = require("drop-fs")({apiKey: process.env.dbkey});
var dbjson = fs.readFileSync("./database.json");

class User{
	constructor(options){
		this.name = options.name;
		this.id = options.id;
		this.tc = options.tc;
		this.bc = options.bc;
		this.tfc = options.tfc;
		this.nbc = options.nbc;
	}
	giveTc(amount){
		this.tc += amount;
		dbjson["id-" + this.id] = {
			name: this.name,
			id: this.id,
			tc: this.tc,
			bc: this.bc,
			tfc: this.tfc,
			nbc: this.nbc
		};
		fs.writeFile("./database.json",JSON.stringify(dbjson),console.log);
	}
	takeTc(amount){
		this.tc -= amount;
		dbjson["id-" + this.id] = {
			name: this.name,
			id: this.id,
			tc: this.tc,
			bc: this.bc,
			tfc: this.tfc,
			nbc: this.nbc
		};
		fs.writeFile("./database.json",JSON.stringify(dbjson),console.log);
	}
}

module.exports = {
	getUser: function(user){
		return new Promise((resolve,reject) => {
			let dbentry = dbjson["id-" + user.id];
			if(dbentry){
				let usere = new User(dbentry);
				resolve(usere);
			} else{
				dbentry = {
					name: user.user.username,
					id: user.id,
					tc: 10,
					bc: 0,
					tfc: 0,
					nbc: 0
				}
				dbjson["id-" + user.id] = dbentry;
				fs.writeFile("./database.json",JSON.stringify(dbjson),console.log);
				let usere = new User(dbentry);
				resolve(usere);
			}
		});
	}
};
