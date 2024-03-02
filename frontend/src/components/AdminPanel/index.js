import React, { Component } from "react";

import "./index.css";
import StudentForm from "../StudentForm/";
import PaymentForm from "../Fee-Form";
import Feesforms from "../New-Fee-Component";

class AdminPanel extends Component {
  state = {
    view: "student-form",
  };

  onLogout = () => {
    const { history } = this.props;
    history.replace("/");
  };

  onNewStudent = () => {
    this.setState({ view: "student-form" });
  };

  onAddFee = () => {
    this.setState({ view: "fee-form" });
  };

  onAddFine = () => {
    this.setState({ view: "fine-form" });
  };

  render() {
    const { view } = this.state;
    return (
      <>
        <div>
          <img
            className="logo"
            alt="logo"
            src="https://res.cloudinary.com/dcajmncr4/image/upload/v1707317778/cqbgae90rv6bxdqlfixw.jpg"
          />
        </div>
        {/* Main content section Brooo */}
        <div className="new-admin">
          <h4 style={{ color: "black" }}>Admin Panel</h4>
        </div>
        <div className="main-container">
          <div className="sidebar-container">
            <table>
              <tbody style={{ backgroundColor: "whitesmoke" }}>
                <tr className="bg-tr">
                  <td>
                    <h4
                      style={{
                        backgroundColor: "rgb(15, 23, 42)",
                        textAlign: "center",
                        color: "whitesmoke",
                      }}
                    >
                      MENU
                    </h4>
                  </td>
                </tr>
                <tr className="bg-tr" style={{ height: "5vh" }}>
                  <td style={{ textAlign: "center" }}>
                    <button
                      style={{
                        width: "12vw",
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                      }}
                      className="admin-btn"
                      onClick={this.onNewStudent}
                    >
                      <i
                        className="fas fa-user-plus"
                        style={{ color: "white" }}
                      ></i>
                      Add Student
                    </button>
                  </td>
                </tr>
                <tr className="bg-tr">
                  <td style={{ textAlign: "center" }}>
                    <button
                      style={{
                        width: "12vw",
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                      }}
                      className="admin-btn"
                      onClick={this.onAddFee}
                    >
                      <i
                        className="fas fa-dollar-sign"
                        style={{ color: "white" }}
                      ></i>
                      Add Fee
                    </button>
                  </td>
                </tr>
                <tr className="bg-tr">
                  <td>
                    <button
                      className="admin-btn"
                      style={{ width: "12vw" }}
                      onClick={this.onAddFine}
                    >
                      <i
                        style={{ color: "white" }}
                        className="fas fa-exclamation-triangle"
                      ></i>{" "}
                      Penalty
                    </button>
                  </td>
                </tr>
                <tr className="bg-tr">
                  <td>
                    <button
                      className="admin-btn"
                      style={{ width: "12vw" }}
                      onClick={this.onLogout}
                    >
                      <i
                        className="fas fa-sign-out-alt"
                        style={{ color: "white" }}
                      ></i>{" "}
                      Logout
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="admin-container">
            {view === "student-form" && <StudentForm />}
            {view === "fine-form" && <PaymentForm />}
            {view === "fee-form" && <Feesforms />}
          </div>
        </div>
      </>
    );
  }
}

export default AdminPanel;
