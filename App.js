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

type Props = {};
export default class App extends Component<Props> {

  constructor() {
    super();
    this.state = {
      strokeColor : "blue",
      color: toHsv('blue'),
      isHidden : false,
      buttonText : 'Change Color',
    }
    this._onColorChange = this._onColorChange.bind(this)
  }

  _onColorChange(color) {
    this.setState({ color })
  }

  _showPicker = () => {
    this.setState({isHidden:!this.state.isHidden});
    if (this.state.isHidden) {
      this.setState({buttonText : 'Change color'}); 
    } else {
      this.setState({buttonText : 'Close picker'}); 
    }
  }

  _renderCancel() {
    if (this.state.isHidden) {
      return (
          <ColorPicker
            color={this.state.color}
            defaultColor={this._onColorChange}
            onColorChange={this._onColorChange}
            onColorSelected={color => this.setState({strokeColor : color})}
            style={{width:250, height:250}}
          />
      )
      
    } else {
      return null;
      this.setState({buttonText : 'ASD'}); 
    }
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Button
            onPress={this._showPicker}
            title={this.state.buttonText}
            color={this.state.strokeColor}
          ></Button>
        {this._renderCancel()}
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: 1,
            alignSelf: 'stretch'
          }}
        />
        <View style= {{ flex: 1, flexDirection: 'row'}}>
          <SketchCanvas
          style={{ flex: 1}}
          strokeColor={this.state.strokeColor}
          strokeWidth={7}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  hidden: {
    width: 0,
    height: 0,
  },
});
