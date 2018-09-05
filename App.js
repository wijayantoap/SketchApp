/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
'use strict'
import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, Alert, Dimensions} from 'react-native';
import { SketchCanvas } from '\@terrylinla/react-native-sketch-canvas';
import { ColorPicker, toHsv } from 'react-native-color-picker'
import Canvas from'./src/Canvas'
import {createStore} from 'redux'
import {Provider} from 'react-redux'

const initialState = {
  counter : 0,
  maxCounter : 0
}

const reducer = (state = initialState, action) => {
  switch(action.type)
  {
    case 'UNDO_DRAW':
    return(
      { 
      counter : state.counter - 1}
    )
    case 'REDO_DRAW':
    return(
      { counter : state.counter + 1}
    )
    case 'MAX_COUNTER':
    return(
      { maxCounter : state.maxCounter + 1}
    )
  }
  return state;
}


const store = createStore(reducer);


type Props = {};
export default class App extends Component<Props> {

  render() {
    return (
      <Provider store={store}>
        <Canvas></Canvas>
      </Provider>
    );
  }
}

