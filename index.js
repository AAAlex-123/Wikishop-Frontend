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

	const { productId, username, sessionId } = request.body

	if (username === undefined && sessionId === undefined) {
		response.status(401);
		response.send();
		return;
	}

	let statusCode;

	if (loggedInUsersDAO[username] === sessionId) {
		let user = cartDAO[username];
		if (user[productId] === undefined) {
			user[productId] = 1;
		} else {
			user[productId] += 1;
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

