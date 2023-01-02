
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
				console.log(obj);
			} else if (request.status==401){
				document.querySelector("#form-result-failed").style.display = "block";
				document.querySelector("#form-result-success").style.display = "none";
			}
			else {
				console.log(`Request failed with status ${request.status}: ${request.statusText}`);
				
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

