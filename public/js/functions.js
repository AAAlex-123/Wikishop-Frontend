
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
