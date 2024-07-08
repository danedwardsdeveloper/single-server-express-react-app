# single-server-express-react-app

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

2. **Install Express**

   ```sh
   npm install express
   ```

3. **Create the Express Server**
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

2. **Create React App Files**

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

3. **Build the React App**

   -  Add a `build` script to your `client/package.json`:
      ```json
      {
      	"scripts": {
      		"build": "react-scripts build"
      	}
      }
      ```
   -  Note: If not using Create React App, you will need to set up a build system like Webpack manually. For simplicity, let's assume you're using the basic configuration.

4. **Build the App**
   ```sh
   npm run build
   ```

### Step 4: Deploy to Heroku

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
