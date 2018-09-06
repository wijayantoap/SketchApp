# SketchApp

Features
-------------
* Change the pen color

<img src="https://media.giphy.com/media/1xNBHqaT9dyIGlzpkx/giphy.gif" height="400" />

* Undo and redo
<img src="https://media.giphy.com/media/4H1D5pe2osWWP2MgO5/giphy.gif" height="400" />

How it's done
-------------
react-native-sketch-canvas(https://github.com/terrylinla/react-native-sketch-canvas/blob/master/README.md)
UI component for the canvas

react-native-color-picker (https://github.com/instea/react-native-color-picker)
used for picking the color of the pen

Redux (https://redux.js.org/)
to save the history and the state of canvas -- notice that it is currently only saving the sketch counter based on the number of user's stroke stroke and the actions, meanwhile the path of the sketch is saved separately

Implementation
-------------

App.js
```
'use strict'
import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, Alert, Dimensions} from 'react-native';
import {SketchCanvas} from '\@terrylinla/react-native-sketch-canvas';
import {ColorPicker, toHsv} from 'react-native-color-picker'
import Canvas from'./src/Canvas'
import {createStore} from 'redux'
import {Provider} from 'react-redux'

const initialState = {
  counter : 0,
  maxCounter : 0
}

// reducer received the action and modifies the states to give a new state
// can only modify a store when there is an action passed to it
const reducer = (state = initialState, action) => {
  switch(action.type)
  {
    case 'UNDO_DRAW':
      return(
        { ...state,
          counter : state.counter - 1}
      );
      break;
    case 'REDO_DRAW':
      return(
        { ...state,
          counter : state.counter + 1}
      );
      break;
    case 'MAX_COUNTER':
      return(
        { counter : state.counter + 1,
          maxCounter : state.counter + 1}
      );
      break;
        default: {
          return {
            ...state
          }
    }
  }
}

const store = createStore(reducer);

type Props = {};
export default class App extends Component<Props> {

  render() {
    return (
    // root lvl component to wrap up provider
      <Provider store={store}>
        <Canvas></Canvas>
      </Provider>
    );
  }
}
```

Canvas.js
```
'use strict'
import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, Alert, Dimensions} from 'react-native';
import {SketchCanvas } from '\@terrylinla/react-native-sketch-canvas';
import {ColorPicker, toHsv} from 'react-native-color-picker'
import {connect} from 'react-redux'

// array for the stroke path
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

// hide and show color picker
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

// called when user touches the canvas
  _draw() {
    this.props.calcMax();
    let ctr = this.props.counter;
    let ctrMax = this.props.maxCounter;
    // remove the rest of the array to create a new path
    pathDrawer.splice(ctr, ctrMax);
  }

  _undo() {
    if (this.props.counter > 1) {
        //this.canvas.addPath(pathDrawer[]);
        // undo method which deletes the (id) of the previous path
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

// map the state
function mapStateToProps(state) {
    return {
        counter : state.counter,
        maxCounter : state.maxCounter,
    }
}

// dispatch the action
function mapDispatchToProps(dispatch) {
    return {
        undoDraw : () => dispatch({ type: 'UNDO_DRAW' }),
        redoDraw : () => dispatch({ type: 'REDO_DRAW' }),
        calcMax : () => dispatch({ type: 'MAX_COUNTER'})
    }
}

// connecting the props to the app
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
```
