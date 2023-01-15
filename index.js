const { v4: uuidv4 } = require('uuid');
const express = require('express')
const path = require('path')
const app = express()
const port = 8080

app.listen(port)

/* 
    Serve static content from directory "public",
    it will be accessible under path /, 
    e.g. http://localhost:8080/index.html
*/
app.use(express.static('public'))

const user= {username:"Pain", password:"Manasu"};
const user2= {username: "Ass", password: "Mana2"};
const user_DB= [];
user_DB.push(user, user2);

const loggedInUsersDAO = {};

const cartDAO = {};

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

app.post('/login', (request, response) => {

	console.log("Incoming login request:", request.body);
    let sess=null;
    for (const x of user_DB){
        if(request.body.username===x.username && request.body.password===x.password){
            sess={ "sessionId": uuidv4() };

		loggedInUsersDAO[request.body.username] = sess.sessionId;

		if (cartDAO[request.body.username] === undefined) {
			cartDAO[request.body.username] = {};
		}

            response.status(200);
            response.send(JSON.stringify(sess));
            console.log(sess);
            console.log("Successful Login");
            break;
        } 
    }

    if(sess===null){
        response.status(401);
        response.send();
        console.log("Unsuccessful Login");
    }

})

app.post('/addToCart', (request, response) => {

	console.log("Incoming cart item request:", request.body);
	const { product, username, sessionId } = request.body
	if (username === undefined && sessionId === undefined) {
		response.status(401);
		response.send();
		return;
	}

	let statusCode;

	if (loggedInUsersDAO[username] === sessionId) {
		let cartOfUser = cartDAO[username];
		if (cartOfUser[product.productId] === undefined) {
			cartOfUser[product.productId] = {"title": product.title, "cost": product.cost, "quantity": 1};
			console.log("Just added ", cartOfUser[product.product]);
			console.log("Quantity ", cartOfUser[product.productId["quantity"]]);
		} else {
			cartOfUser[product] += 1;
		}
		console.log(`User ${username} has ${cartDAO[username][productId]} of product ${productId}`);

		statusCode = 200;
	} else {
		console.log(`User ${username} not logged in`);
		statusCode = 401;
	}

	response.status(statusCode);
	response.send();
})

app.post('/cartSizeService', (request, response) => {

	console.log("Incoming cart size service request:", request.body);
	const { username, sessionId } = request.body;

	if (username === undefined && sessionId === undefined) {
		response.status(401);
		response.send();
		return;
	}

	let statusCode;
	let size=0;
	let cartSize;

	if (loggedInUsersDAO[username] === sessionId) {
		console.log(`User data:` ,cartDAO);
		let usersCart= cartDAO[username];
		for(productId in usersCart){
			size+=usersCart[productId];
		}

		cartSize= {"size": size};
		statusCode = 200;
	} else {
		console.log(`User ${username} not logged in`);
		statusCode = 401;
	}


	response.status(statusCode);
	response.send(JSON.stringify(cartSize));

	
})


app.post('/cartRetrievalService', (request, response) => {

	console.log("Incoming cart retrival service request:", request.body);
	const { username, sessionId } = request.body;

	if (username === undefined && sessionId === undefined) {
		response.status(401);
		response.send();
		return;
	}

	let statusCode;
	

	if (loggedInUsersDAO[username] === sessionId) {
		let user = cartDAO[username];
		statusCode = 200;
	} else {
		console.log(`User ${username} not logged in`);
		statusCode = 401;
	}

	response.status(statusCode);
	response.send();



})


cartDAO = {
	"Alex":  {
		id1: {title: "Apple", cost: 3, quantity: 5}, 
		id2: {title: "Orange", cost: 8, quantity: 2},
		'3': { title: 'banana', cost: 10, quantity: 2 }
	}
}

prodBanana = {
	title: "banana",
	cost: 10,
	id: 3,
};

let productsOfAlex = cartDAO["Alex"];
productsOfAlex[prodBanana.id]= {
	title: prodBanana.title, cost: prodBanana.cost, quantity: 1 
}

productsOfAlex[prodBanana.id]["quantity"]+=1
