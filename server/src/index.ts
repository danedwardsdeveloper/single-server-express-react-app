import express, { Request, Response } from 'express';
const path = require('path');
const app = express();
require('dotenv').config();
const chalk = require('chalk');

const requiredEnvVars: string[] = [];
const validEnvironments = ['production', 'development', 'dist'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
const nodeEnv: string = process.env.VITE_NODE_ENV || 'production';

if (!validEnvironments.includes(nodeEnv)) {
	console.log(chalk.red.bold('\n🚨 Invalid VITE_NODE_ENV: 🚨'));
	console.log(chalk.yellow(`  VITE_NODE_ENV must be one of: ${validEnvironments.join(', ')}`));
	process.exit(1);
}

if (missingEnvVars.length > 0) {
	console.log(chalk.red.bold('\n🚨 Missing Environment Variables: 🚨'));
	missingEnvVars.forEach(varName => {
		console.log(chalk.yellow(`  • ${varName}`));
	});
	process.exit(1);
}

console.log(chalk.green('✅ All required environment variables are set.'));
console.log(chalk.green(`✅ VITE_NODE_ENV set to: ${nodeEnv}`));

const port = 8080;

app.use(express.static(path.join(__dirname, '../../client/dist')));

app.get('*', (req: Request, res: Response, next) => {
	next();
});

app.get('/products', (req: Request, res: Response) => {
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
