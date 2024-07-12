This will ultimately be an article on my blog ([Array of Sunshine](https://www.arrayofsunshine.co.uk/))

# Create & Deploy a MERN online shop with Heroku

## Setup

### File structure

```txt
File tree...

```

### Root

-  Set up the project root

-  Be careful with dependencies & development dependencies

   -  Pretty much all packages will need to be dependencies, except
      -  Nodemon (Only used in local development)
      -  dotenv (Most hosting platforms have built-in support for environment variables)

-  Declare node and npm versions in `root/package.json`
   ```json
   {
   	"name": "single-server-mern-app",
   	"engines": {
   		"node": "22.2.0",
   		"npm": "10.8.1"
   	}
   }
   ```

### Server

-  Install TypeScript and Express

   ```bash
   npm install typescript ts-node @types/node @types/express
   ```

````

Create an `index.ts` file in `server/src/`

-  Set environment variables
-  Check that all variables have been imported
-  Allow mixed JavaScript & TypeScript if you like:

   -  `tsconfig.json`:

-  Check that all environment variables are set before starting the server
-  For simplicity, use `VITE_NODE_ENV` for both front- and back-end (You have to prefix environment variables with `VITE_` when using Vite)
   -  Force it to be set to either `production`, `dist` (Hotloading enabled on server, disabled on client), or `development` (Hotloading enabled on server & client)

### Client

I'm using a Vite template to create the front-end, as `create-react-app` is no longer maintained, even though you still see it absolutely everywhere!

-  Open the terminal at the project root and run:

```bash
# MERN project root

npm create vite@latest client -- --template react-ts
```

-  Change the local development server port by adding a server object to `vite.config.ts`:

   ```ts
   export default defineConfig({
   	plugins: [react()],
   	server: {
   		port: 8080,
   	},
   });
   ```

You can now start the React app on its own with `npm start`

However, to run the back- and front-ends together, you need to configure things a bit more.

#### Run Front- and Back-Ends concurrently

-  Build the React app first: (from /client) `npm run build`

   -  This creates a `dist` directory in client

-  Then configure the build settings in `root/package.json`

   ```json
   Settings

   {
      ...
   "scripts": {
    "start": "nodemon server/src/index.js",
    "dev": "ts-node-dev --respawn --transpile-only server/src/index.js",
    "build": "npm run build:client && npm run build:server",
    "build:client": "cd client && npm install && npm run build",
    "build:server": "tsc",
    "heroku-postbuild": "npm run build"
   }
   ...
   }

   ```

-  Add a proxy to to the front-end to divert requests to the server **Wording???**
-  This allows Express and Heroku to manage the proxy for the React app from the `dist` directory

```json

// client/package.json
{
  ...,
  "proxy": "http://localhost:8080",
  ...,
}
```

-  Serve the React app with Express
   -  Ensure the path is correct

```js
// server/src/index.js

// This line serves the React app using the build
app.use(express.static(path.join(__dirname, '../../client/dist')));

// This allows the server to handle API requests as long as they don't match the URL of a page. Then you have two options:
app.get('*', (req, res, next) => {
	// Display the raw data returned from the request
	next();

	// Display a static page instead (In this case the home page)
	res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
});
```

-  Serve both parts of the app locally by running `npm run dev` from the project root

_Screenshots..._

With this method you can edit the server and it will reload to reflect your changes. However, the front-end is stuck how you left it when you ran the build command

#### Local development with full hot reloading

-  Start both parts separately using different terminals

-  Add a proxy to `vite.config.ts`

   ```ts
   export default defineConfig({
   	plugins: [react()],
   	server: {
   		port: 8080,
   		// Add the proxy
   		proxy: {
   			'/products': {
   				target: 'http://localhost:8080',
   				changeOrigin: true,
   				secure: false,
   			},
   		},
   	},
   });
   ```

-  Run `npm run dev` from the root command line
-  Then, open another terminal tab, navigate into `client` and run `npm run dev`
-  Hot reloading is then enabled for both parts of the site
   -  Back-end using Nodemon
   -  Front end using Vite

### Getting ready to deploy

-  Delete both `node_modules` folders, then run `npm i` in both root and client, to simulate how Heroku will build your app
-  `procfile` should indicate the entry point (the server) `web: node server/index.js`
-  Configure `package.json` so that both server and client are built and served/deployed

```

```

-  Move all development dependencies in `client/package.json` to regular dependencies
````

#### Test with `heroku local`

-  Remember that this command uses the `dist` directories to serve the app
   -  So build both parts of the site before using the command
