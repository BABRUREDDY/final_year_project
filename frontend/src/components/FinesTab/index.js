import React, { Component } from "react";
import "./fines.css";

class FeePaymentComponent extends Component {
  state = {
    payments: [],
    selectedPayments: [],
    paymentSuccess: false,
    checkBox: false,
    totalPayingAmount: 0, // Initialize total paying amount
  };

  componentDidMount() {
    const { match } = this.props;
    const { rollNumber } = match.params;

    fetch(`http://localhost:4000/payments/${rollNumber}`)
      .then((response) => response.json())
      .then((responseData) => {
        const { data } = responseData;
        this.setState({ payments: data });
      })
      .catch((error) => {
        console.error("Error fetching payment details:", error);
      });
  }

  onBackButtonClick = () => {
    this.setState({ paymentSuccess: false });
    window.location.reload();
  };

  handleCheckboxChange = (id, committeeAmount) => {
    const { selectedPayments } = this.state;
    const selectedIndex = selectedPayments.findIndex(
      (payment) => payment.id === id
    );

    if (selectedIndex === -1) {
      this.setState((prevState) => ({
        selectedPayments: [
          ...prevState.selectedPayments,
          { id, committeeAmount },
        ],
        checkBox: true,
        totalPayingAmount: prevState.totalPayingAmount + committeeAmount, // Update total paying amount
      }));
    } else {
      const updatedSelectedPayments = selectedPayments.filter(
        (payment) => payment.id !== id
      );
      this.setState((prevState) => ({
        selectedPayments: updatedSelectedPayments,
        checkBox: updatedSelectedPayments.length > 0,
        totalPayingAmount: prevState.totalPayingAmount - committeeAmount, // Update total paying amount
      }));
    }
  };

  handlePayNow = () => {
    const { selectedPayments } = this.state;
    const dateTime = new Date().toISOString();

    selectedPayments.forEach(({ id, committeeAmount }) => {
      fetch(`http://localhost:4000/pay-fees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ committee_amount: committeeAmount, dateTime }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update payment");
          }
          console.log("Payment updated successfully");
          this.setState({ paymentSuccess: true });
        })
        .catch((error) => {
          console.error("Error updating payment:", error);
        });
    });
  };

  render() {
    const { payments, paymentSuccess, checkBox, totalPayingAmount } =
      this.state;
    return (
      <div>
        {paymentSuccess ? (
          <div className="payment-verification">
            <h1>Payment Successful!</h1>
            <img
              alt="payment success"
              src="https://momentumacademy.net/wp-content/uploads/2020/05/Paymentsuccessful21.png"
            />
            <button onClick={this.onBackButtonClick}>Back</button>
          </div>
        ) : (
          <div>
            <div className="std-logo">
              <img
                className="logo"
                alt="logo"
                src="https://res.cloudinary.com/dcajmncr4/image/upload/v1707317778/cqbgae90rv6bxdqlfixw.jpg"
              />
            </div>
            <div className="table-info-tab">
              <h2>Payment Details</h2>
              <table>
                <thead>
                  <tr>
                    <th>Serial Number</th>
                    <th>Fee Name</th>
                    <th>Due Amount</th>
                    <th>Paid Amount</th>
                    <th>Select</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, index) => (
                    <tr key={payment.id}>
                      <td>{index + 1}</td>
                      <td>{payment.semester_fee_name}</td>
                      <td>{payment.committee_amount}</td>
                      <td>{payment.paid_amount}</td>
                      <td>
                        {payment.committee_amount !== 0 && ( // Check if Due Amount is not 0
                          <input
                            type="checkbox"
                            onChange={() =>
                              this.handleCheckboxChange(
                                payment.id,
                                payment.committee_amount
                              )
                            }
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="total-paying-amount">
              <span>Total Paying Amount: {totalPayingAmount}</span>
            </div>
            <div className="button-style">
              {checkBox &&
                totalPayingAmount !== 0 && ( // Check if there's a selected payment and total paying amount is not 0
                  <button onClick={this.handlePayNow}>Pay Now</button>
                )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default FeePaymentComponent;
