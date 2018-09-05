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
import {SketchCanvas } from '\@terrylinla/react-native-sketch-canvas';
import {ColorPicker, toHsv} from 'react-native-color-picker'
import {connect} from 'react-redux'

let pathDrawer = [];

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
    this._onColorChange = this._onColorChange.bind(this);
    this._draw = this._draw.bind(this);
    this._undo = this._undo.bind(this);
    this._redo = this._redo.bind(this);
  }

  _onColorChange(color) {
    this.setState({color});
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
    }
  }

  _draw() {
    this.props.calcMax();
    let ctr = this.props.counter;
    let ctrMax = this.props.maxCounter;
    pathDrawer.splice(ctr, ctrMax);
  }

  _undo() {
    if (this.props.counter > 1) {
        //this.canvas.addPath(pathDrawer[]);
        this.canvas.undo();
        this.props.undoDraw();
    } else if (this.props.counter < 2 && this.props.counter > 0) {
        this.props.undoDraw();
        this.canvas.clear();
    }
  }

  _redo() {
    let ctr = this.props.counter;
    if (this.props.counter < this.props.maxCounter) {
        this.canvas.addPath(pathDrawer[ctr]);
        this.props.redoDraw();
    } else {
    }
  }
  
  render() {
    return (
      <View style={styles.container}>
      <View style={styles.topView}>
          <Button
            onPress={this._undo}
            title={'<undo'}
            color={'red'}
          ></Button>
          <Button
            onPress={this._showPicker}
            title={this.state.buttonText}
            color={this.state.strokeColor}
          ></Button>
          <Button
            onPress={this._redo}
            title={'redo>'}
          ></Button>
      </View>
        <Text style={styles.pickerContainer}  onPress={() => {
            this.canvas.addPath(pathDrawer[1]);
        }}>Current state: {this.props.counter}</Text> 
        <Text style={styles.pickerContainer} onPress={() => {
            this.canvas.clear();
        }}>Max state: {this.props.maxCounter}</Text> 
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
            onStrokeStart={this._draw}
            onStrokeEnd={(path) => {
                pathDrawer.push(path)
                console.log(path)
            }}
          />
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
    return {
        counter : state.counter,
        maxCounter : state.maxCounter,
        //pathDrawer : state.path
    }
}

function mapDispatchToProps(dispatch) {
    return {
        undoDraw : () => dispatch({ type: 'UNDO_DRAW' }),
        redoDraw : () => dispatch({ type: 'REDO_DRAW' }),
        calcMax : () => dispatch({ type: 'MAX_COUNTER'})
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