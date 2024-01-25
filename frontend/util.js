import moment from "moment";
import { Alert, Dimensions } from "react-native";

// IP address of the server
// Baseball
export const IP = "192.168.1.141";
// York
// export const IP = '192.168.0.169'
export const PORT = 3000;

// Declare UI size constants
export const windowWidth = Dimensions.get("window").width;
export const windowHeight = Dimensions.get("window").height;

export const fontSize = Math.min(windowWidth, windowHeight) * 0.045;

// Fetches data from the server and sorts it by time
export const getData = (setData) => {
  fetch(`http://${IP}:${PORT}`)
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      let parsedData = JSON.parse(data);
      parsedData.sort((a, b) => new Date(a.time) - new Date(b.time));
      setData(parsedData);
    });
};

// Creates and add a record in the database
export const createRecord = (name, category, amount, time, isIncome) => {
  // If isIncome is true, the amount is the same
  // If isIncome is false, the amount is negative the amount
  const reqObj = { name, category, amount: amount * (2 * isIncome - 1), time };
  fetch(`http://${IP}:${PORT}/insert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqObj),
  })
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      Alert.alert("Record created successfully!");
    });
};

// Converts a JS date object to Hong Kong date and time without year
export const formatShortDateTime = (time) => {
  return moment(time).utcOffset(480).format("MMM DD HH:mm");
};

// Converts a JS date object to Hong Kong date and time with year
export const formatDateTime = (time) => {
  return moment(time).utcOffset(480).format("lll");
};
