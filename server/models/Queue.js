const mongoose = require('mongoose');

const QueueSchema = new mongoose.Schema({
	email: { type: String, required: true },
	gender: { type: String, required: true },
	keyword1: { type: String, required: true },
	keyword2: { type: String, required: true },
	keyword3: { type: String, required: true }
});

QueueSchema.statics.create = function(payload) {
	const queue = new this(payload);
	return queue.save();
};

module.exports = mongoose.model('Queue', QueueSchema);
