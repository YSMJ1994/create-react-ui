# create-react-ui

The cli to create a react component library project.

## Quick Overview

```bash
yarn create react-ui my_library_app
cd my_library_app
yarn start
```

## Creating an React Component Library project

### npx

```bash
npx create-react-ui my_library_app
```

_([npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) comes with npm 5.2+ and higher, see [instructions for older npm versions](https://gist.github.com/gaearon/4064d3c23a77c74a3614c498a8bb1c5f))_

### npm

```bash
npm init react-ui my_library_app
```

_`npm init <initializer>` is available in npm 6+_

### yarn

```bash
yarn create react-ui my_library_app
```

_`yarn create` is available in Yarn 0.25+_

It will create a directory called `my_library_app` inside the current folder.<br> Inside that directory, it will generate the initial project structure and install the transitive dependencies:

```
my-app
├── cru.config.js
├── README.md
├── node_modules
├── package.json
├── .env.production
├── .gitignore
├── public
│   ├── favicon.ico
│   ├── index.html
├── components
│   ├── Button
│   │   ├── index.(jsx|tsx)
│   │   ├── index.md
│   │   ├── demo
│   │   │   ├── basic.md
│   │   │   └── basic2.md
│   │   └── style
│   │       └── index.scss
│   ├── common
│   │   └── index.scss
│   └── style
│       ├── index.scss
│       ├── colors
│       │   └── index.scss
│       ├── mixins
│       │   └── index.scss
│       └── themes
│           └── default.scss
├── doc
│   ├── quickStart.md
│   └── test.md
└── libraryStatic
    ├── LICENSE
    └── README.md

```

Once the installation is done, you can open your project folder:

```sh
cd my_library_app
```

Inside the newly created project, you can run some built-in commands:

### `npm start` or `yarn start`

Runs the doc app in development mode.<br> Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will automatically reload if you make changes to the code.<br>

### `npm run build` or `yarn build`

Builds the doc and the library for production to the `build-doc` and `build-library` folder.<br> It correctly bundles React UI Library Document in production mode and optimizes the build for the best performance. It will correctly build your project into a releasable UI component library

The doc build is minified and the filenames include the hashes.<br> Your doc is ready to be deployed! Your library is ready to be deployed!

### `npm run build-doc` or `yarn build-doc`

Just bundles the document in production mode

### `npm run build-library` or `yarn build-library`

Just bundles the React UI library in production mode

### `npm run eject` or `yarn eject`

If you want complete control over the build details

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

## License

Create React UI is open source software [licensed as MIT](https://github.com/YSMJ1994/create-react-ui/blob/master/LICENSE).

