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

const getRecurringRecords = (records) => {
  return records.filter((record) => record.is_recurring == "true");
};

const getNonRecurringRecords = (records) => {
  return records.filter((record) => record.is_recurring == "false");
};

// Converts a recurring record to an array of repeated non-recurring records for display
// The database only stores them as a single record, they are later expanded after being fetched
const getExpandedRecords = (record) => {
  const timeNow = moment();
  const timeCreate = moment(record.time);

  // Map frequency to moment.js key
  const freqToKey = {
    Daily: "d",
    Weekly: "w",
    Monthly: "M",
    Yearly: "y",
  };

  let expandedRecords = [];
  while (timeCreate.isBefore(timeNow)) {
    expandedRecords.push({
      ...record,
      time: timeCreate.format(),
    });
    timeCreate.add(1, freqToKey[record.recurring_freq]);
  }
  return expandedRecords;
};

// Fetches data from the server and sorts it by time
export const getData = (setData) => {
  fetch(`http://${IP}:${PORT}`)
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      let parsedData = JSON.parse(data);
      let processedData = getNonRecurringRecords(parsedData);
      const recurringRecords = getRecurringRecords(parsedData);
      recurringRecords.forEach((record) => {
        processedData.push(...getExpandedRecords(record));
      });
      processedData.sort((a, b) => new Date(a.time) - new Date(b.time));
      setData(processedData);
      // console.log(processedData);
    });
};

// Creates and add a record in the database
export const createRecord = (
  name,
  category,
  amount,
  time,
  isIncome,
  isRecurring,
  recurringFreq
) => {
  // If isIncome is true, the amount is the same
  // If isIncome is false, the amount is negative the amount
  const reqObj = {
    name,
    category,
    amount: amount * (2 * isIncome - 1),
    time,
    isRecurring,
    recurringFreq,
  };
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
  return moment(time).utcOffset(480).format("MMM DD, YY HH:mm");
};

// Converts a JS date object to Hong Kong date and time with year
export const formatDateTime = (time) => {
  return moment(time).utcOffset(480).format("lll");
};
