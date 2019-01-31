import React, { Component } from 'react';
import { Carousel, Grid} from 'react-bootstrap';
import './Home.css';
import logo from './HelloWorld.jpg';
import mall from './mall.jpg';
import appScreenshot from './app.png';
export default class Home extends Component{
  render(){
    return(
      <Grid>
        <Carousel className="cs_css">
          <Carousel.Item className="cs_css">
            <img className="img_css" width={900} height={500} alt="900x500" src={mall} />
            <Carousel.Caption>
              <h3 className="carousel_text2">WHERE</h3>
              <p className="carousel_text2">Know where you are in a complex shopping mall.</p>
              {/* referece: https://erlibird.com/go/movin-software*/}
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item className="cs_css">
            <img className="img_css" width={700} height={500} alt="900x500" src={logo} />
            <Carousel.Caption>
              <h3 className="carousel_text">WHERE</h3>
              <p className="carousel_text">An application that shows you where you are in an indoor environment using ibeacon technology with BLE devices.</p>
              {/*reference: https://www.retail-insider.com/retail-insider/2015/5/most-productive*/}
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="img_css" width={700} height={500} alt="900x500" src={appScreenshot} />
          </Carousel.Item>
        </Carousel>
      </Grid>
    );
  }
}


