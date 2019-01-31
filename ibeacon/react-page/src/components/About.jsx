import React, { Component } from 'react';
import { Jumbotron, Grid} from 'react-bootstrap';

export default class About extends Component{
  render(){
    return(
      <Grid>
        <Jumbotron>
          <h2>Contact Us</h2>
          <hr
            style={{
              color: "grey",
              backgroundColor: "grey",
              height: 1
            }}
          />
          <strong>Willy Su Yep</strong><br/>
          wsuyep@uvic.ca<br/>
          778-898-0308<br/>
          <br/>
          <br/>
          <strong>William Meng</strong><br/>
          willmeng@uvic.ca<br/>
          123-456-7890<br/>
        </Jumbotron>
      </Grid>
    );
  }
}


