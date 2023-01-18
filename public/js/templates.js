let templates = {}

templates.products = Handlebars.compile(`
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


templates.cart= Handlebars.compile(`
	<div>
	<table>
		<tr>
			<th>Product name</th>
			<th>Cost</th>
			<th>Quantity</th>
		</tr>
		{{#each cartItems}}
			<tr>
				<td>{{title}}</td>
				<td>{{cost}}</td>
				<td>{{quantity}}</td>
			</tr>
		{{/each}}
		</table>
		<p id="cartCost"> The total cost is: {{totalCost}} </p>
	</div>

`);