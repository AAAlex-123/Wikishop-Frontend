
const cartTemplate = Handlebars.compile(`
	<table>
		<thead>
			<tr>
				<th>Product name</th>
				<th>Cost</th>
				<th>Quantity</th>
			</tr>
		</thead>
		<tbody>
			{{#each cartItems}}
				<tr>
					<td>{{title}}</td>
					<td>{{cost}}</td>
					<td>{{quantity}}</td>
				</tr>
			{{/each}}
		</tbody>
	</table>
	<p id="cartCost">The total cost is: {{totalCost}}</p>
`);

const reportRequestFailed = (request) => {
	console.log(`Request failed with unknown status ${request.status}: ${request.statusText}`);
}

const loadCart = (contentElementId) => {
	let searchParams = new URLSearchParams(window.location.search);
	let username = searchParams.get('username');
	let sessionId = searchParams.get('sessionId');
	cartRetrievalService(contentElementId, username, sessionId);
}

const cartRetrievalService = (contentElementId, username, sessionId) => {

	// 1: create request
	var request = new XMLHttpRequest();

	// 2: add listeners
	request.onload = () => {
		if (request.status === 200) {
			let txt = request.responseText;
			let obj = JSON.parse(txt);

			let htmlContent = cartTemplate(obj);

			document.querySelector(`#${contentElementId}`).innerHTML = htmlContent;
		} else if (request.status === 401){
			alert("Please log in to view the cart");
		} else {
			reportRequestFailed(request);
		}
	}

	// 3: set method, url and headers
	let url = `/cartRetrievalService?username=${username}&sessionId=${sessionId}`;
	request.open("GET", url);
	request.setRequestHeader("Accept", "application/json");

	// 4: send request
	request.send();
}
