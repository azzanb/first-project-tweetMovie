const express = require('express'),
	router = express.Router(),
	request = require('request-promise'),
	commaNumber = require('comma-number'),

	Twit = require('twit'),
	configKey = require('./config.js'),
	tweet = new Twit(configKey),
	ta = require('time-ago'),

	{Data} = require('./../../db/models/Data'),

	movieApiKey = require('../movieAPI');



//------------Twitter API Call------------//
//GET user tweets
function statuses(req, res, next){
	tweet.get('statuses/user_timeline', (err, statuses, res) => {
		err ? next(err) : 
			req.statuses = statuses;
			next();
	});
}
//------------Twitter API Call------------//




//------------Intro Page------------//
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
//------------Intro Page------------//




//------------Home Route------------//
router.get('/home', (req, res) => {

	Data.find().then((database) => {
		const num = database.length - 1;

		return request({ //GET movie details
			method: 'GET',
			uri: `http://www.omdbapi.com/?apikey=${movieApiKey}&t=${database[num].movie}&y=${database[num].year}`
		})

		.then(movieDetails => {
			res.render('homeLayout', {
				movie: JSON.parse(movieDetails),
			});

		});
	});
});
//------------Home Route------------//





//------------Coming Soon Route------------//
router.get('/notYet', statuses, function(req,res){
	let allStatuses = [];

	for(let i = 0; i < 5; i++){
		allStatuses.push(req.statuses[i].text)
	}

	console.log(allStatuses)
	
	res.render('notYet', {
		statuses: allStatuses
	});
});
//------------Coming Soon Route------------//


module.exports = router;




