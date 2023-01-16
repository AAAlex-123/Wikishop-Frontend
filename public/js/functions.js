
filterClick = (subcategoryId, contentElementId) => {
	let filteredProducts = fetched_products;

	if (subcategoryId !== -1) {
		filteredProducts = filteredProducts.filter(
			prod => prod.subcategory_id === subcategoryId
		)
	}

	let htmlContent = templates.products({
		"products": filteredProducts,
	});

	document.querySelector(`#${contentElementId}`).innerHTML = htmlContent;
}

var lastUsername = undefined;
var lastSessionId = undefined;

loginFormSubmit = () => {
	// 1: create request
	var request = new XMLHttpRequest();

	// 2: add listeners
	request.onreadystatechange = () => {
		if (request.readyState === XMLHttpRequest.DONE) {
			console.log(request.status);
			if (request.status == 200) {
				let txt = request.responseText;
				let obj = JSON.parse(txt);
				document.querySelector("#form-result-success").style.display = "block";
				document.querySelector("#form-result-failed").style.display = "none";
				let frames = 10
				for (i in [...Array(frames).keys()]) {
					let perc = i / frames;
					setTimeout(setOpacity, perc * 1000, 1 - perc, document.querySelector("#form-result-success"));
				}	
				setTimeout(messageCollapse, 1000);
				console.log(obj);
				// save session id and username used to login
				lastSessionId = obj.sessionId;
				lastUsername = document.querySelector("#username").value;
				console.log(`Saved credentials: username - ${lastUsername}, sessionId - ${lastSessionId}`);
				cartSizeService();
			} else if (request.status==401){
				document.querySelector("#form-result-failed").style.display = "block";
				document.querySelector("#form-result-success").style.display = "none";
				let frames = 10
				for (i in [...Array(frames).keys()]) {
					let perc = i / frames;
					setTimeout(setOpacity, perc * 1000, 1 - perc, document.querySelector("#form-result-failed"));
				}	
				setTimeout(messageCollapse, 1000);
			} else {
				console.log(`Request failed with unknown status ${request.status}: ${request.statusText}`);
			}
		}
	}

	// 3: set method, url and headers
	request.open("POST", "/login");
	request.setRequestHeader("Accept", "application/json");
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	// 4: send data
	let formElement = document.querySelector("#login-form");
	let formData = new FormData(formElement)
	let queryString = new URLSearchParams(formData).toString();
	request.send(queryString);
}

addToCart = (productId, cost, title) => {

	console.log(`Add to cart: ${productId}, with cost ${cost} and name ${title}` );

	// 1: create request
	var request = new XMLHttpRequest();

	// 2: add listeners
	request.onreadystatechange = () => {
		if (request.readyState === XMLHttpRequest.DONE) {
			console.log(`Add to Cart Response: ${request.status}`)
			if (request.status == 200) {
				cartSizeService();
			} else if (request.status==401){
				alert("Please log in to add product to cart");
			} else {
				console.log(`Request failed with unknown status ${request.status}: ${request.statusText}`);
			}
		}
	}

	// 3: set method, url and headers
	request.open("POST", "/addToCart");
	request.setRequestHeader("Accept", "application/json");
	request.setRequestHeader("Content-Type", "application/json");

	// 4: send data
	let data = {
		product: {"title": title, "cost": cost, "id": productId },
		username: lastUsername,
		sessionId: lastSessionId
	}
	request.send(JSON.stringify(data));
}

cartSizeService= () => {

	console.log(`Cart size`);

	// 1: create request
	var request = new XMLHttpRequest();

	// 2: add listeners
	request.onreadystatechange = () => { 
		if (request.readyState === XMLHttpRequest.DONE) {
			console.log(`Add to Cart Response: ${request.status}`)
			if (request.status == 200) {
				let txt = request.responseText;
				let obj = JSON.parse(txt);
				console.log(`Request`, obj);
				document.querySelector("#cartSize").innerHTML= `Cart size: ${obj["size"]}`;
			} else if (request.status==401){
				alert("Please log in to add product to cart");
			} else {
				console.log(`Request failed with unknown status ${request.status}: ${request.statusText}`);
			}
		}		
	}

	// 3: set method, url and headers
	request.open("POST", "/cartSizeService");
	request.setRequestHeader("Accept", "application/json");
	request.setRequestHeader("Content-Type", "application/json");

	// 4: send data
	let data = {
		username: lastUsername,
		sessionId: lastSessionId,
	}
	request.send(JSON.stringify(data));
}

cartRetrievalService=(username, sessionId) => {

	console.log(`View Cart`);

	// 1: create request
	var request = new XMLHttpRequest();

	// 2: add listeners
	request.onreadystatechange = () => { 
		if (request.readyState === XMLHttpRequest.DONE) {
			console.log(`Return Cart Response: ${request.status}`)
			if (request.status == 200) {
				let txt = request.responseText;
				let obj = JSON.parse(txt);
				console.log(`Request`, obj);
				let htmlContent = templates.cart(obj);
				document.querySelector(`#${contentElementId}`).innerHTML = htmlContent;
			} else if (request.status==401){
				alert("Please log in to view the cart");
			} else {
				console.log(`Request failed with unknown status ${request.status}: ${request.statusText}`);
			}
		}		
	}

	// 3: set method, url and headers
	request.open("GET", "/cartRetrievalService");
	request.setRequestHeader("Accept", "application/json");
	request.setRequestHeader("Content-Type", "application/json");

	// 4: send data
	let data = {
		username: username,
		sessionId: sessionId,
	}
	request.send(JSON.stringify(data));

}

messageCollapse= function() {
	const succLog = document.getElementById('form-result-success');
	const failLog = document.getElementById('form-result-failed');

	succLog.style.display = 'none';
	failLog.style.display = 'none';

}

setOpacity = function(op, el) {
    el.style.opacity = op;
}

