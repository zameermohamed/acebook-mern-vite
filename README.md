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

### PR11 by Aysin

- User model fields are validated now in the model.
- Validation errors from the model are passed to the front end.
- Other errors in controller (to check the username and email) are passed to the front end too.

### PR12 by Jack & Michal

- Created new component for displaying posts
  - New CSS for PostContainer component
- Updated FeedPage component to render posts within PostContainer
  - Plan is to render a NewPost component above the PostContainer so this will always be at the top of the screen with the post feed rendering below with newest posts at the top
- conditional rendering to display login/register when not logged in and logout/posts when user is logged in
- change token valid for time from 10 minutes to 24 hours

### PR15 by Aysin

- User model test were created:
  User model
  ✓ has an email address (13 ms)
  ✓ has a password (1 ms)
  ✓ has a username (1 ms)
  ✓ can list all users (2 ms)
  ✓ can save a user with password hashing and date created at (155 ms)
  ✓ Email is required (3 ms)
  Password validations
  ✓ Display 'Password is required' error (2 ms)
  ✓ Password must be at leat 8 characters (1 ms)
  ✓ Password must include at least one lower case letter (1 ms)
  ✓ Password must include at least one upper case letter (1 ms)
  ✓ Password must include at least one number (1 ms)
  ✓ Password must include at least one special character (1 ms)
  Username validations
  ✓ Username is required
  ✓ Username must be at least 3 characters (1 ms)
  ✓ Username cannot be more than 20 characters (1 ms)
  ✓ Username can only contain letters, numbers, and underscores (1 ms)
  User model with optional fields
  ✓ create a user with full name (128 ms)
  ✓ create a user with profile picture (133 ms)
  ✓ create a user with a bio and date created at (137 ms)
- Users controller tests were created:
  /users
  POST, when email, password and username are provided
  ✓ the response code is 201 (114 ms)
  ✓ a user is created (72 ms)
  POST, when password is missing
  ✓ response code is 400 (3 ms)
  ✓ does not create a user (3 ms)
  POST, when email is missing
  ✓ response code is 400 (2 ms)
  ✓ does not create a user (2 ms)
  POST, when username is missing
  ✓ response code is 400 (2 ms)
  ✓ does not create a user (2 ms)
  POST, when email isn't unique
  ✓ response code is 400 (72 ms)
  ✓ does not create a user (70 ms)
  POST, when username isn't unique
  ✓ response code is 400 (70 ms)
  ✓ does not create a user (81 ms)

### PR18 by Jack & Michal

- Added a useState hook on FeedPage so that when it is triggered by a NewPost being created, the PostContainer re-renders
- Temporarily changed UserId required on post.js model back to false so creating a new post via the NewPost component (which doesn't have an associated UserId currently) doesn't cause the backend server to crash.

### PR21 by Aysin

- Backend tests were fixed by adding username and changing the password while creating the test user to meet the validations.
- Expected token time was updated as 86400 in token.test as current token time is implemented as 24 hours.

### PR22 by Jack & Aysin

- Frontend tests are all now passing
  - Caveat: 2 tests from the homePage have been commented out for now as they should get moved to a Header.test.jsx component (which has not been created yet)

### PR24 by Jack & Aysin

- Comment model and associated tests were implemented.

### PR29 by Alec & Michal

- Adds the username and profile picture of the user to each post and the new post feature
  - Caveat: user not yet able to set their profile picture

### PR34 by Jack, Michal and Alec

- Implemented commenting from a single post's page
- Added lots more tests to both frontend and api to increase coverage
- Changed <a href> tags to <Link> throughout the app (At Zameer's suggestion - Should reduce load times dramatically when app run on render)
- Removed unecessary LogoutButton component

### PR38 by Jack

- Modified CSS throughout the app to have a consistent styling
- Added light/dark toggle to header page to change theme of the app
- Added a dark mode variant of the logo
- Updated Readme

### PR42 by Aysin
- User controller was updated to update and delete user details
- routes/users updated to include PUT and DELETE requests with tokenchecker
- User model updated for password hashing to handle password update by updateUser function in the controller.
- Tests were created to test updating and deleting the users by error handling.
