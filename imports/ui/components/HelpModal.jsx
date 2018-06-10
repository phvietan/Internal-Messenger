import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import '../css/HelpModal.css';

export default class UploadFileModal extends Component {
  render() {
    return (
      <div>
        <Modal show={this.props.showHelp} onHide={this.props.onHideHelp}>
          <Modal.Header closeButton>
            <Modal.Title>
              <p style={{fontSize: '25px'}}>Hello welcome to my 16APCS chat app</p>
              <p style={{fontSize: '25px'}}>I will now introduce some commands:</p>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{`/logout for quick logout`}</p>
            <p>{`/help to quickly open this help tab`}</p>
            <p>{`/upload to quickly open the upload tab`}</p>
            <p>{`/kick <password> <username> to kick someone (get the password by contacting admin)`}</p>
            <p>{`/rename <new username> to rename yourself (have not support yet)`}</p>
          </Modal.Body>

        </Modal>
      </div>
    );
  }
}
