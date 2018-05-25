import { Meteor } from 'meteor/meteor';

Meteor.methods({
  'chat-upload': function (chat, username) {
    Chat.insert({
      content: chat,
      user: username
    });
  },
	'xoa-acc': function(username) {
		let userId = Meteor.users.find({username: username}).fetch()[0]._id;
		Meteor.users.remove({
			_id: userId
		});
	}
});
