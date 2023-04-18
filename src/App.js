import logo from './logo.svg';
import './App.css';
import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from "redux-persist/integration/react";
import axios from 'axios'
import store, { persistor } from './store/homeReducer'
import React, { Component } from 'react';
import Navigation from './common/Navigation/index'
import 'antd/dist/antd.css'


const Login = lazy(() => import("./pages/Login/index"))

const Register = lazy(() => import("./pages/Register/index"))

const Home = lazy(() => import("./pages/Home/index"))

const Product = lazy(() => import("./pages/Product/index"))
const Service = lazy(() => import("./pages/Service/index"))


const App = () => {


  return (
    <>
<div style={{background:"#274C77",height:"100vh"}}>


      <Provider store={store} >
        <PersistGate persistor={persistor}>


          <BrowserRouter>

          <Navigation />
            <Suspense fallback={<div>Loading...</div>}>
             
              <Routes>

                {/* <Route element={<About />} path="/about" /> */}

                <Route element={<Login />} path="/login" />

                <Route element={<Home />} path="/"/>

                <Route element={<Register />} path="/register" />

                <Route element={<Service />} path="/service" />

                <Route element={<Product />} path="/product" />
              </Routes>
            </Suspense>


          </BrowserRouter>

        </PersistGate>
      </Provider>
      </div>
    </>
  )
}

export default App;