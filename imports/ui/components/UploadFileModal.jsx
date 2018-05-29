import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Modal, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import '../css/UploadFileModal.css';

function getBase64(file, callback) {
  let result = '';
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    callback(reader.result)
  };
}

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
    if (file.type.slice(0,5)=='image') {
      let base = getBase64(file, (result) => {
        Meteor.call('image-upload', user.username, result);
      });
      this.props.onHideUpload();
      return;
    }
    let name = file.name;
    FileS.insert(file, function(err, fileObj) {
      let id = fileObj._id;
      Meteor.call('file-upload', user.username, id, name);
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
