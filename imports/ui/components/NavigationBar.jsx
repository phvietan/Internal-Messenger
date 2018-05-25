import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import {
  Navbar,
  Nav,
  NavDropdown,
  MenuItem,
} from 'react-bootstrap';
import '../css/NavigationBar.css';
import { Link } from 'react-router-dom';
import HelpModal from './HelpModal';
import UploadFileModal from './UploadFileModal';

export default class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showUpload: false,
      showHelp: false
    }
  }

  hideUpload() {this.setState({ showUpload: false });}
  showUpload() {this.setState({ showUpload: true });}
  hideHelp() {this.setState({ showHelp: false });}
  showHelp() {this.setState({ showHelp: true });}

  render() {
    return (
      <div>
        <HelpModal showHelp={this.state.showHelp} onHideHelp={this.hideHelp.bind(this)}/>
        <UploadFileModal showUpload={this.state.showUpload} onHideUpload={this.hideUpload.bind(this)} user={this.props.user}/>
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
              <MenuItem eventKey={3.1} onClick={this.showHelp.bind(this)}>Help</MenuItem>
              <MenuItem eventKey={3.2} onClick={this.showUpload.bind(this)}>Add file</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={3.3} onClick={this.props.logout}>Log out</MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar>

      </div>
    );
  }
}
