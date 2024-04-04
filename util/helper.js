import moment from "moment";
import { Alert } from "react-native";

// IP address of the server
// Baseball
export const IP = "192.168.1.141";

// York

// export const IP = '192.168.0.169' //'10.68.21.45'
export const PORT = 3000;

const getRecurringRecords = (records) => {
  return records.filter((record) => record.is_recurring);
};

const getNonRecurringRecords = (records) => {
  return records.filter((record) => !record.is_recurring);
};

// Converts a recurring record to an array of repeated non-recurring records for display
// The database only stores them as a single record, they are later expanded after being fetched
const getExpandedRecords = (record) => {
  const timeNow = moment();
  const timeRecurringEnd = moment(record.recurring_end_time);
  const timeCreate = moment(record.time);
  const timeEnd = moment.min(timeNow, timeRecurringEnd);

  // Map frequency to moment.js key
  const freqToKey = {
    Daily: "d",
    Weekly: "w",
    Monthly: "M",
    Yearly: "y",
  };

  let expandedRecords = [];
  while (timeCreate.isBefore(timeEnd)) {
    // if first recurring event is deleted, skip it
    if (!record.exception_records.includes(timeCreate.format())) {
      expandedRecords.push({
        ...record,
        time: timeCreate.format(),
      });
    }
    // if (record.exception_records.length != 0) { console.log(record.exception_records) }
    timeCreate.add(1, freqToKey[record.recurring_freq]);
    // add 1 day/week/month/year to timeCreate until it is not excepted
    while (record.exception_records.includes(timeCreate.format())) {
      timeCreate.add(1, freqToKey[record.recurring_freq]);
    }
  }
  return expandedRecords;
};

// Fetches data from the server and sorts it by time
export const getData = (setData) => {
  // console.log("Fetching data...");
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
      // console.log(processedData);
      setData(processedData);
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
  recurringFreq,
  recurringEndTime,
  setRecordAdded,
  setIsProcessing,
) => {
  // If isIncome is true, the amount is the same
  // If isIncome is false, the amount is negative the amount
  setIsProcessing(true);
  const reqObj = {
    name,
    category,
    amount: amount * (2 * isIncome - 1),
    time,
    isRecurring,
    recurringFreq,
    recurringEndTime,
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
      setRecordAdded();
      setIsProcessing(false);
    });
};

// Delete a record in the database
export const deleteRecord = (body, setData) => {
  // console.log(body);
  setData(null); // Set loading
  fetch(`http://${IP}:${PORT}/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      // console.log(response.text());
      return response.text();
    })
    .then((data) => {
      Alert.alert("Record deleted successfully!");
      console.log(data);
      // Call getData to update the records and stop loading
      getData(setData);
    })
    .catch((error) => {
      console.log(error);
      getData(setData);
    });
};

// Converts a JS date object to short Hong Kong date and time
export const formatShortDateTime = (time) => {
  return moment(time).utcOffset(480).format("MMM DD, YY HH:mm");
};

// Converts a JS date object to Hong Kong date and time
export const formatDateTime = (time) => {
  return moment(time).utcOffset(480).format("lll");
};
