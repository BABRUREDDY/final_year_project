import MainPage from "./components/MainPage";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import AdminPanel from "./components/AdminPanel";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StudentForm from "./components/StudentForm";
import PaymentForm from "./components/Fee-Form";
import StudentPanel from "./components/StudentPanel";
import FeePaymentComponent from "./components/FinesTab";

import PaymentComponent from "./components/PaymentTab";

const stripePromise = loadStripe(
  "pk_test_51OonSJSHAhZAOTBa4gUrE40E7LVCvxv0fk5zMQIAdIGdXQys7GXXpDcVLdjfTmoYNncc2ctiFKrk4ECL5p6frUHU009ctjqps3"
);

const App = () => (
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={MainPage} />
        <Route exact path="/admin-panel" component={AdminPanel} />
        <Route exact path="/student-form" component={StudentForm} />
        <Route exact path="/fees-form" component={PaymentForm} />
        <Route
          exact
          path="/student-panel/:rollNumber"
          component={StudentPanel}
        />
        <Route
          exact
          path="/pay-student-fees/:rollNumber"
          component={PaymentComponent}
        />
        <Route
          exact
          path="/pay-fees/:rollNumber"
          component={FeePaymentComponent}
        />
      </Switch>
    </BrowserRouter>
  </Elements>
);

export default App;
