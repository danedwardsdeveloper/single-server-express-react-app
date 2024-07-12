import express, { Request, Response } from 'express';
const path = require('path');
const app = express();
require('dotenv').config();
const chalk = require('chalk');

const requiredEnvVars: string[] = [];
const validEnvironments = ['prod', 'dev'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
const serverMode: string = process.env.VITE_SERVER_MODE || 'prod';
const debugMode: boolean = process.env.VITE_DEBUG_MODE === 'true' || false;

declare global {
	var debug: (...args: any[]) => void;
}

global.debug = function (...args: any[]): void {
	if (debugMode) {
		console.log('[DeBug]', ...args);
	}
};

if (!validEnvironments.includes(serverMode)) {
	debug(chalk.red.bold('\n🚨 Invalid VITE_SERVER_MODE: 🚨'));
	debug(chalk.yellow(`  VITE_SERVER_MODE must be one of: ${validEnvironments.join(', ')}`));
	process.exit(1);
}

if (missingEnvVars.length > 0) {
	debug(chalk.red.bold('\n🚨 Missing Environment Variables: 🚨'));
	missingEnvVars.forEach(varName => {
		debug(chalk.yellow(`  • ${varName}`));
	});
	process.exit(1);
}

debug(chalk.green('✅ All required environment variables are set.'));
debug(chalk.green(`✅ VITE_SERVER_MODE set to: ${serverMode}`));

const port = 8080;

const clientBuildPath = path.resolve(__dirname, '../../client/dist');

if (serverMode === 'prod') {
	app.use(express.static(clientBuildPath));
	app.get('*', (req, res) => {
		if (!req.path.startsWith('/api/')) {
			res.sendFile(path.join(clientBuildPath, 'index.html'));
		}
	});
}

app.get('/api/products', (req: Request, res: Response) => {
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
	debug(chalk.blue(`API URL: http://localhost:${port}/api/products`));
});