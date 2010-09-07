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
		if(parseInt(cardCount) === 26){ // Stop when half the deck is dealt.
			redis.sdiffstore(deck.computer_player(player), "deck", player, function(err, value){
				console.log("Cards dealt!");
				if(callback != null){ callback(26, 26) };
				return;
				console.log("This should never happen!!!!!!!!!!!!");
			}); // Other half of the deck is stored for the player's computer opponent.
		}else{
			if(cardCount > 26){
				console.log("Too many cards!");
				redis.del(player, function(err, value){
				deck.deal_to(player);
			});
			return;
			}
			console.log("Card count is: " + cardCount + " so I'm dealing...");
			redis.srandmember("deck", function(err, card){
				if(err) throw err;
				redis.sadd(player, card, function(err, value){ // Add the card to the user's pile.
					deck.deal_to(player); // Deal another card.
				}); 
			});
		};
	});
};

Deck.prototype.hit_me = function(player, callback, gameover_callback){
	var deck = this;
	
	var computer = this.computer_player(player);
	redis.spop(player, function(err, value){
		if(err) throw err;
		if(value == null){
			console.log("player is out of cards!");
			gameover_callback(computer);
			return;
		};
		
		var playerCard = String(value);		
		var playerCardArray = playerCard.split(":");
		redis.spop(computer, function(err, value){
			if(err) throw err;
			if(value == null){
				console.log("computer is out of cards!");
				gameover_callback(player);
				return;
			};
			
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
				console.log("Player has: " + player_count + " while computer has " + computer_count);
				deck.regroup(player, callback);
			};
			callback();
		});
	});
};

Deck.prototype.regroup = function(player, callback){
	var deck = this;
	console.log("Regrouping!");
	var computer = this.computer_player(player);
	redis.sdiffstore(player, deck.winnings(player), function(err, reply){
		if(err) throw err;
		redis.sdiffstore(computer, deck.winnings(computer), function(err, reply){
			if(err) throw err;
			redis.del(deck.winnings(player), function(err, value){
				redis.del(deck.winnings(computer), function(err, value){
					callback();
				});
			});
		});
	});
};

exports.Deck = Deck;