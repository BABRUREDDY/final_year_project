import React, { Component } from "react";

import "./feeComponent.css";

const firstYear = [
  {
    tabId: "1st btech",
    feeId: "F101",
    feeName: "College Fee",
    Amount: "56000",
  },
  {
    tabId: "1st btech",
    feeId: "F102",
    feeName: "Hostel Fee",
    Amount: "36000",
  },

  {
    tabId: "2nd btech",
    feeId: "F201",
    feeName: "College Fee",
    Amount: "56000",
  },
  {
    tabId: "2nd btech",
    feeId: "F202",
    feeName: "Hostel Fee",
    Amount: "36000",
  },

  {
    tabId: "3rd btech",
    feeId: "F301",
    feeName: "College Fee",
    Amount: "56000",
  },
  {
    tabId: "3rd btech",
    feeId: "F302",
    feeName: "Hostel Fee",
    Amount: "36000",
  },

  {
    tabId: "4th btech",
    feeId: "F401",
    feeName: "College Fee",
    Amount: "56000",
  },
  {
    tabId: "4th btech",
    feeId: "F402",
    feeName: "Hostel Fee",
    Amount: "36000",
  },
];

class FeesForm extends Component {
  state = {
    rollNumber: "",
    studentDetails: null,
    showStd: false,
    feesTab: "1st btech", // Default tab
    feesData: [], // Array of fees data based on tabs
    activeYear: "1st btech",
    render: 0,
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSearch = async () => {
    const { rollNumber } = this.state;
    const apiUrl = `http://localhost:4000/get-student-details/${rollNumber}`; // Update with your API URL

    const allFeesUrl = `http://localhost:4000/fees/${rollNumber}`;
    const feesResponse = await fetch(allFeesUrl);
    const feesResponseData = await feesResponse.json();
    const updatedData = feesResponseData.map((fees) => ({
      feeId: fees.fee_id,
    }));

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Student not found");
      }

      const responseData = await response.json();
      const { data } = responseData;

      this.setState({
        studentDetails: data[0],
        showStd: true,
        feesData: updatedData,
      });
    } catch (error) {
      console.error("Error:", error.message);
      alert("Student not found");
    }
  };

  addFees = async (event) => {
    const { rollNumber } = this.state;
    const url = `http://localhost:4000/add-fees/`;
    const addFee = firstYear.filter(
      (eachItem) => eachItem.feeId === event.target.value
    );
    const { tabId, feeId, feeName, Amount } = addFee[0];
    const feeDetails = {
      rollNumber,
      tabId,
      feeId,
      feeName,
      Amount,
    };
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feeDetails),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Failed to create payment");
      }
      alert("Payment created successfully");

      // Update feesData with the added fee
      const addedFeeId = event.target.value;
      this.setState((prevState) => ({
        feesData: [...prevState.feesData, { feeId: addedFeeId }],
        render: prevState.render + 1, // Trigger re-render
      }));
    } catch (error) {
      alert("Failed to Add Payment");
    }
  };

  removeFee = async (event) => {
    const { rollNumber } = this.state;
    const feeId = event.target.value;
    const url = `http://localhost:4000/remove-fees/${rollNumber}/${feeId}`;

    try {
      const response = await fetch(url, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to remove fee");
      }
      alert("Fee removed successfully");

      // Update feesData by removing the deleted fee
      const removedFeeId = event.target.value;
      this.setState((prevState) => ({
        feesData: prevState.feesData.filter(
          (fee) => fee.feeId !== removedFeeId
        ),
        render: prevState.render + 1, // Trigger re-render
      }));
    } catch (error) {
      alert("Failed to remove Fees");
    }
  };

  handleTabChange = (event) => {
    this.setState(
      {
        feesTab: event.target.value,
        activeYear: event.target.value,
      },
      this.feesComponent
    );
  };

  feesComponent = () => {
    const { studentDetails, activeYear, feesData, feesTab } = this.state;

    if (!studentDetails) {
      return (
        <div style={{ textAlign: "center" }}>
          Student details not available.
        </div>
      );
    }
    const { isConveyor } = studentDetails;

    const feeData = firstYear.filter((eachItem) => eachItem.tabId === feesTab);

    const updatedFeeData = feeData.map((arr) => {
      if (isConveyor === "CONVENOR") {
        if (
          arr.feeId === "F101" ||
          arr.feeId === "F201" ||
          arr.feeId === "F301" ||
          arr.feeId === "F401"
        ) {
          arr.Amount = 56000;
        }
      } else {
        if (
          arr.feeId === "F101" ||
          arr.feeId === "F201" ||
          arr.feeId === "F301" ||
          arr.feeId === "F401"
        ) {
          arr.Amount = 90000;
        }
      }
      return arr; // Return the updated object
    });

    return (
      <div className="student-details-container">
        <div className="student-details">
          <h2>Student Details</h2>
          <table className="student-details-table">
            <tbody>
              <tr>
                <td className="detail-label">Name:</td>
                <td>{studentDetails.name}</td>
              </tr>
              <tr>
                <td className="detail-label">Roll Number:</td>
                <td>{studentDetails.rollnumber}</td>
              </tr>
              <tr>
                <td className="detail-label">Department:</td>
                <td>{studentDetails.department}</td>
              </tr>
              <tr>
                <td className="detail-label">Year:</td>
                <td>{studentDetails.semester} Btech</td>
              </tr>
              <tr>
                <td className="detail-label">Phone Number:</td>
                <td>{studentDetails.phoneNumber}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="fees-details-container">
          <h2>Fees Details</h2>
          <table style={{ width: "50vw" }}>
            <thead style={{ width: "20vw" }}>
              <th>
                <button
                  className={`year-button ${
                    activeYear === "1st btech" ? "active" : ""
                  }`}
                  onClick={this.handleTabChange}
                  value="1st btech"
                >
                  1st year
                </button>
              </th>
              <th>
                <button
                  className={`year-button ${
                    activeYear === "2nd btech" ? "active" : ""
                  }`}
                  onClick={this.handleTabChange}
                  value="2nd btech"
                >
                  2nd year
                </button>
              </th>
              <th>
                <button
                  className={`year-button ${
                    activeYear === "3rd btech" ? "active" : ""
                  }`}
                  onClick={this.handleTabChange}
                  value="3rd btech"
                >
                  3rd year
                </button>
              </th>
              <th>
                <button
                  className={`year-button ${
                    activeYear === "4th btech" ? "active" : ""
                  }`}
                  onClick={this.handleTabChange}
                  value="4th btech"
                >
                  4th year
                </button>
              </th>
            </thead>
          </table>
          <table className="fees-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Sem Fee</th>
                <th>Fee Due</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {updatedFeeData.map((fees) => (
                <tr key={fees.feeId} className="fees-row">
                  <td>{fees.feeId}</td>
                  <td>{fees.feeName}</td>
                  <td>{fees.Amount}</td>
                  <td>
                    {feesData.find((fee) => fee.feeId === fees.feeId) ? (
                      <button
                        className="remove-button"
                        onClick={this.removeFee}
                        value={fees.feeId}
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        className="add-button"
                        onClick={this.addFees}
                        value={fees.feeId}
                      >
                        Add
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  render() {
    const { rollNumber, showStd } = this.state;
    return (
      <div className="fees-form-container">
        <div className="search-container">
          <input
            type="text"
            className="roll-number-input"
            name="rollNumber"
            value={rollNumber}
            onChange={this.handleChange}
            placeholder="Enter Roll Number"
          />
          <button className="search-button" onClick={this.handleSearch}>
            Search
          </button>
        </div>

        {showStd && this.feesComponent()}
      </div>
    );
  }
}

export default FeesForm;
