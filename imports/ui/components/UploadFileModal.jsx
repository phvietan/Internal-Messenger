import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Modal, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import '../css/UploadFileModal.css';

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
      songName: ''
    }
  }

  submit() {
    let file = document.getElementById('formControlsFile').files[0];
    if (!file) return;

    let user = this.props.user;
    FileS.insert(file, function(err, fileObj) {
      let id = fileObj._id;
      //This code is pasted online
      //It will catch the event when the file is fully uploaded onto server
      var cursor = FileS.find(id);
      var liveQuery = cursor.observe({
        changed: function(newFile) {
          if (newFile.isUploaded()) {
            liveQuery.stop();
            //After file fully uploaded on server, update the documents of mongodb

          }
        }
      });
    });
    this.props.onHideUpload();
  }

  render() {
    return (
      <div>
        <Modal show={this.props.showUpload} onHide={this.props.onHideUpload}>
          <Modal.Header closeButton>
            <Modal.Title>Upload File</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FieldGroup
              id="formControlsFile"
              type="file"
              label="File"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.submit.bind(this)}>OK</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
