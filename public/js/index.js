const categoriesTemplate = Handlebars.compile(`
{{#each categories}}
	<section>
		<details>
			<summary>
				{{title}}
			</summary>
			<aside class="left">
				<a href="category.html?categoryId={{id}}">
					<img alt="Image of music book" class="type-image" src="{{img_url}}">
				</a>
			</aside>
		</details>
	</section>
{{/each}}
`);

const loadCategories = (elementId) => {
	fetch("https://wiki-shop.onrender.com/categories")
		.then(response => {
			return response.json()
		})
		.then(raw_obj => {

			let htmlContent = categoriesTemplate({
				"categories": raw_obj,
			});

			document.querySelector(`#${elementId}`).innerHTML = htmlContent;
		});
}
