const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

const port = 8080;
const nodeEnv = process.env.NODE_ENV;
console.log(nodeEnv);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, 'client/build')));

	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
	});
}

app.get('/products', (req, res) => {
	const products = [
		{
			id: 1,
			name: 'Fennec Fox',
			description:
				'A small fox with large ears, native to the Sahara Desert.',
		},
		{
			id: 2,
			name: 'Axolotl',
			description:
				'A neotenic salamander known for its ability to regenerate limbs.',
		},
		{
			id: 3,
			name: 'Capybara',
			description:
				'The largest rodent in the world, native to South America.',
		},
		{
			id: 4,
			name: 'Sugar Glider',
			description: 'A small, nocturnal gliding possum native to Australia.',
		},
		{
			id: 5,
			name: 'Pangolin',
			description: 'A mammal covered in large, protective keratin scales.',
		},
	];
	res.json(products);
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
	console.log(`API URL: http://localhost:8080/products`);
	console.log(`SiteURL: http://localhost:8080`);
});
