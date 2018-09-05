/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import Canvas from './src/Canvas';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

console.disableYellowBox = true;
