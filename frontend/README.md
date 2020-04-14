This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Hosted at https://facegen-fc9de.web.app/

## Development setup

1. Create file fbConfig.ts in src with config from your firebase app:

   ```typescript
   import firebase from "firebase/app";

   const config = {
     apiKey: "x",
     authDomain: "x",
     databaseURL: "x",
     projectId: "x",
     storageBucket: "x",
     messagingSenderId: "x",
     appId: "x",
     measurementId: "x",
   };

   const firebaseApp = firebase.initializeApp(config);

   export default firebaseApp;
   ```

2. `yarn install`
3. `yarn start`

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
