const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cors = require('cors');

const indexRouter = require('./routes/index');
const editorRouter = require('./routes/editor');
const swaggerRouter = require('./routes/swagger');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// static path
app.use('/public', express.static('public'));

// file upload
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: './public/files/'
	})
);

// cors
const whitelist = ['http://localhost:8080', 'http://localhost:8088', 'http://localhost:3200', 'http://localhost:3000'];
const corsOptions = {
	origin(origin, callback) {
		if (!origin || whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	allowedHeaders: ['Content-Type', 'Authorization'],
	exposedHeaders: ['Content-Disposition']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// routes
app.use('/', indexRouter);
app.use('/editor', editorRouter);
app.use('/swagger', swaggerRouter);

const server = app.listen(3000, () => {
	const port = server.address().port;
	console.log('Server is working - PORT :', port);
});
