const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

const port = 8080;

app.use(express.static(path.join(__dirname, '../../client/dist')));

app.get('*', (req, res, next) => {
	next();
	// res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
});

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
	console.log(`API URL: http://localhost:8080/products`);
	console.log(`SiteURL: http://localhost:8080`);
});
