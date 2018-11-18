var ytdl = require("ytdl-core");
var request = require("request");
var youtubeinfo = require("youtube-info");
var youtubeid = require("get-youtube-id");
var youtubeapikey = process.env.youtubeapikey;
var queue = [];
var dispatcher;
var vc;
var mod = {
	playing: false,
	queueAdd: function(str,requester){
		return new Promise((resolve,reject) => {
			search(str)
				.then(url => {
					youtubeinfo(youtubeid(url),(err,info) => {
						let song = {
							name: info.title,
							url: url,
							requester: requester
						};
						queue.push(song);
						resolve(song);
					});
				})
				.catch(console.log);
		});
	},
	play: function(str,requester,vc,txt){
		mod.queueAdd(str,requester)
			.then(song => {
				play(queue[0],vc,txt);
			})
			.catch(console.log);
	},
	pause: function(msg){
		if(dispatcher){
			if(mod.playing){
				mod.playing = false;
				dispatcher.pause();
			} else{
				msg.channel.send(":no_entry_sign: Error: Song already paused");
			}
		} else{
			msg.channel.send(":no_entry_sign: Error: Nothing is playing");
		}
	},
	resume: function(msg){
		if(dispatcher){
			if(!mod.playing){
				mod.playing = true;
				dispatcher.resume();
			} else{
				msg.channel.send(":no_entry_sign: Error: Song already playing");
			}
		} else{
			msg.channel.send(":no_entry_sign: Error: Nothing is playing");
		}
	},
	disconnect: function(msg){
		if(vc){
			queue = [];
			if(dispatcher){
				dispatcher.end();
				dispatcher = undefined;
			}
			if(vc){
				vc.leave();
				msg.channel.send("Left voice channel.");
				vc = undefined;
				queue = [];
			}
		} else{
			msg.channel.send(":no_entry_sign: Error: Not connected to a voice channel");
		}
	},
	getQueue: function(){
		return new Promise((resolve,reject) => {
			resolve(queue);
		});
	},
	skip: function(msg){
		if(vc){
			if(dispatcher){
				dispatcher.end();
			} else{
				msg.channel.send(":no_entry_sign: Error: Nothing is playing");
			}
		} else{
			msg.channel.send(":no_entry_sign: Error: Not connected to a voice channel");
		}
	}
};

function isYoutube(str){
	return str.toLowerCase().indexOf("youtube.com") > -1;
}

function search(query){
	return new Promise((resolve,reject) => {
		request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query) + "&key=" + youtubeapikey,(err,res,body) => {
			let json = JSON.parse(body);
			resolve("https://www.youtube.com/watch?v=" + json.items[0].id.videoId);
		});
	});
}

function play(song,channel,txt){
	channel.join()
		.then(con => {
			vc = channel;
			let stream = ytdl(song.url,{filter: "audioonly"});
			dispatcher = con.playStream(stream);
			mod.playing = true;
			txt.send("Playing **" + song.name + "** (requested by **" + song.requester + "**)");
			dispatcher.on("end",() => {
				mod.playing = false;
				dispatcher = undefined;
				queue.shift();
				if(queue[0]){
					play(queue[0],channel,txt);
				} else{
					channel.leave();
					vc = undefined;
				}
			});
		})
		.catch(console.log);
}

module.exports = mod;