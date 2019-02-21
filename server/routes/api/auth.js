const User = require('../../models/User');

module.exports = (app) => {
	app.post('/auth/login', (req, res) => {
		const { email, pw } = req.body;
		User.findOne(
			{
				email: email
			},
			(err, user) => {
				if (err) {
					return res.status(500).json({ message: 'err' });
				}

				if (!user) {
					return res.status(404).json({ message: 'Incorrect email' });
				}

				if (!user.validPassword(pw)) {
					return res.status(404).json({ message: 'Incorrect pw' });
				}

				return res.json(user);
			}
		);
	});

	app.post('/auth/join', (req, res) => {
		const { email, pw, age, gender, location } = req.body;
		User.findOne(
			{
				email: email
			},
			(err, user) => {
				console.log(1);
				if (err) {
					return res.status(500).json({ message: 'err' });
				}
				console.log(2);

				if (user) {
					return res.status(404).json({ message: 'email already exist' });
				}
				console.log(3);
				User.create(req.body);
				return res.json(req.body);
			}
		);
	});
};
