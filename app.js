/**
 * Module dependencies.
 */

var express = require('express'),
    connect = require('connect'),
	sys = require('sys'),
	cookie = require( "../cookie-node" ),
	redis = require("./lib/redis-client").createClient(),
	hash = require("./lib/hash"),
	Deck = require("./lib/deck").Deck;
var salt = "sUp3rS3CRiT$@lt";

redis.info(function (err, info) {
    if (err) throw new Error(err);
    console.log("Redis Version is: " + info.redis_version);
});

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.use(connect.bodyDecoder());
    app.use(connect.methodOverride());
    app.use(connect.compiler({ src: __dirname + '/public', enable: ['less'] }));
    app.use(app.router);
    app.use(connect.staticProvider(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(connect.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
   app.use(connect.errorHandler()); 
});

function get_customer_id(req, res){
	var customer_id = req.getCookie( "customer_id" )
	if(!customer_id){ customer_id = hash.md5(Date.now(), salt) };
	res.setCookie( "customer_id", customer_id );
	return customer_id;
};

// Routes
app.get('/', function(req, res){	
	var customer_id = get_customer_id(req, res);
	res.render('index.jade', {
		locals: {
	    	title: 'Global Thermonuclear War Dot JS',
			customer_id: customer_id
		}
	});
});

app.get("/board", function(req, res){
	console.log("Board requested!");
	var customer_id = get_customer_id(req, res);
	var deck = new Deck();
	deck.deal_to(customer_id, function(user_count, com_count){
		res.render('board.jade', {
			locals: {
				title: "Begin!",
	    		user: user_count,
				computer: com_count
			}
		});
	});
});

app.get("/turn", function(req, res){
	console.log("Hit requested");
	var customer_id = get_customer_id(req, res);
	var deck = new Deck();
	deck.hit_me(customer_id, function(player_card, comp_card, winner){
		console.log(winner + " wins this round.");
		res.render('turn.jade', {
			layout: false,
			locals: {
				winner: winner,
				player_card: player_card,
				comp_card: comp_card
			}
		});
	});
});

// Only listen on $ node app.js

if (!module.parent) app.listen(3000);
