import React from 'react'
import "./styles/index.scss";
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from 'styled-components'
import App from './App';
import {theme} from "./utils/constants"
import { GlobalStyles } from './styles/GlobalStyles';
import {BrowserRouter} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
  <ThemeProvider theme={theme}>
    <GlobalStyles></GlobalStyles>
    <BrowserRouter>
      <App />
      <ToastContainer/>
    </BrowserRouter>
  </ThemeProvider>
  </React.StrictMode>,
)
