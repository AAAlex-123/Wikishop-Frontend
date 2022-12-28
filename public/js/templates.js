
let templates = {}

templates.categories = Handlebars.compile(`
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

templates.products = Handlebars.compile(`
{{#each products}}
	<section>
		<aside class="left">
			<img alt="{{title}}" class="product-preview" src="{{image}}">
		</aside>
		<aside class="right">
			<span class="price">
				{{cost}}
			</span>
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


