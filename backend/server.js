const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
const dbPath = path.join(__dirname, "Database", "testDB.db");

let db = null;

const initializeDBServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(4000, () => {
      console.log("server running at http://localhost:4000");
    });
  } catch (error) {
    console.log("Error", error);
    process.exit(1);
  }
};

initializeDBServer();

app.get("/", (request, response) => {
  response.send("Hello This is backend application");
});

app.post("/admin-login/", async (request, response) => {
  const { username, password } = request.body;
  const usersQuery = `
    SELECT
      *
    FROM
      admin_users
    WHERE username = '${username}' AND password = '${password}' ;`;
  const usersArray = await db.get(usersQuery);
  if (usersArray === undefined) {
    response.status(400);
    response.send("Invalid User");
  } else {
    response.send("Valid User");
  }
});

app.post("/student-login/", async (request, response) => {
  const { username, password } = request.body;
  const usersQuery = `
    SELECT
      *
    FROM
      student_info
    WHERE rollnumber = '${username}' AND password = '${password}' ;`;
  const usersArray = await db.get(usersQuery);
  if (usersArray === undefined) {
    response.status(400);
    response.send("Invalid User");
  } else {
    response.send(usersArray);
  }
});

app.put("/add-new-students", async (req, res) => {
  const {
    name,
    rollnumber,
    department,
    semester,
    phoneNumber,
    isConveyor,
    email,
    password,
    gender,
  } = req.body;

  try {
    const stmt = await db.run(
      `INSERT INTO 
        student_info (name, rollnumber, department, semester, phoneNumber, isConveyor, email, password, gender) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        rollnumber,
        department,
        semester,
        phoneNumber,
        isConveyor,
        email,
        password,
        gender,
      ]
    );
    res.send("added successfully");
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).send("Error adding student");
  }
});

app.put("/add-fees", async (req, res) => {
  const { rollNumber, tabId, feeId, feeName, Amount } = req.body;
  const zero = 0;

  try {
    const stmt = await db.run(
      `INSERT INTO fees_data (fee_id, student_rollnumber, year, fees_name, due_amount, balance_amount)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [feeId, rollNumber, tabId, feeName, Amount, Amount]
    );

    res.send("Fees added successfully");
  } catch (error) {
    console.error("Error adding fees:", error);
    res.status(500).send("Failed to add fees");
  }
});

app.get("/sem-fees/:rollNumber", async (req, res) => {
  const { rollNumber } = req.params;

  const query = `
    SELECT * FROM fees_data
    WHERE student_rollnumber = '${rollNumber}'
  `;
  try {
    const data = await db.all(query);
    res.json(data);
  } catch (error) {
    console.error("Error retrieving fees data:", error);
    res.status(500).send("Failed to retrieve fees data");
  }
});

app.post("/update-fees/:feeId/:rollNumber", async (req, res) => {
  const { feeId, rollNumber } = req.params;
  const { payingAmount } = req.body;

  try {
    // Update fees data in the database
    const currentDate = new Date();
    const dateOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
    const timeOptions = { hour: "numeric", minute: "2-digit", hour12: true };

    const formattedDate = currentDate.toLocaleDateString("en-US", dateOptions);
    const formattedTime = currentDate.toLocaleTimeString("en-US", timeOptions);

    const updateQuery = `
      UPDATE fees_data 
      SET 
        paid_amount = paid_amount + ?,
        balance_amount = balance_amount -  ?, 
        status = 1,
        date = ?
      WHERE fee_id = ? AND student_rollnumber = ?
    `;
    await db.run(updateQuery, [
      payingAmount,
      payingAmount,
      `${formattedDate} ${formattedTime}`,
      feeId,
      rollNumber,
    ]);

    res.send("success");
  } catch (error) {
    console.error("Error updating fees data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/fees/:rollNumber", async (req, res) => {
  const { rollNumber } = req.params;
  const query = `
    SELECT fee_id
    FROM fees_data
    WHERE student_rollnumber = '${rollNumber}';
  `;
  try {
    const feesData = await db.all(query);
    res.json(feesData);
  } catch (error) {
    console.error("Error retrieving fees data:", error);
    res.status(500).send("Failed to retrieve fees data");
  }
});

app.delete("/remove-fees/:rollNumber/:feeId", async (req, res) => {
  const { rollNumber, feeId } = req.params;

  try {
    const stmt = await db.run(
      `DELETE FROM fees_data 
       WHERE student_rollnumber = ? AND fee_id = ?`,
      [rollNumber, feeId]
    );

    res.send("Fees removed successfully");
  } catch (error) {
    console.error("Error removing fees:", error);
    res.status(500).send("Failed to remove fees");
  }
});

app.put("/std-payments", (req, res) => {
  const { rollNumber, semesterFeeName, committeeAmount, paidAmount } = req.body;
  const stmt = db.run(
    `INSERT INTO 
    payments (student_rollnumber,  semester_fee_name, committee_amount, paid_amount) 
    VALUES ('${rollNumber}', '${semesterFeeName}', '${committeeAmount}', '${0}');`
  );
  res.send({ rollNumber: `${rollNumber}` });
});

app.get("/get-student-details/:rollNumber", async (req, res) => {
  const { rollNumber } = req.params;
  const stmt = await db.all(
    `SELECT *
    FROM student_info 
    WHERE rollnumber = '${rollNumber}' ;`
  );
  res.send({ data: stmt });
});

app.get("/payments/:rollNumber", async (req, res) => {
  const { rollNumber } = req.params;
  const stmt = await db.all(
    `SELECT *
    FROM payments 
    WHERE student_rollnumber = '${rollNumber}' ;`
  );
  res.send({ data: stmt });
});

app.put("/pay-fees/:id", async (req, res) => {
  const { id } = req.params;
  const { committee_amount, dateTime } = req.body; // Extract dateTime from the request body

  try {
    // Fetch the committee_amount for the given payment id
    const { committee_amount } = await db.get(
      `SELECT committee_amount FROM payments WHERE id = ?;`,
      [id]
    );

    // Update payments table to set committee_amount to 0, update paid_amount, and set date_time
    await db.run(
      `UPDATE payments
       SET committee_amount = 0,
           paid_amount = paid_amount + ${committee_amount},
           date_time = ?
       WHERE id = ?;`,
      [dateTime, id]
    );

    res.send("success");
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).send("Error updating payment");
  }
});

app.get("/check-no-due/:rollNumber", async (req, res) => {
  const { rollNumber } = req.params;
  const row = await db.get(
    "SELECT SUM(balance_amount) AS total FROM fees_data WHERE student_rollnumber = ?",
    [rollNumber]
  );
  res.send(row);
});

app.get("/check-fines/:rollNumber", async (req, res) => {
  const { rollNumber } = req.params;
  const row = await db.get(
    "SELECT SUM(committee_amount) AS total FROM payments WHERE student_rollnumber = ?",
    [rollNumber]
  );
  res.send(row);
});

app.get("get-details/:rollNumber", async (req, res) => {
  const { rollNumber } = req.params;
  const stdData = await db.get(
    `SELECT * FROM student_info WHERE rollNumber = '${rollNumber}' `
  );
  res.send(stdData);
});
