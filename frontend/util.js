import moment from "moment";

// Baseball
export const IP = "192.168.1.141";
// York
// export const IP = '192.168.0.169'
export const PORT = 3000;

export const getData = (setData) => {
  // Change hard code ip to function call
  fetch(`http://${IP}:${PORT}`)
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      parsedData = JSON.parse(data);
      setData(parsedData);
    });
};

export const createRecord = (name, category, amount, time, isIncome) => {
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
      alert(data);
      // getData();
    });
};

export const formatDate = (time) => {
  return moment(time).utcOffset(480).format("ll");
};

// Converts a js date object to Hong Kong time
export const formatDateTime = (time) => {
  return moment(time).utcOffset(480).format("lll");
};
