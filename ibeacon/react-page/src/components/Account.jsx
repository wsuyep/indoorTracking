import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Button, Jumbotron, Grid, Table} from 'react-bootstrap';
import './Account.css';
import PDF from 'react-pdf-js';

function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}

export default class Account extends Component{
  constructor(props){
    super(props);

    this.getUserInfo = this.getUserInfo.bind(this);
    this.state = {
      showPopup: false,
      deletedRecord: false
    };
  }

  togglePopup(data) {
    if(data.action === "showmap"){
      this.setState({
        showPopup: !this.state.showPopup,
        popUpAction: "showmap",
        beacon_x: data.x,
        beacon_y: data.y
      });
    }else if(data.action === "createRecord") {
      this.setState({
        showPopup: !this.state.showPopup,
        popUpAction: "createRecord"
      });
    }else if(data.action === "deleteRecord"){
      this.setState({
        showPopup: !this.state.showPopup,
        popUpAction: "deleteRecord",
        uuid:data.uuid,
        major:data.major,
        minor:data.minor
      });
    }else if(data.action === "confirmDelete"){
      this.deleteRecord();
    }else if(data.action === "submitCreate"){
      this.createRecord();
    }else{
      this.setState({
        popUpAction: "close",
        showPopup: !this.state.showPopup,
        beacon_x: null,
        beacon_y: null,
        uuid: null,
        major: null,
        minor: null
      });
    }
  }

