import { Meteor } from 'meteor/meteor';

Meteor.methods({
  'chat-upload': function (chat) {
    let username = Meteor.user().username;
    Chat.insert({
      content: chat,
      user: username,
      type: 'chat'
    });
  },
  'system-call': function (message) {
    let username = Meteor.user().username;
    message = username + ' ' + message;
    console.log(message);
    Chat.insert({
      content: message,
      user: 'SYSTEM',
      type: 'chat'
    });
  },
  'file-upload': function (username, id, fileName, type, width, height) {
    username = Meteor.user().username;
    if (type=='file')
      Chat.insert({
        content: fileName,
        fileId: id,
        user: username,
        type: type
      });
    else
    Chat.insert({
      content: fileName,
      fileId: id,
      user: username,
      type: type,
      width: width,
      height: height
    });
  },
  'kick-user': function(password, userKick, userGotKicked) {
    let P = KickPassword.find({}).fetch()[0].content;
    if (userKick == userGotKicked)
      return "You can't kick yourself, đùa bố mày à?";
    if (userGotKicked == 'admin') {
      Chat.insert({
        content: `${userKick} tried to kick admin, but admin is too powerful so ${userKick} got kicked back!!!`,
        user: 'SYSTEM',
        type: 'chat'
      });
      Meteor.users.remove(Meteor.users.find({username: userKick}).fetch()[0]);
      return "You just got kicked because you tried to kick admin";
    }
    if (password != P)
      return "Password incorrect";
    let user = Meteor.users.find({username: userGotKicked}).fetch();
    if (user.length == 0) return "The user is not existed";
    user = user[0];
    Meteor.users.remove(user);
    Chat.insert({
      content: `${userKick} has the super key and has kicked ${userGotKicked}, BEWARE!!!`,
      user: 'SYSTEM',
      type: 'chat'
    });
    return 'Done';
  }
});
