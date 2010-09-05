// Builds up the deck of cards for use any time this is setup somewhere new.
var redis = require("./lib/redis-client").createClient();

// Make sure there isn't a deck already.
redis.del("deck");

// Clubs
redis.sadd("deck", "c1:14");
redis.sadd("deck", "c2:2");
redis.sadd("deck", "c3:3");
redis.sadd("deck", "c4:4");
redis.sadd("deck", "c5:5");
redis.sadd("deck", "c6:6");
redis.sadd("deck", "c7:7");
redis.sadd("deck", "c8:8");
redis.sadd("deck", "c9:9");
redis.sadd("deck", "c10:10");
redis.sadd("deck", "cj:11");
redis.sadd("deck", "cq:12");
redis.sadd("deck", "ck:13");

// Hearts
redis.sadd("deck", "h1:14");
redis.sadd("deck", "h2:2");
redis.sadd("deck", "h3:3");
redis.sadd("deck", "h4:4");
redis.sadd("deck", "h5:5");
redis.sadd("deck", "h6:6");
redis.sadd("deck", "h7:7");
redis.sadd("deck", "h8:8");
redis.sadd("deck", "h9:9");
redis.sadd("deck", "h10:10");
redis.sadd("deck", "hj:11");
redis.sadd("deck", "hq:12");
redis.sadd("deck", "hk:13");

// Diamonds
redis.sadd("deck", "d1:14");
redis.sadd("deck", "d2:2");
redis.sadd("deck", "d3:3");
redis.sadd("deck", "d4:4");
redis.sadd("deck", "d5:5");
redis.sadd("deck", "d6:6");
redis.sadd("deck", "d7:7");
redis.sadd("deck", "d8:8");
redis.sadd("deck", "d9:9");
redis.sadd("deck", "d10:10");
redis.sadd("deck", "dj:11");
redis.sadd("deck", "dq:12");
redis.sadd("deck", "dk:13");

// Spades

redis.sadd("deck", "s1:14");
redis.sadd("deck", "s2:2");
redis.sadd("deck", "s3:3");
redis.sadd("deck", "s4:4");
redis.sadd("deck", "s5:5");
redis.sadd("deck", "s6:6");
redis.sadd("deck", "s7:7");
redis.sadd("deck", "s8:8");
redis.sadd("deck", "s9:9");
redis.sadd("deck", "s10:10");
redis.sadd("deck", "sj:11");
redis.sadd("deck", "sq:12");
redis.sadd("deck", "sk:13");

redis.scard("deck", function(err, value){
	if(err) throw err;
	console.log(value + " cards created. All set.");
});