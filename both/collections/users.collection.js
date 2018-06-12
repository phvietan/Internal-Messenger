import { Mongo } from 'meteor/mongo';

Chat = new Mongo.Collection('Chat');

KickPassword = new Mongo.Collection('KickPassword');

FileS = new FS.Collection("file", {
  stores: [new FS.Store.FileSystem("file")],
  filter: {
    maxSize: 20971520,
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
  return true;
});

module.exports = {
  Chat,
  KickPassword,
  FileS
}
