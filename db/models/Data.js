const mongoose = require('mongoose'),
	validator = require('validator');

const Data = mongoose.model('Data',{
	movie: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		validate: {
			isAsync: false,
			message: "Make sure movie has been entered!"
		}
	},
	year: {
		type: String,
		required: true,
		minlength: 1,
		validate: {
			isAsync: false,
			validator: validator.isNumeric,
			message: "{VALUE} should be formatted as YYYY"
		}
	}
});

module.exports = {Data};