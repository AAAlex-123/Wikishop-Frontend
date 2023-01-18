
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
				document.querySelector(`#content`).innerHTML = htmlContent;
			} else if (request.status==401){
				alert("Please log in to view the cart");
			} else {
				console.log(`Request failed with unknown status ${request.status}: ${request.statusText}`);
			}
		}		
	}

	// 3: set method, url and headers
	request.open("GET", `/cartRetrievalService?username=${username}&sessionId=${sessionId}`);
	request.setRequestHeader("Accept", "application/json");

	// 4: send request
	request.send();
}
