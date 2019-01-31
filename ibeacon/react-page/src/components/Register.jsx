import React, { Component } from 'react';
import {FormGroup, ControlLabel, FormControl, HelpBlock, Button, Grid, Jumbotron} from 'react-bootstrap';
import Account from './Account';

export default class Register extends Component{
  constructor(){
    super();
    this.state = {
      name: null,
      role: null,
      registerSuccessful : false
    };
  }
  render(){
    const formInstance = (
      <Grid>
        <Jumbotron>
          <FieldGroup
            id="formControlsEmail"
            type="email"
            label="Email address"
            placeholder="Enter email"
          />
          <FieldGroup id="formControlsPassword" label="Password" type="password" />
          <FieldGroup id="formControlsPassword-check" label="Confirm Password" type="password" />
          <Button onClick={createUser.bind(this)}>Submit</Button>
        </Jumbotron>
      </Grid>
    );

    const redirectInstance = (
      <Account name={this.state.name} userrole={this.state.role}/>
    );

    function FieldGroup({ id, label, help, ...props }) {
      return (
        <FormGroup controlId={id}>
          <ControlLabel>{label}</ControlLabel>
          <FormControl {...props} />
          {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
      );
    }

    function validateInput(email,pass1,pass2){
      if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
        return "Email format not acceptable";
      }
      if( email.length > 19)return "password must be at most 19 characters";
      if( pass1 !== pass2){
        return "passwords not matching";
      }
      if( pass1.length < 6) return "password must be at lease 6 characters";
      if( pass1.length > 18)return "password must be at most 18 characters";

      return "";
    }

    function createUser(){

      var email = document.getElementById('formControlsEmail').value;
      var pass1 = document.getElementById('formControlsPassword').value;
      var pass2 = document.getElementById('formControlsPassword-check').value;

      var result = validateInput(email,pass1,pass2);
      if(result !== ""){
        alert(result);
        return;
      }

      fetch('/CreateUser', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "usr" : email,
          "psw" : pass1,
        })
      }).then(response => {
        return response.json();
      }).then(json => {
        if(json.msg){
          alert(json.msg);
          this.setState({
            name:email,
            role:json.role,
            registerSuccessful : true
          });
        }else{
          alert(json.er);
        }
      }).catch((error) => {
        alert("ERROR: " + error);
      });
    }
    if(this.state.registerSuccessful){
      return(redirectInstance);
    }else{
      return(formInstance);
    }
  }
}


