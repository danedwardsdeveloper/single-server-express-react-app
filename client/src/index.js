import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const App = () => {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		fetch('/products')
			.then((response) => response.json())
			.then((data) => setProducts(data));
	}, []);

	return (
		<div>
			<h1>Exotic Animals</h1>
			<ul>
				{products.map((product) => (
					<li key={product.id}>
						<h2>{product.name}</h2>
						<p>{product.description}</p>
					</li>
				))}
			</ul>
		</div>
	);
};

ReactDOM.render(<App />, document.getElementById('root'));
