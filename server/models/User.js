const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	email: { type: String, required: true },
	pw: { type: String, required: true },
	gender: { type: String, required: true },
	age: { type: Number, required: true },
	location: { type: String, required: true }
});

UserSchema.statics.create = function(payload) {
	const user = new this(payload);
	return user.save();
};

UserSchema.methods.validPassword = function(pw) {
	return this.pw === pw;
};

module.exports = mongoose.model('User', UserSchema);
