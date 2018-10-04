# SketchApp

Features
-------------
* Change the pen color

<img src="https://media.giphy.com/media/69D5uqy1atPn8bUO9J/giphy.gif" height="400" />

<img src="https://media.giphy.com/media/1xNBHqaT9dyIGlzpkx/giphy.gif" height="400" />

* Undo and redo
<img src="https://media.giphy.com/media/4H1D5pe2osWWP2MgO5/giphy.gif" height="400" />

How it's done
-------------
random color picker/button.

automatically create 5 buttons with random color everytime the app is opened.
the user can also refresh the color to create another random color to pick.
after the user chose the color, it will assign the color to the state and `<SketchCanvas>` will automatically register the color and use it for drawing.
```
const buttons = [];

    for (var i = 0; i < colorArr.length; i++) {
      let currentIndex = colorArr[i];
      buttons.push(
        <Button 
        buttonStyle={styles.button}
        key={i}
        title={colorArr[i]}
        color={colorArr[i]}
        onPress={() => this._newColorCHange(currentIndex)}
        ></Button>
      );
    }
    return buttons;
```

react-native-sketch-canvas(https://github.com/terrylinla/react-native-sketch-canvas/blob/master/README.md)
UI component for the canvas
```
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
```

react-native-color-picker (https://github.com/instea/react-native-color-picker)
used for picking the color of the pen

Redux (https://redux.js.org/)
to save the history and the state of canvas -- notice that it is currently only saving the sketch counter based on the number of user's stroke and the actions, meanwhile the path of the sketch is saved separately
everytime the user stroke, `<SketchCanvas>` will triggers the `onStrokeEnd` that will pass the data that contains the path of the drawing. Each drawing(stroke) will be saved in array. The app can undo and redo by accessing the array that contains the data of each stroke. Everytime the user undo and draw a new one, the array that contains the previous drawing will be deleted and the new one will be assigned.
