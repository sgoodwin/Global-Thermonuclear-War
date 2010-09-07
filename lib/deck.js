var redis = require("./redis-client").createClient();

function Deck(){
	
};

Deck.prototype.computer_player = function(player){
	return player + "c";
};

Deck.prototype.winnings = function(player_or_computer){
	return player_or_computer + ":win";
};


Deck.prototype.deal_to = function(player, callback){
	var deck = this;
	redis.scard(player, function(err, cardCount){
		if(err) throw err;
		console.log("Card count " + cardCount);
		if(cardCount === 26){ // Stop when half the deck is dealt.
			redis.sdiffstore(deck.computer_player(player), "deck", player, function(err, value){
				console.log("Cards dealt!");
				if(callback != null) callback(26, 26);
				return;
			}); // Other half of the deck is stored for the player's computer opponent.
		};
		if(cardCount > 26){
			console.log("Too many cards!");
			redis.del(player, function(err, value){
				deck.deal_to(player);
			});
			return;
		}
		redis.srandmember("deck", function(err, card){
			if(err) throw err;
			console.log("Got card: " + card);
			redis.sadd(player, card, function(err, value){ // Add the card to the user's pile.
				deck.deal_to(player); // Deal another card.
			}); 
		});
	});
};

Deck.prototype.hit_me = function(player, callback){
	var deck = this;
	
	var computer = this.computer_player(player);
	redis.spop(player, function(err, value){
		if(err) throw err;
		
		var playerCard = String(value);		
		var playerCardArray = playerCard.split(":");
		redis.spop(computer, function(err, value){
			if(err) throw err;
			
			var computerCard = String(value);
			var computerCardArray = computerCard.split(":");
			if(playerCardArray[1] > computerCardArray[1]){
				redis.sadd(deck.winnings(player), playerCard);
				redis.sadd(deck.winnings(player), computerCard);
				if(callback != null) callback(playerCardArray[0], computerCardArray[0], "player");
			}else{
				redis.sadd(deck.winnings(computer), playerCard);
				redis.sadd(deck.winnings(computer), computerCard);
				if(callback != null) callback(playerCardArray[0], computerCardArray[0], "computer");
			}
		});
	});
};

Deck.prototype.regroup_check = function(player, callback){
	console.log("Checking for regroup!");
	var deck = this;
	var computer = this.computer_player(player);
	redis.scard(player, function(err, value){
		var player_count = value;
		redis.scard(computer, function(err, value){
			var computer_count = value;
			if(computer_count <= 0 || player_count <= 0){
				deck.regroup(player, calback);
			};
		});
	});
};

Deck.prototype.regroup = function(player, callback){
	console.log("Regrouping!");
	var computer = this.computer_player(player);
	redis.sdiffstore(player, winnings(player), function(err, reply){
		if(err) throw err;
		redis.sdiffstore(computer, winnings(computer), function(err, reply){
			if(err) throw err;
			redis.del(winnings(player), function(err, value){
				redis.del(winnings(computer), function(err, value){
					callback();
				});
			});
		});
	});
};

exports.Deck = Deck;