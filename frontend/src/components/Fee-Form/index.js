import React, { Component } from "react";
import "./index.css";

class PaymentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rollNumber: "",
      semesterFeeName: "",
      committeeAmount: "",
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { rollNumber, semesterFeeName, committeeAmount } = this.state;
    const formData = {
      rollNumber,
      semesterFeeName,
      committeeAmount,
    };

    // Send PUT request to backend API
    try {
      const response = await fetch("http://localhost:4000/std-payments", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment");
      }

      alert("Payment created successfully");
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error.message);
      alert("Failed to create payment");
    }
  };

  onBack = (props) => {
    const { history } = this.props;
    history.replace("/admin-panel");
  };

  render() {
    const { rollNumber, semesterFeeName, committeeAmount } = this.state;
    return (
      <>
        <div className="form-container-1">
          <h2 className="form-title">Student Penalty Form</h2>
          <form onSubmit={this.handleSubmit} className="form">
            <table>
              <tbody>
                <tr>
                  <td>
                    {" "}
                    <label htmlFor="studentId">Student RollNo:</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      id="rollNumber"
                      name="rollNumber"
                      value={rollNumber}
                      onChange={this.handleChange}
                      placeholder="Student ID"
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="semesterFeeName">Penalty Name:</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      id="semesterFeeName"
                      name="semesterFeeName"
                      value={semesterFeeName}
                      onChange={this.handleChange}
                      placeholder="Penalty Name"
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="committeeAmount">Fine Amount:</label>
                  </td>
                  <td>
                    <input
                      type="number"
                      id="committeeAmount"
                      name="committeeAmount"
                      value={committeeAmount}
                      onChange={this.handleChange}
                      placeholder="Due Amount"
                      required
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
      </>
    );
  }
}

export default PaymentForm;
