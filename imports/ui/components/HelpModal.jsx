import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Modal, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import '../css/HelpModal.css';
import { FaQuestionCircle } from 'react-icons/lib/fa';

function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
    </FormGroup>
  );
}

export default class UploadFileModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div>
        <Modal show={this.props.showHelp} onHide={this.props.onHideHelp}>
          <Modal.Header closeButton>
            <Modal.Title>
              <h4>{`Hello welcome to my 16APCS chat app`}</h4>
              <h4>{`I will now introduce some commands:`}</h4>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{`/logout for quick logout`}</p>
            <p>{`/kick <password> <username> to kick someone (get the password by contacting admin)`}</p>
            <p>{`/upload to quickly open the upload tab (have not support yet)`}</p>
            <p>{`/rename <new username> to rename yourself (have not support yet)`}</p>
          </Modal.Body>

        </Modal>
      </div>
    );
  }
}
