This will ultimately be an article on my blog ([Array of Sunshine](https://www.arrayofsunshine.co.uk/))

# Create & Deploy a MERN online shop with Heroku

## Setup

### File structure

```txt
File tree...

```

### Server

-  Set environment variables
-  Check that all variables have been imported

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

-  Update `settings.json`
   -  Add a proxy
   -  Check start/build will work with Heroku

### Getting ready to deploy

-  Delete both `node_modules` folders, then run `npm i` in both root and client, to simulate how Heroku will build your app
-  `procfile` should indicate the entry point (the server) `web: node server/index.js`
-  Configure `package.json` so that both server and client are built and served/deployed
