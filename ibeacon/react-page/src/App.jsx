import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Route } from 'react-router-dom';
import Home from "./components/Home";
import About from "./components/About";
import Navbar from "./components/CustomNavbar";
import Register from "./components/Register";
import Login from "./components/Login";
import Account from "./components/Account";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar />
          <Route exact path='/' component={Home}/>
          <Route path='/about' component={About}/>
          <Route path='/register' component={Register}/>
          <Route path='/login' component={Login}/>
          <Route path='/account' component={Account}/>
        </div>
      </Router>
    );
  }
}

export default App;
