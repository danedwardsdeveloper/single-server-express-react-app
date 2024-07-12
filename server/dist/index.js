"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path = require('path');
const app = (0, express_1.default)();
require('dotenv').config();
const chalk = require('chalk');
const requiredEnvVars = [];
const validEnvironments = ['prod', 'dev'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
const serverMode = process.env.VITE_SERVER_MODE || 'prod';
const debugMode = process.env.VITE_DEBUG_MODE === 'true' || false;
global.debug = function (...args) {
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
const clientBuildPath = path.resolve(__dirname, '../../client/dist');
app.use(express_1.default.static(clientBuildPath));
app.get('/api/products', (req, res) => {
    const products = [
        {
            id: 1,
            name: 'Fennec Fox',
            description: 'A small fox with large ears, native to the Sahara Desert.',
        },
        {
            id: 2,
            name: 'Axolotl',
            description: 'A neotenic salamander known for its ability to regenerate limbs.',
        },
        {
            id: 3,
            name: 'Capybara',
            description: 'The largest rodent in the world, native to South America.',
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
app.get('*', (req, res, next) => {
    next();
});
const port = process.env.PORT || 8080;
app.listen(port, () => {
    debug(chalk.blue(`API URL: http://localhost:${port}/api/products`));
    console.log(chalk.blue(`Server is running on port ${port}`));
});
