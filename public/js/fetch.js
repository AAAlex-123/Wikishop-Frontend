let load = {}
let fetched_products = undefined;

load.index = (elementId) => {
	fetch("https://wiki-shop.onrender.com/categories")
		.then(response => {
			return response.json()
		})
		.then(raw_obj => {

			let htmlContent = templates.categories({
				"categories": raw_obj,
			});

			document.querySelector(`#${elementId}`).innerHTML = htmlContent;;
		});
}

load.category = (contentElementId, filterElementId) => {

	const searchParams = new URLSearchParams(window.location.search);

	const categoryId = searchParams.get('categoryId');

	fetch(`https://wiki-shop.onrender.com/categories/${categoryId}/products`)
		.then(response => {
			return response.json()
		})
		.then(raw_obj => {

			fetched_products = raw_obj;

			let htmlContent = templates.products({
				"products": raw_obj,
			});

			document.querySelector(`#${contentElementId}`).innerHTML = htmlContent;
		});

	fetch(`https://wiki-shop.onrender.com/categories/${categoryId}/subcategories`)
		.then(response => {
			return response.json();
		})
		.then(raw_obj => {

			let htmlContent = templates.filters({
				"subcategory": raw_obj,
			});

			document.querySelector(`#${filterElementId}`).innerHTML = htmlContent;
		});
}


load.cart = (contentElementId) => {

	const searchParams = new URLSearchParams(window.location.search);
	const username = searchParams.get('username');
	const sess = searchParams.get('sessionId');
	cartRetrievalService(username, sess);
	console.log("Username: ", username, "and SessionId: ", sess);

}

