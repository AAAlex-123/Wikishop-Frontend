let templates = {}

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