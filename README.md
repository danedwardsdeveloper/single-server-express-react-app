# single-server-express-react-app

## To-Do List

-  [ ] Create a global debug mode controlled by an environment variable
-  [ ] Implement test that all environment variables are set and loaded before doing anything else
-  [ ] Force `NODE_ENV` to be either 'production', 'development', or 'dist'

   -  I'm not sure about those three names yet
   -  Heroku will use 'production'
   -  'development' is for when both parts are being served from separate terminals
      -  Conditionally disable Express from serving the React app
   -  'dist' is for when you build the React app with Vite, and serve both site parts from the Express server.

   -  [ ] See if it's possible to make a 'dist' command that will start the React build, wait for it to finish, then start the Express server
   -  [ ] See if it's possible to use 'development' mode with a single command
      -  [ ] I'm not sure it's possible to get the terminal to open a new tab?

-  [ ] Ensure seamless transition from local development to Heroku deployment.
-  [ ] Implement TypeScript compiling
-  [ ] Update this readme very carefully so that everything is accurate
-  [ ] Turn this into an article on my blog because this has been very annoying to figure out and it's also the foundation of pretty much all my projects

A very simple Express server with one route that also serves a React app. I managed to create this in 10 minutes and deploy it to Heroku perfectly first time! The data (a list of exotic animals) isn't hardcoded - it's being fetched from the API on the same site. My example is extremely unimpressive, but the possibilities are huge! Very excited about this!

**Benefits**

-  Seamless integration between front- and back-end
-  Avoids many issues with CORS
-  Easy handling of session token/cookies/JWTs
-  Only one repo to manage

<hr>

![Single-server Express React app](/github-images/App.webp)
_A very unimpressive web app_

<hr>

![Single-server Express React app](/github-images/API.webp)
_API route on the same site_

<hr>

**Instructions from ChatGPT, minus a couple of mistakes:**

-  _Don't use port 5000 as Mac Control Centre does some fundamental stuff on this port_
-  _Don't use create-react-app. It's not maintained and full of errors._
-  _You don't need to move the build folder_

### File Tree

```
express-react-server/
├── client/
│ ├── build
│ ├── node_modules
│ ├── public/
│ │ └── index.html
│ ├── src/
│ │ ├── index.js
│ │ └── components/
│ │ └── ...
│ ├── package.json
│ └── package-lock.json
├── index.js (server)
├── node_modules
├── Procfile
├── package.json
├── package-lock.json
└── .gitignore
```

### Step 1: Set Up the Express Server

1. **Initialize the Project**

   ```sh
   mkdir express-react-app
   cd express-react-app
   npm init -y
   ```

2. **Create/edit config files**

Make sure to ignore both node_modules folders

```
# .gitignore

.env
node_modules/
client/node_modules/
/client/build
```

Add a script to start the Express server

```json
// project-root/package.json
		"start": "nodemon server/index.js",
```

Create an environment variables file to handle different environments

```
// .env

NODE_ENV=development
```

3. **Install Express**

   ```sh
   npm install express
   ```

4. **Create the Express Server**
   Create a file named `index.js` and add the following code:

   ```javascript
   const express = require('express');
   const path = require('path');
   const app = express();
   const port = process.env.PORT || 8080;

   // Serve the React app
   app.use(express.static(path.join(__dirname, 'client/build')));

   // Route to serve exotic animals
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
   			description:
   				'A small, nocturnal gliding possum native to Australia.',
   		},
   		{
   			id: 5,
   			name: 'Pangolin',
   			description:
   				'A mammal covered in large, protective keratin scales.',
   		},
   	];
   	res.json(products);
   });

   // Catch-all handler to serve the React app
   app.get('*', (req, res) => {
   	res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
   });

   app.listen(port, () => {
   	console.log(`Server is running on port ${port}`);
   });
   ```

### Step 2: Set Up the React App

1. **Create the React App Structure**

   ```sh
   mkdir client
   cd client
   npm init -y
   npm install react react-dom
   ```

2. **Configure `client/package.json`**

   ```
   {
      "name": "client",
      "version": "1.0.0",
      "main": "index.js",
      // Add a proxy for local development
      "proxy": "http://localhost:8080",
      "scripts": {
         "build": "react-scripts build",
         "start": "react-scripts start",
         "test": "echo \"Error: no test specified\" && exit 1"
      }
   }
   ```

3. **Create React App Files**

   -  **`client/public/index.html`**

      ```html
      <!DOCTYPE html>
      <html lang="en">
      	<head>
      		<meta charset="UTF-8" />
      		<meta
      			name="viewport"
      			content="width=device-width, initial-scale=1.0"
      		/>
      		<title>Exotic Animals</title>
      	</head>
      	<body>
      		<div id="root"></div>
      	</body>
      </html>
      ```

   -  **`client/src/index.js`**

      ```javascript
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
      ```

4. **Build the React App**

   -  Add a `build` script to your `client/package.json`:
      ```json
      {
      	"scripts": {
      		"build": "react-scripts build"
      	}
      }
      ```
   -  Note: If not using Create React App, you will need to set up a build system like Webpack manually. For simplicity, let's assume you're using the basic configuration.

5. **Build the App**
   ```sh
   npm run build
   ```

### Serve locally

In development, you can serve the API and app in two different ways

1. **With one terminal command**
   Open the terminal at the project root, and

### Deploy to Heroku

1. **Create a `Procfile`**

   ```sh
   echo "web: node index.js" > Procfile
   ```

2. **Create a `.gitignore` File**

   ```sh
   echo "node_modules" > .gitignore
   echo "build" >> .gitignore
   ```

3. **Initialize a Git Repository**

   ```sh
   git init
   git add .
   git commit -m "Initial commit"
   ```

4. **Create and Deploy to Heroku**

   ```sh
   heroku login
   heroku create
   git push heroku main
   ```

5. **Open Your App**
   ```sh
   heroku open
   ```
