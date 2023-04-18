import logo from './logo.svg';
import './App.css';
import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from "redux-persist/integration/react";
import axios from 'axios'
import Navigation from "./common/Navigation/index"
import store, { persistor } from './store/homeReducer'

import 'antd/dist/antd.css'


const Login = lazy(() => import("./pages/Login/index"))


const Register = lazy(() => import("./pages/Register/index"))

const Home = lazy(() => import("./pages/Home/index"))


function App() {
  return (
    <>
      <Provider store={store} >
        <PersistGate persistor={persistor}>


          <BrowserRouter>
         
  <Navigation />
          <Suspense fallback={<div>Loading...</div>}>
              <Routes>

                {/* <Route element={<About />} path="/about" /> */}
                <Route element={<Home />} path="/" />
                <Route element={<Login />} path="/login" />

                <Route element={<Register />} path="/register" />
                
              
              </Routes>
              </Suspense>
            
    
          </BrowserRouter>

        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
