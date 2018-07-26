import { Meteor } from 'meteor/meteor';

function randomString() {
  let n = Math.floor((Math.random() * 20) + 10);
  let result = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < n; i++)
    result += possible.charAt(Math.floor(Math.random() * possible.length));
  return result;
}

Meteor.startup(() => {
  Chat.remove({});
  FileS.remove({});
  Meteor.users.remove({});

  KickPassword.remove({});
  KickPassword.insert({
    content: randomString()
  });

  let nick = Meteor.users.find({username: 'admin'}).fetch();
  if (nick.length == 0)
    Accounts.createUser({
        username: 'admin',
        password: 'adminpassword' //lol
    });

  Meteor.setInterval(function() {
    KickPassword.remove({});
    KickPassword.insert({
      content: randomString()
    });
  }, 600000); //Every 10 minutes

});
