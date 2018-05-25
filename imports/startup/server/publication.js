import { Meteor } from 'meteor/meteor';

Meteor.publish('ChatDB', function usersPublication(){
	return Chat.find({});
});
