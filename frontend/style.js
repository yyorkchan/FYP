import { StyleSheet, Dimensions } from "react-native";

// Declare UI size constants
export const windowWidth = Dimensions.get("window").width;
export const windowHeight = Dimensions.get("window").height;

export const fontSize = Math.min(windowWidth, windowHeight) * 0.045;
export const lightBlue = "#1AA7EC";

export const commonStyles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  contentArea: {
    flex: 1,
    alignItems: "center",
    paddingVertical: fontSize * 2,
  },
  title: {
    fontSize: fontSize * 1.7,
    fontWeight: "bold",
    marginBottom: fontSize,
    color: lightBlue,
  },
  rowBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    alignItems: "center",
    margin: fontSize * 0.1,
  },
  inputBoxContainer: {
    width: "80%",
    marginVertical: windowHeight * 0.01,
  },
  inputTitle: {
    fontSize: fontSize,
    color: "black",
    fontWeight: "bold",
    marginVertical: fontSize * 0.5,
  },
  inputField: {
    fontSize: fontSize,
    color: "black",
    fontWeight: "bold",
  },
  button: {
    fontSize: fontSize,
    fontWeight: "bold",
    color: lightBlue,
    marginVertical: fontSize * 0.5,
  },
  underline: {
    borderBottomWidth: fontSize * 0.05,
  },
});
