const express = require('express')
const path = require('path')
const app = express()
const port = 8080

const { v4: uuidv4 } = require('uuid');

app.listen(port)

/*
    Serve static content from directory "public",
    it will be accessible under path /,
    e.g. http://localhost:8080/index.html
*/
app.use(express.static('public'))

// parse url-encoded content from body
app.use(express.urlencoded({ extended: false }))

// parse application/json content from body
app.use(express.json())

// serve index.html as content root
app.get('/', function(req, res){

    var options = {
        root: path.join(__dirname, 'public')
    }

    res.sendFile('index.html', options, function(err){
        console.log(err)
    })
})

const userDAO = [
	{ username: "Electra", password: "3190159" },
	{ username: "Alex", password: "3190106" },
];
const loggedInUsersDAO = {};
const cartDAO = {};

app.post('/login', (request, response) => {

	const { username, password } = request.body;

	let validUsername = false;

	for (let user of userDAO) {
		if (user.username === username && user.password === password) {
			validUsername = true;
		}
	}

	if (validUsername) {
		sessionId = uuidv4();

		loggedInUsersDAO[username] = sessionId;

		if (cartDAO[username] === undefined) {
			cartDAO[username] = {};
		}

		let responseObj = {
			"sessionId": sessionId,
		};

		response.status(200);
		response.send(JSON.stringify(responseObj));
	} else {
        response.status(401);
        response.send();
	}
})

app.post('/addToCart', (request, response) => {

	const { product, login: { username, sessionId } } = request.body;

	if (username === undefined && sessionId === undefined) {
		response.status(400);
		response.send();
		return;
	}

	let statusCode;

	if (loggedInUsersDAO[username] === sessionId) {

		let { id, title, cost } = product;
		let cartOfUser = cartDAO[username];

		if (cartOfUser[id] === undefined) {
			cartOfUser[id] = { "title": title, "cost": cost, "quantity": 1 };
		} else {
			cartOfUser[id]["quantity"] += 1;
		}

		statusCode = 200;
	} else {
		statusCode = 401;
	}

	response.status(statusCode);
	response.send();
})

app.get('/cartSizeService', (request, response) => {

	const { username, sessionId } = request.query;

	if (username === undefined && sessionId === undefined) {
		response.status(400);
		response.send();
		return;
	}

	if (loggedInUsersDAO[username] === sessionId) {

		let cartOfUser = cartDAO[username];

		let size = 0;
		Object.values(cartOfUser).forEach(product => {
			size += product["quantity"];
		});

		let responseObj = {
			"size": size,
		};
		response.status(200);
		response.send(JSON.stringify(responseObj));
	} else {
		response.status(401);
		response.send();
	}
})

app.get('/cartRetrievalService', (request, response) => {

	const { username, sessionId } = request.query;

	if (username === undefined && sessionId === undefined) {
		response.status(400);
		response.send();
		return;
	}

	if (loggedInUsersDAO[username] === sessionId) {
		let cartOfUser = cartDAO[username];

		let totalCost = 0;
		let cartItems = [];

		Object.values(cartOfUser).forEach(product => {
			totalCost += product["cost"] * product["quantity"];
			cartItems.push(product);
		});

		let responseObj = {
			"cartItems": cartItems,
			"totalCost": totalCost,
		};
		response.status(200);
		response.send(JSON.stringify(responseObj));
	} else {
		response.status(401);
		response.send();
	}
})
