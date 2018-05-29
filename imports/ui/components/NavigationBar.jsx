import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import {
  Navbar,
  Nav,
  NavDropdown,
  MenuItem,
} from 'react-bootstrap';
import '../css/NavigationBar.css';

export default class NavigationBar extends Component {
  render() {
    return (
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <img src="/APCS.png" className="logo"></img>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav className="pull-right" style={{marginRight:'100px'}}>
            <NavDropdown
              eventKey={1}
              id="navdropdown"
              title=""
            >
              <MenuItem eventKey={3.1} onClick={this.props.showHelp}>Help</MenuItem>
              <MenuItem eventKey={3.2} onClick={this.props.showUpload}>Upload</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={3.3} onClick={this.props.logout}>Log out</MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar>

      </div>
    );
  }
}
