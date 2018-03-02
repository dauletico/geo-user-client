# Geo User Client

![logo](http://image.ibb.co/cd2E0x/geo_logo.png)

The code for a Geo user client, allowing a user to interface with Nodes to generate a Proof of Location signature. Provides the option to either publicly broadcast the Proof of Location or store locally for later usage.

The app generates a unique Ethereum public / private key using Web3, which is then stored on the device. The public key is sent to the Geo Node when generating a Proof of Location.

## Prerequisites

- npm
- bower
- [Ionic Framework](https://ccoenraets.github.io/ionic-tutorial/install-ionic.html)

## Installation
1. Download the repository
2. Install npm modules: `npm install`
3. Install bower modules: `bower install`
4. Run via `ionic serve`

## Building

The Geo User Client uses Browserify to bundle Web3 into the controller. When making changes to `controllers.js`, run the following command to build the bundled file:

`browserify www/js/controllers.js -o www/js/controller-bundle.js`

To build for iOS:

`ionic cordova build ios`

To run on an iOS device (ensure XCode is installed):

`ionic cordova run ios --device`

## Usage

Once the app is running, users may scan for nearby Geo Nodes. Once one is found, connecting will send the address of the device to the Node to generate a signature.
