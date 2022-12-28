let load = {}

load.index = (elementId) => {
	fetch("https://wiki-shop.onrender.com/categories")
		.then(function (response) {
			return response.json()
		})
		.then(function (raw_obj) {

			obj = {
				"categories": raw_obj
			}

			// 3: create html from template and data
			let htmlContent = templates.categories(obj);

			// 4: put html in page
			let element = document.querySelector(`#${elementId}`);
			element.innerHTML = htmlContent;
		});
}

load.category = (elementId) => {

	const searchParams = new URLSearchParams(window.location.search);

	const categoryId = searchParams.get('categoryId');

	fetch(`https://wiki-shop.onrender.com/categories/${categoryId}/products`)
		.then(function (response) {
			return response.json()
		})
		.then(function (raw_obj) {

			obj = {
				"products": raw_obj
			}

			// 3: create html from template and data
			let htmlContent = templates.products(obj);

			// 4: put html in page
			let element = document.querySelector(`#${elementId}`);
			element.innerHTML = htmlContent;
		});
}

