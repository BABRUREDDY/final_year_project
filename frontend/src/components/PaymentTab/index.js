import React, { Component } from "react";
import { loadStripe } from "@stripe/stripe-js";

import "./index.css";

const stripePromise = loadStripe(
  "pk_test_51OonSJSHAhZAOTBa4gUrE40E7LVCvxv0fk5zMQIAdIGdXQys7GXXpDcVLdjfTmoYNncc2ctiFKrk4ECL5p6frUHU009ctjqps3"
);

class PaymentComponent extends Component {
  state = {
    payments: [],
    selectedPayments: [],
    paymentSuccess: false,
    checkBox: false,
    totalPayingAmount: 0, // Initialize total paying amount
    activeYear: "1st btech",
  };

  componentDidMount() {
    const { rollNumber } = this.props;
    fetch(`http://localhost:4000/sem-fees/${rollNumber}`)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({ payments: responseData });
      })
      .catch((error) => {
        console.error(`Error fetching payments data:`, error);
      });
  }

  handleCheckboxChange = (id, committeeAmount) => {
    const { selectedPayments } = this.state;

    // Check if the payment is already selected
    const paymentIndex = selectedPayments.findIndex(
      (payment) => payment.id === id
    );

    // If payment is not already selected, add it to the selectedPayments array
    if (paymentIndex === -1) {
      this.setState((prevState) => ({
        selectedPayments: [
          ...prevState.selectedPayments,
          { id, committeeAmount },
        ],
        checkBox: true,
        totalPayingAmount: prevState.totalPayingAmount + committeeAmount,
      }));
    } else {
      // If payment is already selected, remove it from the selectedPayments array
      const updatedSelectedPayments = [...selectedPayments];
      updatedSelectedPayments.splice(paymentIndex, 1);

      this.setState((prevState) => ({
        selectedPayments: updatedSelectedPayments,
        checkBox: updatedSelectedPayments.length > 0,
        totalPayingAmount: prevState.totalPayingAmount - committeeAmount,
      }));
    }
  };

  handlePayNow = async (feeId, rollNumber) => {
    const { selectedPayments } = this.state;

    const stripe = await stripePromise;

    selectedPayments.forEach(({ id, amount }) => {
      fetch(`http://localhost:4000/update-fees/${feeId}/${rollNumber}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payingAmount: amount }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update payment");
          }
          console.log("Payment updated successfully");
          this.setState({ paymentSuccess: true });
        })
        .then(({ clientSecret }) => {
          // Call Stripe checkout method with the clientSecret
          stripe.redirectToCheckout({ clientSecret });
        })
        .catch((error) => {
          console.error("Error updating payment:", error);
        });
    });
  };

  renderTableRows = () => {
    const { payments } = this.state;

    return payments.map((payment) => (
      <tr key={payment.id}>
        <td>{payment.fee_id}</td>
        <td>{payment.year}</td>
        <td>{payment.fees_name}</td>
        <td>{payment.due_amount}</td>
        <td>{payment.paid_amount}</td>
        <td>{payment.balance_amount}</td>
        <td>
          <input
            className="payments-tab-input"
            type="checkbox"
            onChange={() =>
              this.handleCheckboxChange(payment.id, payment.committee_amount)
            }
            disabled={payment.balance_amount === 0} // Disable checkbox if balance amount is 0
          />
        </td>
        <td>
          {this.state.selectedPayments.some((item) => item.id === payment.id) &&
            payment.balance_amount !== 0 && (
              <input
                type="number"
                placeholder="Enter amount"
                disabled={
                  !this.state.selectedPayments.some(
                    (item) => item.id === payment.id
                  )
                }
                onChange={(e) => {
                  this.handleAmountChange(payment.id, e.target.value);
                  this.setState({ totalPayingAmount: e.target.value });
                }}
              />
            )}
        </td>
        <td>
          {payment.balance_amount !== 0 && (
            <button
              className="payments-tab-button"
              onClick={() =>
                this.handlePayNow(payment.fee_id, payment.student_rollnumber)
              }
            >
              Pay Now
            </button>
          )}
        </td>
      </tr>
    ));
  };

  handleAmountChange = (id, amount) => {
    const { selectedPayments } = this.state;
    const updatedSelectedPayments = selectedPayments.map((payment) => {
      if (payment.id === id) {
        return { ...payment, amount: parseInt(amount) };
      }
      return payment;
    });
    this.setState({ selectedPayments: updatedSelectedPayments });
  };

  onBackButtonClick = () => {
    this.setState({ paymentSuccess: false });
    window.location.reload();
  };

  render() {
    const { paymentSuccess } = this.state;

    return (
      <div>
        {paymentSuccess ? (
          <div className="payment-verification">
            <h1>Payment Successful!</h1>
            <img
              alt="payment success"
              src="https://momentumacademy.net/wp-content/uploads/2020/05/Paymentsuccessful21.png"
            />
            <button
              style={{ marginTop: "1%" }}
              className="payments-tab-button"
              onClick={this.onBackButtonClick}
            >
              Back
            </button>
          </div>
        ) : (
          <div>
            <div className="table-info-tab">
              <h2>Payment Details</h2>
              <table className="payment-table">
                <thead>
                  <tr>
                    <th>Fee ID</th>
                    <th>Year</th>
                    <th>Fees Name</th>
                    <th>Total Amount</th>
                    <th>Paid</th>
                    <th>Balance</th>
                    <th>Select</th>
                    <th style={{ width: "5vw" }}>Fee Paying</th>
                    <th style={{ width: "3vw" }}>Pay</th>
                  </tr>
                </thead>
                <tbody>{this.renderTableRows()}</tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default PaymentComponent;
