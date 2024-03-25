import { StyleSheet, Dimensions } from "react-native";

// Declare UI size constants
export const windowWidth = Dimensions.get("window").width;
export const windowHeight = Dimensions.get("window").height;

export const fontSize = Math.min(windowWidth, windowHeight) * 0.045;

export const lightBlue = "#1aa7ec";
export const paleBlue = "#00b4d8";
export const darkGray = "#808080";
export const lightGray = "#f2f2f2";

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
    marginBottom: fontSize * 0.25,
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
    paddingHorizontal: fontSize * 0.5,
    paddingVertical: fontSize * 0.25,
    borderWidth: fontSize * 0.05,
    borderColor: lightBlue,
    borderRadius: fontSize * 0.5,
  },
  underline: {
    borderBottomWidth: fontSize * 0.05,
  },
});
