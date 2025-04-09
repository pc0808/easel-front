# Easel Social Media App

## Getting Started

Install the ESLint and Prettier extensions for [VSCode](https://code.visualstudio.com/)/VSCodium.

As well, install [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) extensions.

Run `npm install` to install dependencies.

## Creating MongoDB Atlas Instance
Create a MongoDB Atlas Instance for the backend server; allow read access from any IP Address and make a single user-connection. Copy R&W credentials over to `.env` --> should be `MONGO_SRV=<srvconnectionlink>`. 

## Running Locally
Using two seperate, dedicated terminals:

Run `npm run dev:server` to start the backend server.
This will automatically restart the server code if changes are madeto it.
In active server development, it's recommended to run `npm start:server`.

Run `npm run dev:client` to start the client server.
Changes to the client code should automatically recompile and hot-reload without needing to restart the client server.

## Deploying to Vercel
1. Create a new project on Vercel and link it to GitHub repo.
2. Under "Build & Development Settings", change "Framework Preset" to `Vue.js` and "Build Command" to `npm run build`.
3. Add the following environment variables to Vercel project:
Key: `MONGO_SRV`, Value: `<your mongo connection string from .env file>`
Note: only paste the right hand value after `=` (without `<` and `>`), i.e. `MONGO_SRV=<your mongo connection string>`
4. Deploy!

## Understanding the Structure

The main entry point to the server is `api/index.ts`.
This is how the server is started and how the routes are registered.
Normally, this file is put under `server/`,
but Vercel requires the entry point to be under `api/` directory.

### Client Server
The code for the client server is under the `client/` directory, which includes the [Vue 3](https://vuejs.org/guide/introduction.html) reactive framework, Single Page Application (SPA) Routing via [Vue Router](https://router.vuejs.org/introduction.html), and persistent store and state management via [Pinia](https://pinia.vuejs.org/introduction.html).

Here's an overview of the files and directories:
- `client/assets` contains `main.css` for defining styles that are applied globally to app and `images/` to store any image files used. 
- `client/components` contains reusable Vue components used throughout app to build and compose different parts of the UI.
- `client/router` contains `index.ts` which enables client-side routing by defining and managing the navigation of app by mapping URLs to different components. Includes navigation guards that allow control access to routes and execute code before or after route changes.
- `client/stores` contains individual store modules for storage and state management for specific aspects of app.
- `client/utils` contains useful utility functions that can be called throughout app. For example, `fetchy` is a wrapper function around the native Fetch API call that handles errors and alerts the messages to the user. In client-side, it's recommended to instantiate server requests only here, for easier debugging and typechecking. 
- `client/views` contains various top-level components that represent the different views or pages of app. The views are commonly used in conjunction with Vue Router to map specific routes to these view components and render them when the corresponding route is visited.
- `client/App.vue` contains the app-level component whose properties are maintained throughout the app.
- `client/main.ts` contains the main configuration of the app. You should not edit this file.

### Backend Server
The code for the backend server is under the `server/` directory,
which includes both concept and RESTful API implementations.

Here's an overview of the files and directories:
- `server/concepts` contains the concept implementations.
- `server/concepts/errors.ts` contains error classes.
- `framework/` contains the framework code that converts
route implementations and error handling into Express handlers.
You should not edit this directory!
- `server/app.ts` contains app definition (i.e., concept instantiations).
- `server/db.ts` contains the MongoDB setup code. You should edit this file.
- `server/routes.ts` contains the code for API routes.
- `server/responses.ts` contains the code for formatting responses and errors
into a more user-friendly format for the front-end. 