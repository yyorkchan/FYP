import { StyleSheet, Dimensions } from "react-native";

// Declare UI size constants
export const windowWidth = Dimensions.get("window").width;
export const windowHeight = Dimensions.get("window").height;

export const fontSize = Math.min(windowWidth, windowHeight) * 0.045;
const componentWidth = windowWidth * 0.8;

export const commonStyles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  contentArea: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 30,
  },
  rowBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    alignItems: "center",
    margin: 5,
  },
  inputBoxContainer: {
    width: componentWidth,
    marginVertical: windowHeight * 0.01,
  },
  inputTitle: {
    fontSize: fontSize,
    color: "black",
    marginVertical: 5,
  },
  inputField: {
    fontSize: fontSize * 1.2,
    color: "black",
    fontWeight: "bold",
  },
});
