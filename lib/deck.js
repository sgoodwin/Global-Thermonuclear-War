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
		
		if(cardCount === 26){ // Stop when half the deck is dealt.
			redis.sdiffstore(deck.computer_player(player), "deck", player); // Other half of the deck is stored for the player's computer opponent.
			console.log("Cards dealt!");
			if(callback != null) callback(26, 26);
			return;
		};
		redis.srandmember("deck", function(err, card){
			if(err) throw err;
			
			redis.sadd(player, card); // Add the card to the user's pile.
			deck.deal_to(player); // Deal another card.
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
				callback(playerCardArray[0], computerCardArray[0], "player");
			}else{
				redis.sadd(deck.winnings(computer), playerCard);
				redis.sadd(deck.winnings(computer), computerCard);
				callback(playerCardArray[0], computerCardArray[0], "computer");
			}
		});
	});
};

Deck.prototype.regroup = function(player, computer, callback){
	redis.sdiffstore(player, winnings(player), function(err, reply){
		redis.sdiffstore(computer, winnings(computer), function(err, reploy){
			redis.del(winnings(player));
			redis.del(winnings(computer));
		});
	});
};

exports.Deck = Deck;