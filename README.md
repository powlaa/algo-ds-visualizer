# Algorithm and Datastructure Visualizer

The Algorithm and Datastructure Visualizer is a platform for interactive algorithm and datastructure visualizations using
D3.js. It was developed as part of my masters thesis.

## Development

For development purposes, express.js is used to redirect all URLs to the `index.html`.

Install Dependencies

```
npm i
```

Run

```
npm start
```

Run Storybook

```
npm run storybook
```

## Deployment

Currently, the web application is only deployed on Firebase. For deployment on other servers ensure that all URLs are
being redirected to the `index.html` (e.g. by modifying the `.htaccess`).

### Firebase

1. Install the Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Set up a firebase project and set it up in the `.firebaserc`
4. Deploy: `firebase deploy`
