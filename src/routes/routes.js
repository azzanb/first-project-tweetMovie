const express = require('express'),
	router = express.Router(),
	request = require('request-promise'),
	commaNumber = require('comma-number'),

	Twit = require('twit'),
	configKey = require('./config'),
	tweet = new Twit(configKey),
	ta = require('time-ago'),

	{Data} = require('./../../db/models/Data'),

	movieApiKey = '9af06f22';


//------------Twitter API Calls------------//

//GET user profile data 
function credentials(req, res, next){
	tweet.get('account/verify_credentials', { skip_status: true }, function(err, credentials, res){
		req.credentials = credentials;
		next();
	});
}

//GET user tweets
function statuses(req, res, next){
	tweet.get('statuses/user_timeline', (err, statuses, res) => {
		req.statuses = statuses;
		next();
	});
}

//GET who user follows
function friends(req, res, next){
	tweet.get('friends/list', function(err, friends, res){
		req.friends = friends;
		next();
	});
}

//GET who follows user
function followers(req, res, next){
	tweet.get('followers/list', (err, followers, res) => {
		req.followers = followers;
		next();
		
	});
}

//------------END: Twitter API Calls------------//




router.get('/introPage', (req, res, next) => {
	console.log(res.locals);
	res.render('introPage');
});

router.post('/introPage', (req, res) => {
	res.locals.address = req.body.address;

	const data = new Data({
		movie: req.body.movie,
		year: req.body.year
	});

	data.save().then((doc) => {
		res.status(201).redirect('/home');
	}).catch((err) => {
		console.log(err);
		if (err.errors.year.path === 'year' || err.errors.movie.path === 'movie'){
			// res.send(err);
			res.render('introPage', {
				errYearMessage: "Year must be formatted as YYYY",
				errMovieMessage: "Make Sure Movie Title is Correct",
			})
		}
	});
});



router.get('/home', credentials, statuses, friends, followers, (req, res) => {

	Data.find().then((database) => {
		const num = database.length - 1;
		const followerNums = [];
		const friendNums = [];
		
		for(let i = 0; i <= 5; i++){
			followerNums.push(commaNumber(req.friends.users[i].followers_count));
			friendNums.push(commaNumber(req.friends.users[i].friends_count));
		}

		return request({ //GET movie details
			method: 'GET',
			uri: `http://www.omdbapi.com/?apikey=${movieApiKey}&t=${database[num].movie}&y=${database[num].year}`
		})

		.then(movieDetails => {
			res.render('home', {
				movie: JSON.parse(movieDetails),
				credentials: req.credentials,
				status: req.statuses,
				friend: req.friends,
				friendNums,
				follower: req.followers.users,
				followerNums,
				time_ago: ta.ago(req.credentials.created_at)
			});

		});
	});
});



module.exports = router;




