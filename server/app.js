const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const server = http.createServer(app);

const session = require('express-session');
const FileStore = require('session-file-store')(session);
const port = 3001;

const dbRoute = 'mongodb://nohtaesang:shxotkd1!@ds129625.mlab.com:29625/sit';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
	session({
		secret: 'fasdfqwh@g4w5%#@%#jkghjk',
		resave: false,
		saveUninitialized: true,
		store: new FileStore()
	})
);

mongoose.Promise = global.Promise;
mongoose
	.connect(dbRoute, { useNewUrlParser: true })
	.then(() => console.log('Successfully connected to mongodb'))
	.catch((e) => console.error(e));

require('./routes')(app);

server.listen(port, () => console.log('Server listening on port ' + port));

const io = require('socket.io')(server);
io.on('connection', function(socket) {
	socket.on('join', (room, email) => {
		socket.join(room, () => {
			io.to(room).emit('join', email, email + ' join!');
		});
	});

	socket.on('message', (room, email, message) => {
		io.to(room).emit('message', email, message);
	});

	socket.on('leave', (room, email) => {
		io.to(room).emit('leave', email);
	});
});
