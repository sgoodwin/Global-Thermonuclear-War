// Builds up the deck of cards for use any time this is setup somewhere new.
var redis = require("./lib/redis-client").createClient();

// Clubs
redis.sadd("deck", "c1:13");
redis.sadd("deck", "c2:2");
redis.sadd("deck", "c3:3");
redis.sadd("deck", "c4:4");
redis.sadd("deck", "c5:5");
redis.sadd("deck", "c6:6");
redis.sadd("deck", "c7:7");
redis.sadd("deck", "c8:8");
redis.sadd("deck", "c9:9");
redis.sadd("deck", "cj:10");
redis.sadd("deck", "cq:11");
redis.sadd("deck", "ck:12");

// Hearts
redis.sadd("deck", "h1:13");
redis.sadd("deck", "h2:2");
redis.sadd("deck", "h3:3");
redis.sadd("deck", "h4:4");
redis.sadd("deck", "h5:5");
redis.sadd("deck", "h6:6");
redis.sadd("deck", "h7:7");
redis.sadd("deck", "h8:8");
redis.sadd("deck", "h9:9");
redis.sadd("deck", "hj:10");
redis.sadd("deck", "hq:11");
redis.sadd("deck", "hk:12");

// Diamonds
redis.sadd("deck", "d1:13");
redis.sadd("deck", "d2:2");
redis.sadd("deck", "d3:3");
redis.sadd("deck", "d4:4");
redis.sadd("deck", "d5:5");
redis.sadd("deck", "d6:6");
redis.sadd("deck", "d7:7");
redis.sadd("deck", "d8:8");
redis.sadd("deck", "d9:9");
redis.sadd("deck", "dj:10");
redis.sadd("deck", "dq:11");
redis.sadd("deck", "dk:12");

// Spades

redis.sadd("deck", "s1:13");
redis.sadd("deck", "s2:2");
redis.sadd("deck", "s3:3");
redis.sadd("deck", "s4:4");
redis.sadd("deck", "s5:5");
redis.sadd("deck", "s6:6");
redis.sadd("deck", "s7:7");
redis.sadd("deck", "s8:8");
redis.sadd("deck", "s9:9");
redis.sadd("deck", "sj:10");
redis.sadd("deck", "sq:11");
redis.sadd("deck", "sk:12");