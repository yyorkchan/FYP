import { React, useState } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import SwitchToggle from "react-native-switch-toggle";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const toggleWidth = windowWidth * 0.8;
const toggleHeight = Math.max(windowHeight * 0.04, 30);

const AddScreen = ({ navigation }) => {
  // Switch on = income, off = expense
  const [switchOn, setSwitchOn] = useState(false);

  const onToggleSwitch = () => {
    setSwitchOn(!switchOn);
  };

  return (
    <View style={styles.contentArea}>
      <SwitchToggle
        switchOn={switchOn}
        onPress={onToggleSwitch}
        backgroundColorOn="lightblue"
        backgroundColorOff="lightblue"
        containerStyle={styles.toggleContainer}
        circleStyle={styles.toggleCircle}
        circleColorOn="green"
        circleColorOff="red"
        buttonTextStyle={styles.toggleText}
        buttonText={switchOn ? "Income" : "Expense"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contentArea: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 30,
  },
  toggleContainer: {
    width: toggleWidth,
    height: toggleHeight,
    borderRadius: toggleHeight / 2,
  },
  toggleCircle: {
    width: toggleWidth / 2,
    height: toggleHeight,
    borderRadius: toggleHeight / 2,
    justifyContent: "center",
  },
  toggleText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default AddScreen;
