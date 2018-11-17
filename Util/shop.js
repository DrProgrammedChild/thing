var database = require("./Database/database.js");

class ShopItem{
	constructor(options){
		this.name = options.name;
		this.price = options.price;
		this.currency = options.currency;
		this.description = options.description;
		this.roleid = options.roleid;
	}
	buy(user){
		return new Promise((resolve,reject) => {
			database.getUser(user)
				.then(dbentry => {
					if(dbentry[this.currency] >= this.price){
						user.addRole(this.roleid);
						dbentry.takeTc(this.price);
						resolve("Success");
					} else{
						reject("Insufficient funds");
					}
				})
				.catch(console.log);
		});
	}
}

class Shop{
	constructor(options){
		this.items = options.items;
	}
	buy(user,item){
		return new Promise((resolve,reject) => {
			this.items[item - 1].buy(user)
				.then(success => {
					resolve(success);
				},err => {
					reject(err);
				})
				.catch(console.log);
		});
	}
	embed(){
		let embed = {};
		embed.title = "Shop";
		embed.footer = {text: "Do -buy <shopnum> to buy an item."};
		embed.fields = [];
		for(let i = 0; i < this.items.length; i++){
			let item = this.items[i];
			let field = {};
			field.name = (i+1) + ") " + item.name;
			field.value = "Description: " + item.description + "\nPrice: " + item.price + " " + item.currency;
			embed.fields.push(field);
		}
		return embed;
	}
}

module.exports = {
	tc: new Shop({
		items: [
			new ShopItem({
				name: "Semi-Known",
				price: 200,
				currency: "tc",
				description: "We kinda know you at this point but still...",
				roleid: "472523550809653259"
			}),
			new ShopItem({
				name: "Known",
				price: 400,
				currency: "tc",
				description: "We know you now but we don't notice you.",
				roleid: "472523448229560342"
			}),
			new ShopItem({
				name: "Respected",
				price: 600,
				currency: "tc",
				description: "We respect you enough to give you this role.",
				roleid: "472523739423178752"
			}),
			new ShopItem({
				name: "Devoted",
				price: 1000,
				currency: "tc",
				description: "You would give your life for the Toxic Cult.",
				roleid: "472523876669194241"
			})
		]
	})
};