  createRecord(){
    var uuid = document.getElementById("formControlsUUID").value;
    var major = document.getElementById("formControlsMajor").value;
    var minor = document.getElementById("formControlsMinor").value;
    var mapid = document.getElementById("formControlsMapid").value;
    var x = document.getElementById("formControlsX").value;
    var y = document.getElementById("formControlsY").value;
    var subid = document.getElementById("formControlsSubscriptionId").value;
    var owner = document.getElementById("formControlsOwner").value;

    if(!uuid||!major||!minor||!mapid||!x||!y||!subid||!owner){
      alert("missing fields");
      this.setState({
        popUpAction: "close",
        showPopup: !this.state.showPopup,
        beacon_x: null,
        beacon_y: null,
        uuid: null,
        major: null,
        minor: null
      });
    }

    fetch('/CreateBeacon', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "uuid" : uuid,
        "major": major,
        "minor": minor,
        "mapid": mapid,
        "x": x,
        "y": y,
        "subid": subid,
        "owner": owner
      })
    }).then(response => {
      return response.json();
    })
      .then(json => {
        if(json.msg){
          this.setState({
            popUpAction: "close",
            deletedRecord: true,
            showPopup: !this.state.showPopup,
          });
        }else if(json.er){
          alert(JSON.stringify(json.er));
        }else{
          alert("record not created");
        }
      })
      .catch((error) => {
        alert("ERROR: " + error);
      });
  }

  deleteRecord(){
    var uuid = this.state.uuid;
    var major = this.state.major;
    var minor = this.state.minor;

    if(!uuid || !major || !minor){
      alert("Something went wrong!");
      this.setState({
        popUpAction: "close",
        showPopup: !this.state.showPopup,
        beacon_x: null,
        beacon_y: null,
        uuid: null,
        major: null,
        minor: null
      });
      return;
    }

    fetch('/DeleteBeacon', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "uuid" : uuid,
        "major": major,
        "minor": minor
      })
    }).then(response => {
      return response.json();
    })
      .then(json => {
        if(json.msg){
          this.setState({
            popUpAction: "close",
            deletedRecord: true,
            showPopup: !this.state.showPopup,
          });
        }else{
          alert("record not deleted");
        }
      })
      .catch((error) => {
        alert("ERROR: " + error);
      });
  }

  componentWillMount() {
    this.getUserInfo();
  }

  componentDidUpdate(){
    if(this.state.deletedRecord){
      this.getUserInfo();
    }
  }

  getUserInfo(){

    var email = this.props.name;
    var role =this.props.userrole;

    fetch('/GetUserInfo', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "usr" : email,
        "role": role
      })
    }).then(response => {
      return response.json();
    })
    .then(json => {
      this.setState({
        data: json,
        deletedRecord: false,
      });
      console.log("return msg: " + JSON.stringify(json));
    })
    .catch((error) => {
      alert("ERROR: " + error);
    });
  }

  GetList(data,role){

    const empty_warning = <p className="warning_msg">You don't have any subscriptions, please contact Admin to purchase.</p>


    if(data && !data.er && role==="user"){
      const listItems = Object.keys(data).map((num) =>
        <tr key={num}>
          <td>{num}</td>
          <td>{data[num].uuid}</td>
          <td>{data[num].major}</td>
          <td>{data[num].minor}</td>
          <td>{data[num].batterylevel}</td>
          <td>{data[num].mapid}</td>
          <td>
            <Button bsStyle="link" onClick={this.togglePopup.bind(this,{action:"showmap", x:data[num].x, y:data[num].y})}>Show on Map</Button>
          </td>
          <td>{data[num].subid}</td>
          <td>{data[num].exp_date}</td>
        </tr>);

      const wrappedListItems = (
        <tbody>
        {listItems}
        </tbody>
      );

      return (
        <div>
          <hr
            style={{
              color: "grey",
              backgroundColor: "grey",
              height: 1
            }}
          />
          <Table striped bordered condensed hover>
            <thead>
            <tr>
              <th>#</th>
              <th>BeaconId</th>
              <th>Major</th>
              <th>Minor</th>
              <th>Battery Life</th>
              <th>MapId</th>
              <th> </th>
              <th>Subscription Id</th>
              <th>Expire Date</th>
            </tr>
            </thead>
            {(listItems.length !==0 )?wrappedListItems: null}
          </Table>
            {(listItems.length !==0 )?null: empty_warning}
        </div>
      );
    }else if(data && !data.er && role==="admin"){
        const listItems = Object.keys(data).map((num) =>
          <tr key={num}>
            <td>{num}</td>
            <td>{data[num].uuid}</td>
            <td>{data[num].major}</td>
            <td>{data[num].minor}</td>
            <td>{data[num].batterylevel}</td>
            <td>{data[num].mapid}</td>
            <td>
              <Button bsStyle="link" onClick={this.togglePopup.bind(this,{action:"showmap", x:data[num].x, y:data[num].y})}>Show on Map</Button>
            </td>
            <td>{data[num].ownedby}</td>
            <td>{data[num].subid}</td>
            <td>{data[num].exp_date}</td>
            <td>
              <Button bsStyle="danger" bsSize="small" onClick={this.togglePopup.bind(this,{action:"deleteRecord", uuid:data[num].uuid, major:data[num].major, minor:data[num].minor})}>delete</Button>
            </td>
          </tr>);

        const wrappedListItems = (
          <tbody>
          {listItems}
          </tbody>
        );

        return (
          <div>
            <hr
              style={{
                color: "grey",
                backgroundColor: "grey",
                height: 1
              }}
            />
            <Button bsStyle="primary" bsSize="large" className="newButton" onClick={this.togglePopup.bind(this,{action:"createRecord"})}>Create New</Button>
            <p> </p>
            <Table striped bordered condensed hover>
              <thead>
              <tr>
                <th>#</th>
                <th>BeaconId</th>
                <th>Major</th>
                <th>Minor</th>
                <th>Battery Life</th>
                <th>MapId</th>
                <th> </th>
                <th>Owner</th>
                <th>Subscription Id</th>
                <th>Expire Date</th>
                <th>Delete</th>
              </tr>
              </thead>
              {(listItems.length !==0 )?wrappedListItems: null}
            </Table>
            {(listItems.length !==0 )?null: empty_warning}
          </div>
        );
    }else{
      return (
        <div>
          <hr
            style={{
              color: "grey",
              backgroundColor: "grey",
              height: 1
            }}
          />
          <Table striped bordered condensed hover>
            <thead>
            <tr>
              <th>#</th>
              <th>BeaconId</th>
              <th>Major</th>
              <th>Minor</th>
              <th>Battery Life</th>
              <th>MapId</th>
              <th> </th>
              <th>Subscription Id</th>
              <th>Expire Date</th>
            </tr>
            </thead>
          </Table>
          {empty_warning}
        </div>
      );
    }


  }

  render(){
    if(this.props.name){
      return(
        <Grid>
        <Jumbotron>
          <h3>Hello {this.props.name}  Role:{this.props.userrole}</h3>
          {this.GetList(this.state.data,this.props.userrole)}
        </Jumbotron>
          {(this.state.showPopup && this.state.popUpAction === "showmap")?
            <div className='popup'>
              <div className="popup_inner">
                <button onClick={this.togglePopup.bind(this)}>close me</button>
                <PDF style={{width:"10%"}}
                     file="LowerLevelNov2013.pdf"
                />
                <svg className="floatTL">
                  <rect x="1290" y="740" width="170" height="50" fill="white"/>
                  <rect x="1110" y="580" width="50" height="50" fill="white"/>
                  <circle cx={this.state.beacon_x} cy={this.state.beacon_y} r="10" fill="blue"/>
                  Sorry, your browser does not support inline SVG.
                </svg>
              </div>
            </div>
            : null
          }
          {(this.state.showPopup && this.state.popUpAction === "deleteRecord")?
            <div className='popup2'>
              <div className="popup_inner2">
                <h2>Are you sure you want to <strong>Delete</strong> this record?</h2>
                <div className="center_buttons">
                  <Button bsStyle="info" onClick={this.togglePopup.bind(this)}>Cancel</Button>
                  <Button className="confirm_button" bsStyle="danger" onClick={this.togglePopup.bind(this,{action:"confirmDelete"})}>Delete</Button>
                </div>
              </div>
            </div>
            : null
          }
          {(this.state.showPopup && this.state.popUpAction === "createRecord")?
            <div className='popup3'>
              <div className="popup_inner3">
                <FieldGroup className="fields" bsSize="small" id="formControlsUUID" label="uuid" type="text" />
                <FieldGroup className="fields" bsSize="small" id="formControlsMajor" label="major" type="text" />
                <FieldGroup className="fields" bsSize="small" id="formControlsMinor" label="minor" type="text" />
                <FieldGroup className="fields" bsSize="small" id="formControlsMapid" label="mapid" type="text" />
                <FieldGroup className="fields" bsSize="small" id="formControlsX" label="x" type="text" />
                <FieldGroup className="fields" bsSize="small" id="formControlsY" label="y" type="text" />
                <FieldGroup className="fields" bsSize="small" id="formControlsSubscriptionId" label="subscriptionId" type="text" />
                <FieldGroup className="fields" bsSize="small" id="formControlsOwner" label="Owner" type="text" />
                <br/>
                <div className="center_buttons">
                  <Button bsStyle="info" onClick={this.togglePopup.bind(this)}>Cancel</Button>
                  <Button className="confirm_button" bsStyle="success" onClick={this.togglePopup.bind(this,{action:"submitCreate"})}>Submit</Button>
                </div>
              </div>
            </div>
            : null
          }
      </Grid>);
    }else{
      return(
        <Grid>
        <Jumbotron>
          <h2>User not defined</h2>
        </Jumbotron>
      </Grid>);
    }


  }
}


