## Acebook MERN Template

In this project, you are task with working on an existing application. A
significant part of the challenge will be to familiarise yourself with the
codebase you've inherited, as you work to **improve and extend** it.

### Structure

This repo contains two applications:

- A frontend React App
- A backend api server

These two applications will communicate through HTTP requests, and need to be
run separately.

### Documentation

[More documentation of the codebase and its architecture can be found here.](./DOCUMENTATION.md)
It's recommended you all read the suggested docs _after making sure the whole
setup below worked for everyone_. Then work together on a diagram describing how
the application works.

### Card wall

[Trello Board](https://trello.com/b/Hq0zHnAt/acebook-team-b)

### Quickstart

### Install Node.js

If you haven't already, make sure you have node and NVM installed.

1. Install Node Version Manager (NVM)
   ```
   brew install nvm
   ```
   Then follow the instructions to update your `~/.bash_profile`.
2. Open a new terminal
3. Install the latest version of [Node.js](https://nodejs.org/en/), (`20.5.0` at
   time of writing).
   ```
   nvm install 20
   ```

### Set up your project

1. Have one team member fork this repository
2. Rename the fork to `acebook-<team name>`
3. Every team member clone the fork to their local machine
4. Install dependencies for both the `frontend` and `api` applications:
   ```
   cd frontend
   npm install
   cd ../api
   npm install
   ```
5. Install an ESLint plugin for your editor, for example
   [ESLint for VSCode](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
6. Install MongoDB
   ```
   brew tap mongodb/brew
   brew install mongodb-community@6.0
   ```
   _Note:_ If you see a message that says
   `If you need to have mongodb-community@6.0 first in your PATH, run:`, follow
   the instruction. Restart your terminal after this.
7. Start MongoDB

   ```
   brew services start mongodb-community@6.0
   ```

### Setting up environment variables.

We need to create two `.env` files, one in the frontend and one in the api.

#### Frontend

Create a file `frontend/.env` with the following contents:

```
VITE_BACKEND_URL="http://localhost:3000"
```

#### Backend

Create a file `api/.env` with the following contents:

```
MONGODB_URL="mongodb://0.0.0.0/acebook"
NODE_ENV="development"
JWT_SECRET="secret"
```

For an explanation of these environment variables, see the documentation.

### How to run the server and use the app

1. Start the server application (in the `api` directory) in dev mode:

```
; cd api
; npm run dev
```

2. Start the front end application (in the `frontend` directory)

In a new terminal session...

```
; cd frontend
; npm run dev
```

You should now be able to open your browser and go to
`http://localhost:5173/signup` to create a new user.

Then, after signing up, you should be able to log in by going to
`http://localhost:5173/login`.

After logging in, you won't see much but you can create posts using PostMan and
they should then show up in the browser if you refresh the page.

### PR7 by Aysin

- The User model/collection was updated to include the following fields: username (required), full name (optional), profilePicture (optional), bio (optional), and dateCreated.
- The create function in api/controllers/users.js was modified to include these new fields when adding a user to the database.
- Password hashing is now handled with bcrypt in models/user.js.
- The frontend was updated to support username during signup:
  - frontend/src/pages/SignUp.js now includes a username field.
  - frontend/src/services/authentication.js was updated to include the username field in authentication requests.
- api/controllers/authentication.js was updated to verify the input password against the hashed password in the database and generate a token upon successful authentication.
- Error handling for username creation should be reevaluated.

### PR12 by Jack & Michal

- Created new component for displaying posts
  - New CSS for PostContainer component
- Updated FeedPage component to render posts within PostContainer
  - Plan is to render a NewPost component above the PostContainer so this will always be at the top of the screen with the post feed rendering below with newest posts at the top
- conditional rendering to display login/register when not logged in and logout/posts when user is logged in
