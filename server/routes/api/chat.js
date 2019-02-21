const Queue = require('../../models/Queue');

module.exports = (app) => {
	app.post('/chat/queue/isExist', (req, res) => {
		const { email, gender, keyword1, keyword2, keyword3 } = req.body;

		const otherGender = gender === 'man' ? 'woman' : 'man';
		Queue.findOne(
			{
				gender: otherGender,
				keyword1,
				keyword2,
				keyword3
			},
			(err, queue) => {
				if (err) {
					return res.status(500).json({ message: 'err' });
				}

				if (!queue) {
					return res.json(null);
				}

				queue.remove();
				return res.json({ email: queue.email });
			}
		);
	});

	app.post('/chat/queue/insert', (req, res) => {
		const { email } = req.body;
		Queue.findOne(
			{
				email
			},
			(err, queue) => {
				if (err) {
					return res.status(500).json({ message: 'err' });
				}

				if (!queue) {
					Queue.create(req.body);

					return res.json({ email });
				}

				queue.remove();
				Queue.create(req.body);
				return res.json({ email });
			}
		);
	});

	app.post('/chat/queue/delete', (req, res) => {
		const { email } = req.body;
		Queue.findOne(
			{
				email
			},
			(err, queue) => {
				if (err) {
					return res.status(500).json({ message: 'err' });
				}

				if (!queue) {
					return res.json({ message: "doesn't exist " });
				}

				queue.remove();
				return res.json({ message: 'success' });
			}
		);
	});
};
