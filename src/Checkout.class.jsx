import React from "react";
import { saveShippingAddress } from "./services/shippingService";

const STATUS = {
    IDLE: "IDLE",
    SUBMITTED: "SUBMITTED",
    SUBMITTING: "SUBMITTING",
    COMPLETED: "COMPLETED",
}

// Declaring outside component to avoid recreation on each render
const emptyAddress = {
    city: "",
    country: "",
};

export default class Checkout extends React.Component {

    state = {
        address: emptyAddress,
        status: STATUS.IDLE,
        saveError: null,
        touched: {},
    }


    //DERIVED state
    isValid() {
        const errors = this.getErrors(this.state.address);
        return Object.keys(errors).length === 0;
    }


    handleChange = (e) => {
        e.persist(); // persist the event
        this.setState((state) => {
            return {
                address:
                {
                    ...state.address,
                    [e.target.id]: e.target.value,
                }
            };
        });
    }

    handleBlur = (event) => {
        event.persist();
        this.setState((state) => {
            return {
                touched: {
                    ...state.touched,
                    [event.target.id]: true,
                }
            };
        });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        this.setState({ status: STATUS.SUBMITTED });
        if (this.isValid()) {
            try {
                await saveShippingAddress(this.state.address);
                this.props.dispatch({ type: "empty" });
                this.setState({ status: STATUS.COMPLETED });
            } catch (e) {
                this.setState({ saveError: e });
            }
        } else {
            this.setState({ status: STATUS.SUBMITTED });
        }
    }

    getErrors = (address) => {
        const result = {};
        if (!address.city) result.city = "city is required";
        if (!address.country) result.country = "country is required";
        return result;
    }


    render() {

        const { status, saveError, touched, address } = this.state;
        // derived staete
        const errors = this.getErrors(this.state.address);

        if (saveError) throw saveError;
        if (status === STATUS.COMPLETED) {
            return <h1>Thanks for shopping!</h1>
        }


        return (
            <>
                <h1>Shipping Info</h1>
                {!this.isValid() && status === STATUS.SUBMITTED && (
                    <div role="alert">
                        <p>
                            Please fix following errors:
                        </p>
                        <ul>
                            {Object.keys(errors).map((key) => {
                                return <li key={key}>{errors[key]}</li>
                            })}
                        </ul>
                    </div>
                )}
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <label htmlFor="city">City</label>
                        <br />
                        <input
                            id="city"
                            type="text"
                            value={address.city}
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                        />
                        <p role="alert">
                            {(touched.city || status === STATUS.SUBMITTED) && errors.city}
                        </p>
                    </div>

                    <div>
                        <label htmlFor="country">Country</label>
                        <br />
                        <select
                            id="country"
                            value={address.country}
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                        >
                            <option value="">Select Country</option>
                            <option value="China">China</option>
                            <option value="India">India</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="USA">USA</option>
                        </select>
                        <p role="alert">
                            {(touched.country || status === STATUS.SUBMITTED) && errors.country}
                        </p>
                    </div>

                    <div>
                        <input
                            type="submit"
                            className="btn btn-primary"
                            value="Save Shipping Info"
                            disabled={status === STATUS.SUBMITTING}
                        />
                    </div>
                </form>
            </>
        );
    }
}
