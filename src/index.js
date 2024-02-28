import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ErrorBoundaries from "./ErrorBoundaries";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./cartContext";

ReactDOM.render(
    <ErrorBoundaries>,
        <BrowserRouter>
            <CartProvider>
                <App />
            </CartProvider>
        </BrowserRouter>
    </ErrorBoundaries>,
    document.getElementById("root"));
