import React, { Component } from 'react';
import {FormGroup, ControlLabel, FormControl, HelpBlock, Button, Grid, Jumbotron} from 'react-bootstrap';
import Account from './Account';

export default class Login extends Component{
  constructor(){
    super();
    this.state = {
      name: null,
      role: null,
      userAuthorized : false
    };
  }

  render(){
    function FieldGroup({ id, label, help, ...props }) {
      return (
        <FormGroup controlId={id}>
          <ControlLabel>{label}</ControlLabel>
          <FormControl {...props} />
          {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
      );
    }

    function validateInput(email,pass){
      if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
        return "Email format not acceptable";
      }
      if( email.length > 19)return "password must be at most 19 characters";
      if( pass.length < 6) return "password must be at lease 6 characters";
      if( pass.length > 18)return "password must be at most 18 characters";

      return "";
    }

    function login(){
      var email = document.getElementById('formControlsEmail').value;
      var pass = document.getElementById('formControlsPassword').value;

      var result = validateInput(email,pass);
      if(result !== ""){
        alert(result);
        return;
      }

      fetch('/AuthorizeUser', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "usr" : email,
          "psw" : pass,
        })
      }).then(response => {
        return response.json();
      }).then(json => {
        console.log("response: " + JSON.stringify(json));
        if(json.msg){
          alert(json.msg);
          this.setState({
            name:email,
            role:json.role,
            userAuthorized : true
          });
        }else{
          alert(json.er);
        }
      }).catch((error) => {
        alert("ERROR: " + error);
      });

    }

    if(this.state.userAuthorized){
      return(
        <Grid>
          <Jumbotron>
            <Account name={this.state.name} userrole={this.state.role}/>
          </Jumbotron>
        </Grid>
      )
    }else{
      return(
        <Grid>
          <Jumbotron>
            <FieldGroup
              id="formControlsEmail"
              type="email"
              label="Email address"
              placeholder="Enter email"
            />
            <FieldGroup id="formControlsPassword" label="Password" type="password" />
            <Button onClick={login.bind(this)}>Submit</Button>
          </Jumbotron>
        </Grid>
      );
    }

  }
}


