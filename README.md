# Career Management Prototype Extension

## prerequisite

Prerequisites for NodeJS

Run `nvm use 16`

## Setup

Run `yarn install` in the folder to install dependencies

## Running The Extension

### Build

#### Development

Run `yarn start` to start the development server (auto refreshes your extension on change)

#### Production

Run `yarn build`

Builds the app for production to the `build` folder.\

### Install

1. Navigate to extension's url in your browser
   - chrome: `chrome://extensions`
   - edge: `edge://extensions/`
   - firefox: `about:debugging#/runtime/this-firefox`
   - opera: `opera://extensions/`
   - brave: `brave://extensions/`
2. Ensure `Developer mode` is `enabled`(expect firefox)
3. Load unpacked extensions
   - expect firefox: Select the `/dist(or build for prod)` folder
   - firefox: Select the `/dist(or build for prod)/manifest.json` file

## Test

Run `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
