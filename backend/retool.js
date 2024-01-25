// Make a connection to the remote retool database
const Pool = require("pg").Pool;
const connectionString =
  "postgresql://retool:Eh2MrcnuU9Hl@ep-damp-hall-21024592.us-west-2.retooldb.com/retool?sslmode=require";
const pool = new Pool({ connectionString });

// Get all transactions from the retool database
const getRecord = async () => {
  try {
    return await new Promise((resolve, reject) => {
      pool.query("SELECT * FROM records", (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(results.rows);
        } else {
          reject(new Error("No results found"));
        }
      });
    });
  } catch (otherError) {
    console.error(otherError);
    throw new Error("Internal server error");
  }
};

// Add a new record to the retool database
const addRecord = (body) => {
  return new Promise((resolve, reject) => {
    const { name, category, amount, time, isRecurring, recurringFreq } = body;
    pool.query(
      "INSERT INTO records (name, category, amount, time, is_recurring, recurring_freq) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, category, amount, time, isRecurring, recurringFreq],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(
            `A new record has been added: ${JSON.stringify(results.rows[0])}`
          );
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};

module.exports = {
  getRecord,
  addRecord,
};
