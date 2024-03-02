import React, { Component } from "react";
import PaymentComponent from "../PaymentTab";
import "./index.css";

import jsPDF from "jspdf";

class StudentPanel extends Component {
  state = {
    rollNumber: "",
    studentDetails: "",
    totalDue: "",
    fineDue: 0,
    view: "std-dashboard",
    currentDate: new Date().toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    }),
  };

  componentDidMount() {
    this.fetchStudentDetails();
  }

  fetchStudentDetails = async (props) => {
    const { match } = this.props;
    const { params } = match;
    const { rollNumber } = params;
    this.setState({ rollNumber });

    const url = `http://localhost:4000/get-student-details/${rollNumber}`;
    const feeUrl = `http://localhost:4000/check-no-due/${rollNumber}`;
    const options = {
      method: "GET",
    };

    try {
      const response = await fetch(url, options);
      const responseData = await response.json();

      const feeResponse = await fetch(feeUrl, options);
      const feeData = await feeResponse.json();

      const fineResponse = await fetch(
        `http://localhost:4000/check-fines/${rollNumber}`,
        options
      );
      const fineData = await fineResponse.json();

      this.setState({ fineDue: fineData.total === null ? 0 : fineData.total });

      const { data } = responseData;

      if (response.ok) {
        this.setState({
          studentDetails: data[0],
          totalDue: feeData.total === null ? 0 : feeData.total,
        }); // Set redirect to true
      } else {
        alert("Invalid Credentials");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  onLogout = () => {
    const { history } = this.props;
    history.replace("/");
  };

  onStdDashBoard = () => {
    this.setState({ view: "std-dashboard" });
  };

  onClickPayFee = () => {
    this.setState({ view: "payments-tab" });
    // const { history } = this.props;
    // const { match } = this.props;
    // const { params } = match;
    // const { rollNumber } = params;
    // history.push(`/pay-fees/${rollNumber}`);
  };

  saveAsPDF = () => {
    const { studentDetails, currentDate } = this.state;

    const doc = new jsPDF();
    const logoImage =
      "https://res.cloudinary.com/dcajmncr4/image/upload/v1707317778/cqbgae90rv6bxdqlfixw.jpg";

    doc.addImage(logoImage, "PNG", 8, 5, 1300 * 0.15, 140 * 0.15);
    const dumpReferenceId = Array.from(
      { length: 12 },
      () => Math.random().toString(36)[2]
    ).join("");
    doc.text(`Reference ID: ${dumpReferenceId}`, 10, 50);

    doc.textWithLink(`Date: ${currentDate}`, 166, 48, {
      underline: true,
    });

    doc.setFontSize(16);
    doc.text("NO DUES CERTIFICATE", 105, 70, null, null, "center");
    doc.setFontSize(15);

    const description = `As seen from the office records, there are no pending dues against\nMr./Miss ${studentDetails.name} B.Tech I to VIII Semester Roll No. ${studentDetails.rollnumber}  in the following departments.`;
    const splitDescription = doc.splitTextToSize(description, 180);
    doc.text(20, 80, splitDescription);

    // Assuming doc is the jsPDF instance
    doc.setFont("courier"); // Set monospaced font

    const names = [
      "Account section : Madhu Sudhan",
      "Hostel for Men  : Prakash",
      "Hostel for Women: Vijaya",
      "Help Desk       : Sangeetha",
    ];

    const yPos = 120; // Initial Y position

    // Loop through each name and add it to the PDF with adjusted formatting
    names.forEach((name, index) => {
      const formattedName = `${index + 1}. ${name}`;
      const xPos = 30; // X position remains constant
      const lineHeight = 10; // Adjust line height as needed

      // Add the formatted name to the PDF
      doc.text(xPos, yPos + index * lineHeight, formattedName);
    });

    // Set font style to bold and underline
    doc.setFont("bold");
    const studentName = `Student Name: ${studentDetails.name}`;
    const rollNumber = `Roll Number: ${studentDetails.rollnumber}`;
    doc.text(100, 160, studentName, { underline: true });
    doc.text(100, 170, rollNumber, { underline: true });
    doc.setFont("normal");

    doc.save(`${studentDetails.rollnumber}.pdf`);
  };

  handleGenerateNoDueForm = async () => {
    const { rollNumber } = this.state;

    const options = {
      method: "GET",
    };

    const response = await fetch(
      `http://localhost:4000/check-no-due/${rollNumber}`, //All payments URL
      options
    );

    const fineResponse = await fetch(
      `http://localhost:4000/check-fines/${rollNumber}`, // ALL fines URL
      options
    );

    const data = await response.json(); // All PAYMENTS URL RESPONSE DATA

    const fineData = await fineResponse.json(); // ALL FINES URL RESPONSE DATA

    console.log(data);
    console.log(fineData);

    if (data.total === 0 && fineData.total === 0) {
      this.saveAsPDF();
    } else {
      alert("Fees due");
    }
  };

  onClickFines = () => {
    const { history } = this.props;
    const { match } = this.props;
    const { params } = match;
    const { rollNumber } = params;
    history.push(`/pay-fees/${rollNumber}`);
  };

  studentDashboard = () => {
    const { studentDetails, totalDue, fineDue } = this.state;
    const {
      name,
      rollnumber,
      email,
      phoneNumber,
      semester,
      department,
      isConveyor,
    } = studentDetails;

    const studentFields = [
      { label: "Name", value: name },
      { label: "Roll Number", value: rollnumber },
      { label: "Phone Number", value: phoneNumber },
      { label: "Email", value: email },
      { label: "Seat Type", value: isConveyor },
      { label: "Department", value: department },
      { label: "Semester", value: semester },
      { label: "Total Fee Due", value: totalDue },
      { label: "Fines", value: fineDue },
    ];

    return (
      <div className="std-dd-1">
        <div className="student-details-container">
          <h2 style={{ color: "black" }}>Student Details</h2>
          <div className="student-details-table">
            <table>
              <tbody>
                {studentFields.map((field, index) => (
                  <tr key={index}>
                    <td className="label">{field.label}</td>
                    <td className="value">{field.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { studentDetails, view, rollNumber } = this.state;
    return (
      <div className="student-main-page">
        <div className="std-logo">
          <img
            className="logo"
            alt="logo"
            src="https://res.cloudinary.com/dcajmncr4/image/upload/v1707317778/cqbgae90rv6bxdqlfixw.jpg"
          />
        </div>
        <div className="std-dd">
          <h4 style={{ color: "white" }}>Welcome {studentDetails.name}</h4>
          <button className="bsp-button" onClick={this.onLogout}>
            Logout
          </button>
        </div>
        <div className="main-img-bg">
          <div className="bg">
            <div className="sidebar">
              <button
                value="std-dashboard"
                onClick={this.onStdDashBoard}
                className="sidebar-button"
              >
                Student Details
              </button>
              <button
                value="payments-tab"
                onClick={this.onClickPayFee}
                className="sidebar-button"
              >
                Payments
              </button>
              <button onClick={this.onClickFines} className="sidebar-button">
                Pay Fines
              </button>
              <button
                onClick={this.handleGenerateNoDueForm}
                className="sidebar-button"
              >
                No Due Form
              </button>
            </div>
          </div>
          <div className="sp-2">
            {view === "std-dashboard" && this.studentDashboard()}
            {view === "payments-tab" && (
              <PaymentComponent
                rollNumber={rollNumber}
                onClickPayFee={this.onClickPayFee}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default StudentPanel;
