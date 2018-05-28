import { Mongo } from 'meteor/mongo';

Chat = new Mongo.Collection('Chat');

FileS = new FS.Collection("file", {
  stores: [new FS.Store.FileSystem("file")],
  filter: {
    maxSize: 20480,
    onInvalid: function (message) {
      if (Meteor.isClient) {
        alert(message);
      } else {
        console.log(message);
      }
    }
  }
});

FileS.allow({
  'insert': function () {
    // add custom authentication code here
    return true;
  },
  'update': function () {
    // add custom authentication code here
    return true;
  },
  'download': function () {
    return true;
  },
  'remove': function() {
    return true;
  }
});

FileS.on('uploaded', function (fileObj) {
});

module.exports = {
  Chat,
  FileS
}
