
const filterClick = (subcategoryId, contentElementId) => {
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

const openCartPage=()=> {
	let { username, sessionId} = lastLoginCredentials;
	window.open(`cart.html?username=${username}&sessionId=${sessionId}` , "_blank");
}

const productsTemplate = Handlebars.compile(`
	{{#each products}}
		<section>
			<aside class="left">
				<img alt="{{title}}" class="product-preview" src="{{image}}">
			</aside>
			<aside class="right">
				<span class="price">
					{{cost}}$
				</span>
				<button onclick="addToCart({{id}}, {{cost}}, \`{{title}}\`)">
					Add to Cart
				</button>
			</aside>
			<header>
				<strong>
					{{title}}
				</strong>
			</header>
			<span class="product-code">
				{{id}}
			</span>
			<p class="short-description">
				{{description}}
			</p>
		</section>
	{{/each}}
`);

const filterTemplate = Handlebars.compile(`
	<p>Filter</p>
	<div>
		<div>
			<input type="radio" id="-1" name="filter" value="allprod" checked onclick="filterClick(-1, 'category-main-content')">
			<label for="-1">All</label><br>
		</div>
		{{#each subcategory}}
			<div>
				<input type="radio" id="{{id}}" name="filter" value="{{title}}" onclick="filterClick({{id}}, 'category-main-content')">
				<label for="{{id}}">{{title}}</label><br>
			</div>
		{{/each}}
	</div>
`);

let fetchedProducts = undefined;

const loadProducts = (contentElementId, filterElementId) => {

	const searchParams = new URLSearchParams(window.location.search);

	const categoryId = searchParams.get('categoryId');

	fetch(`https://wiki-shop.onrender.com/categories/${categoryId}/products`)
		.then(response => {
			return response.json()
		})
		.then(raw_obj => {

			fetchedProducts = raw_obj;

			let htmlContent = productsTemplate({
				"products": raw_obj,
			});

			document.querySelector(`#${contentElementId}`).innerHTML = htmlContent;
		});

	fetch(`https://wiki-shop.onrender.com/categories/${categoryId}/subcategories`)
		.then(response => {
			return response.json();
		})
		.then(raw_obj => {

			let htmlContent = filterTemplate({
				"subcategory": raw_obj,
			});

			document.querySelector(`#${filterElementId}`).innerHTML = htmlContent;
		});
}

const showLoginResultText = (success) => {
	let elementSuccess = document.querySelector("#form-result-success")
	let elementFailed = document.querySelector("#form-result-failed")

	// show only appropriate text
	elementSuccess.style.display = success ? "block" : "none";
	elementFailed.style.display = success ? "none" : "block";

	let elementToAnimate = success ? elementSuccess : elementFailed;

	// animate shown text fade out
	let frames = 10;
	for (i in [...Array(frames).keys()]) {
		let perc = i / frames;
		setTimeout(() => {
			elementToAnimate.style.opacity = 1 - perc
		}, perc * 1000);
	}

	setTimeout(() => {
		elementToAnimate.style.display = "none";
	}, 1000);
}

const lastLoginCredentials = {
	username: undefined,
	sessionId: undefined,
};

const reportRequestFailed = (request) => {
	console.log(`Request failed with unknown status ${request.status}: ${request.statusText}`);
}

const loginFormSubmit = () => {

	// 1: create request
	var request = new XMLHttpRequest();

	// 2: add listeners
	request.onload = () => {
		if (request.status === 200) {
			let txt = request.responseText;
			let obj = JSON.parse(txt);

			// save session id and username used to login
			lastLoginCredentials.sessionId = obj.sessionId;
			lastLoginCredentials.username = document.querySelector("#username").value;

			// update cart item count
			cartSizeService();

			showLoginResultText(true);
		} else if (request.status === 401){
			showLoginResultText(false);
		} else {
			reportRequestFailed(request);
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

const addToCart = (productId, cost, title) => {

	// 1: create request
	var request = new XMLHttpRequest();

	// 2: add listeners
	request.onload = () => {
		if (request.status === 200) {
			cartSizeService();
		} else if (request.status === 401) {
			alert("Please log in to add product to cart");
		} else {
			reportRequestFailed(request);
		}
	}

	// 3: set method, url and headers
	request.open("POST", "/addToCart");
	request.setRequestHeader("Accept", "application/json");
	request.setRequestHeader("Content-Type", "application/json");

	// 4: send data
	let data = {
		product: {
			"title": title,
			"cost": cost,
			"id": productId,
		},
		login: lastLoginCredentials,
	}

	request.send(JSON.stringify(data));
}

const cartSizeService = () => {

	// 1: create request
	var request = new XMLHttpRequest();

	// 2: add listeners
	request.onload = () => {
		if (request.status === 200) {
			let txt = request.responseText;
			let obj = JSON.parse(txt);

			document.querySelector("#cartSize").innerHTML = obj["size"];
		} else if (request.status === 401) {
			alert("Please log in to add product to cart");
		} else {
			reportRequestFailed(request);
		}
	}

	// 3: set method, url and headers
	let { username, sessionId} = lastLoginCredentials;
	let url = `/cartSizeService?username=${username}&sessionId=${sessionId}`;

	request.open("GET", url);
	request.setRequestHeader("Accept", "application/json");

	// 4: send data
	request.send();
}
