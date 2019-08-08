import React, { Component } from "react";
import {
  Text,
  View,
  Button,
  ScrollView,
  StyleSheet,
  Dimensions
} from "react-native";
import * as firebase from "firebase";
import { withNavigation } from "react-navigation";
import { TextInput } from "react-native-gesture-handler";
import { ImagePicker } from "expo";
const { width, height } = Dimensions.get("window");

class AddStoriesForm extends Component {
  state = {
    image: "",
    title: ""
  };
  _handelSelectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images"
    });
    console.log(result);
    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  _handelSubmit = async () => {
    //
  };

  render() {
    const { image } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inputContainer}>
          <Text>Title (Optional)</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title={image ? "Image is selected" : "Selected Image"}
            style={styles.button}
            onPress={this._handelSelectImage}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Submit" style={styles.button} />
        </View>
      </ScrollView>
    );
  }
}

export const AddStory = withNavigation(AddStoriesForm);

const styles = StyleSheet.create({
  container: {
    width,
    paddingTop: height * 0.025,
    justifyContent: "center",
    alignItems: "center"
  },
  inputContainer: {
    paddingHorizontal: width * 0.09,
    alignSelf: "flex-start"
  },
  buttonContainer: {
    marginTop: 5,
    width: width * 0.8
  },
  input: {
    marginBottom: 5,
    marginTop: 5,
    borderWidth: 1,
    width: width * 0.8
  }
});