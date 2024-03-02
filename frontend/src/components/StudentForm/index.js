import React, { Component } from "react";
import "./index.css";

class StudentForm extends Component {
  state = {
    name: "",
    rollnumber: "",
    department: "CSE",
    semester: "1ST",
    phoneNumber: "",
    isConveyor: "",
    email: "",
    password: "",
    gender: "",
  };

  onClickAddStudent = async (event) => {
    event.preventDefault();
    const formData = { ...this.state };

    // Send POST request to backend API
    const url = "http://localhost:4000/add-new-students";
    const option = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    };
    try {
      const response = await fetch(url, option);

      if (!response.ok) {
        throw new Error("Failed to add student");
      }

      alert("Student added successfully");
      this.setState({
        name: "",
        rollnumber: "",
        department: "CSE",
        semester: "1ST",
        phoneNumber: "",
        isConveyor: "",
        email: "",
        password: "",
        gender: "",
      });
    } catch (error) {
      console.error("Error:", error.message);
      alert("Failed to add student");
    }
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
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
    } = this.state;
    return (
      <div className="form-container">
        <h1 className="form-heading">Student Registration Form</h1>
        <form onSubmit={this.onClickAddStudent} className="student-form">
          <table className="form-table">
            <tbody>
              <tr>
                <td className="form-cell">
                  <label className="form-label">Name:</label>
                </td>
                <td className="form-cell">
                  <input
                    className="form-input-2106"
                    type="text"
                    name="name"
                    value={name}
                    onChange={this.handleChange}
                    placeholder="Enter Student Name"
                    required
                  />
                </td>
                <td className="form-cell">
                  <label className="form-label">Roll Number:</label>
                </td>
                <td className="form-cell">
                  <input
                    className="form-input-2106"
                    type="text"
                    name="rollnumber"
                    value={rollnumber}
                    onChange={this.handleChange}
                    placeholder="Enter Student Roll Number"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td className="form-cell">
                  <label className="form-label">Phone Number:</label>
                </td>
                <td className="form-cell">
                  <input
                    className="form-input-2106"
                    type="text"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={this.handleChange}
                    placeholder="Enter Student Phone Number"
                    required
                  />
                </td>
                <td className="form-cell">
                  <label className="form-label">Email:</label>
                </td>
                <td className="form-cell">
                  <input
                    className="form-input-2106"
                    type="email"
                    name="email"
                    value={email}
                    onChange={this.handleChange}
                    placeholder="Enter Student Email"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td className="form-cell">
                  <label className="form-label">Password:</label>
                </td>
                <td className="form-cell">
                  <input
                    className="form-input-2106"
                    type="password"
                    name="password"
                    value={password}
                    onChange={this.handleChange}
                    placeholder="Set Student Password"
                    required
                  />
                </td>
                <td className="form-cell">
                  <label className="form-label">Department:</label>
                </td>
                <td className="form-cell">
                  <select
                    className="form-input"
                    name="department"
                    value={department}
                    onChange={this.handleChange}
                  >
                    <option value="CSE">CSE</option>
                    <option value="EEE">EEE</option>
                    <option value="ECE">ECE</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="MECH">MECH</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td className="form-cell">
                  <label className="form-label">Year:</label>
                </td>
                <td className="form-cell">
                  <select
                    className="form-input"
                    name="semester"
                    value={semester}
                    onChange={this.handleChange}
                  >
                    <option>1st year</option>
                    <option>2nd year</option>
                    <option>3rd year</option>
                    <option>4th year</option>
                  </select>
                </td>
                <td className="form-cell">
                  <label className="form-label">Seat type:</label>
                </td>
                <td className="form-cell">
                  <select
                    className="form-input"
                    name="isConveyor"
                    value={isConveyor}
                    onChange={this.handleChange}
                  >
                    <option value="">None</option>
                    <option value={"CONVENOR"}>CONVENOR</option>
                    <option value={"NON CONVENOR"}>NON CONVENOR</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td className="form-cell">
                  <label className="form-label">Gender:</label>
                </td>
                <td colSpan="3" className="form-cell">
                  <select
                    className="form-input-gender"
                    name="gender"
                    value={gender}
                    onChange={this.handleChange}
                  >
                    <option value="">None</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="btn-container">
            <button type="submit" className="admin-panel-submit-btn">
              SAVE
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default StudentForm;
