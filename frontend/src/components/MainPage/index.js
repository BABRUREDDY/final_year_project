import { Component } from "react";
import { Redirect } from "react-router-dom";
import Cookies from "js-cookies";
import "@fortawesome/fontawesome-free/css/all.min.css";

import adminLogo from "./admin-logo.png";
import stdLogo from "./student-logo.png";

import "./index.css";

class MainPage extends Component {
  state = {
    adminId: "",
    adminPwd: "",
    rollNumber: "",
    studentPwd: "",
    redirect: false,
    stdRedirect: false,
    stdArray: "",
    login: "admin",
  };

  onUserChange = (event) => {
    this.setState({ login: event.target.value });
  };

  onChangeAdminId = (event) => {
    this.setState({ adminId: event.target.value });
  };

  onChangeAdminPwd = (event) => {
    this.setState({ adminPwd: event.target.value });
  };

  onClickAdminLogin = async (event) => {
    event.preventDefault();
    const { adminId, adminPwd } = this.state;
    const url = "http://localhost:4000/admin-login/";
    const details = {
      username: adminId,
      password: adminPwd,
    };
    const options = {
      method: "POST",
      body: JSON.stringify(details),
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        this.setState({ redirect: true }); // Set redirect to true
      } else {
        alert("Invalid Credentials");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  onChangeStdId = (event) => {
    this.setState({ rollNumber: event.target.value });
  };

  onChangeStdPwd = (event) => {
    this.setState({ studentPwd: event.target.value });
  };

  onClickStdLogin = async (event) => {
    event.preventDefault();
    const { rollNumber, studentPwd } = this.state;
    const url = "http://localhost:4000/student-login/";
    const details = {
      username: rollNumber,
      password: studentPwd,
    };
    const options = {
      method: "POST",
      body: JSON.stringify(details),
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        Cookies.setItem("rollNumber", rollNumber, {
          expires: 20,
        });
        this.setState({ stdRedirect: true }); // Set redirect to true
      } else {
        alert("Invalid Credentials");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  render() {
    const {
      adminId,
      adminPwd,
      rollNumber,
      studentPwd,
      redirect,
      stdRedirect,
      login,
    } = this.state;
    if (redirect) {
      return <Redirect to="/admin-panel" />;
    } else if (stdRedirect) {
      return <Redirect to={`/student-panel/${rollNumber}`} />;
    }
    return (
      <>
        <div>
          <img
            className="logo"
            alt="logo"
            src="https://res.cloudinary.com/dcajmncr4/image/upload/v1707317778/cqbgae90rv6bxdqlfixw.jpg"
          />
          <div className="main-container">
            <div>
              <div className="mainPage">
                <div className="dash">
                  <h1 style={{ textAlign: "center" }}>Welcome</h1>
                  <select
                    className="selection-ele"
                    onChange={this.onUserChange}
                  >
                    <option value="admin">Admin Login</option>
                    <option value="student">Student Login</option>
                  </select>
                  {login === "admin" && (
                    <form className="form" onSubmit={this.onClickAdminLogin}>
                      <img
                        className="mainpage-logo-size"
                        src={adminLogo}
                        alt="admin"
                      />
                      <label className="label-heading">Admin Log in</label>
                      <br />
                      <input
                        className="main-input"
                        type="name"
                        placeholder="Admin Id"
                        value={adminId}
                        onChange={this.onChangeAdminId}
                      />
                      <br />
                      <input
                        className="main-input"
                        type="password"
                        placeholder="Password"
                        value={adminPwd}
                        onChange={this.onChangeAdminPwd}
                      />
                      <br />
                      <button className="login-button"> Log in</button>
                    </form>
                  )}
                  {login === "student" && (
                    <form className="form" onSubmit={this.onClickStdLogin}>
                      <img
                        className="mainpage-logo-size"
                        src={stdLogo}
                        alt="admin"
                      />
                      <label className="label-heading">Student Log in</label>
                      <br />
                      <input
                        className="main-input"
                        type="name"
                        placeholder="Student Roll No"
                        value={rollNumber}
                        onChange={this.onChangeStdId}
                      />
                      <br />
                      <input
                        className="main-input"
                        type="password"
                        placeholder="Password"
                        value={studentPwd}
                        onChange={this.onChangeStdPwd}
                      />
                      <br />
                      <button className="login-button">Log in</button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <footer className="footer">
              <div className="container">
                <div className="footer-content">
                  <div className="footer-section contact">
                    <h3 style={{ color: "white" }}>Contact Us</h3>
                    <p style={{ color: "white" }}>
                      Address: 123 College Street, City, Country
                    </p>
                    <p style={{ color: "white" }}>Email: info@example.com</p>
                    <p style={{ color: "white" }}>Phone: +1234567890</p>
                  </div>
                  <div className="footer-section links">
                    <h3>Quick Links</h3>
                    <ul>
                      <li>
                        <a href="/">Home</a>
                      </li>
                      <li>
                        <a href="/about">About Us</a>
                      </li>
                      <li>
                        <a href="/courses">Courses</a>
                      </li>
                      <li>
                        <a href="/contact">Contact Us</a>
                      </li>
                    </ul>
                  </div>
                  <div className="footer-section social">
                    <h3>Follow Us</h3>
                    <ul className="social-links">
                      <li>
                        <a href="#www.facebook.com">
                          <i
                            className="fab fa-facebook"
                            style={{ color: "white" }}
                          ></i>
                        </a>
                      </li>
                      <li>
                        <a href="#www.x.com">
                          <i
                            className="fab fa-twitter"
                            style={{ color: "white" }}
                          ></i>
                        </a>
                      </li>
                      <li>
                        <a href="#www.instagram.com">
                          <i
                            className="fab fa-instagram"
                            style={{ color: "white" }}
                          ></i>
                        </a>
                      </li>
                      <li>
                        <a href="#www.linkedin.com">
                          <i
                            className="fab fa-linkedin"
                            style={{ color: "white" }}
                          ></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="bottom-bar">
                  <p style={{ color: "white" }}>
                    &copy; 2024 College Fee Management Portal. All rights
                    reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </>
    );
  }
}

export default MainPage;
