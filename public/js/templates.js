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

templates.filters = Handlebars.compile(`
	<p>Filter</p>
	<div>
		<div>
			<input type="radio" id="-1" name="filter" value="allprod" onclick="filterClick(-1, 'main-content-article')">
			<label for="-1">All</label><br>
		</div>
		{{#each subcategory}}
			<div>
				<input type="radio" id="{{id}}" name="filter" value="{{title}}" onclick="filterClick({{id}}, 'main-content-article')">
				<label for="{{id}}">{{title}}</label><br>
			</div>
		{{/each}}
	</div>
`);
