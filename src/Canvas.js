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
import {connect} from 'react-redux'

type Props = {};
class Canvas extends Component<Props> {

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
    console.log("undo" + this.props.counter);
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
    }
  }

  _addPath() {
    () => this.props.redoDraw();
  }
  
  render() {
    return (
      <View style={styles.container}>
      <View style={styles.topView}>
          <Button
            onPress={this.props.counter > 0 ? this.props.undoDraw : null}
            title={'<undo'}
            color={'red'}
          ></Button>
          <Button
            onPress={this._showPicker}
            title={this.state.buttonText}
            color={this.state.strokeColor}
          ></Button>
          <Button
            onPress={this.props.redoDraw}
            title={'redo>'}
          ></Button>
      </View>
      
        <Text style={styles.pickerContainer}>Current state: {this.props.counter}</Text> 
        <View style={styles.pickerContainer}>
        {this._renderCancel()}
        </View>
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: 1,
            alignSelf: 'stretch'
          }}
        />
        <View style= {{ flex: 1, flexDirection: 'row'}}>
          <SketchCanvas
          ref={ref => this.canvas = ref}
          style={{ flex: 1}}
          strokeColor={this.state.strokeColor}
          strokeWidth={7}
          onStrokeEnd={this.props.redoDraw}
          onPathsChange={(pathsCount) => {
            console.log('pathsCount', pathsCount)
          }}
          />
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
    return {
        counter : state.counter
    }
}

function mapDispatchToProps(dispatch) {
    return {
        undoDraw : () => dispatch({ type: 'UNDO_DRAW' }),
        redoDraw : () => dispatch({ type: 'REDO_DRAW' }),
        maxCounter : () => dispatch({ type: 'MAX_COUNTER'})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
