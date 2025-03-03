import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {Provider} from "react-redux";
import {store} from "./store/store";
import {BrowserRouter} from "react-router-dom";
import {AuthConsumer, AuthProvider, StateType} from "./context/auth-context";


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
        <Provider store={store}>
            <BrowserRouter>
                <AuthProvider>
                    <AuthConsumer>
                        {
                            (auth: StateType | undefined) =>
                                (auth?.isLoading) ? null :
                                    <App/>
                        }
                    </AuthConsumer>
                </AuthProvider>
            </BrowserRouter>
        </Provider>
);


