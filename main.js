$(document).ready(function(){

  chatter.init();

// to delete bad data uncomment out this line and put in correct id from server
 // chatter.deleteMessage('54da9b8505ebf4030000007b');


});

var chatter = {

init: function () {
  chatter.initStyling();
  chatter.initEvents();
},

initStyling: function () {
  chatter.renderUser();
  chatter.renderMessage();

},

initEvents: function () {

$('.createUser').on('submit', function(event) {
  event.preventDefault();

  var newUser = {
    userName: $(this).find('input[name="logInName"]').val()
  };
  chatter.createUser(newUser);

});

$('.createMessage').on('submit', function(event) {
  event.preventDefault();
  var userInfoParse = JSON.parse(localStorage.getItem('userInfo'));

  var newMessage = {
    userId: userInfoParse._id,
    userName: userInfoParse.userName,
    userMessage: $(this).find('input[name="newMessage"]').val()
  };
  console.log('new message event done');

  chatter.createMessage(newMessage);

});

//delete message on click



},

config: {
  url:'http://tiy-fee-rest.herokuapp.com/collections/chatter'
},


//user:
renderUser: function () {
  $.ajax({
      url: chatter.config.url,
      type: 'GET',
      success: function (chatter) {
        var template= _.template(templates.userList);
        var markup = "";
        chatter.forEach(function (item, idx, arr) {
          markup += template(item);
        });
        console.log('markup is ...', markup);
        $('.userList').html(markup);
      },
      error: function (err) {
        console.log(err);
      }
    });

},

createUser: function (user) {
  $.ajax({
    url: chatter.config.url,
    data: user,
    type: 'POST',
    success: function (data) {
      console.log(data);
      chatter.renderUser();
      var strUserInfo = JSON.stringify(data);
      localStorage.setItem('userInfo', strUserInfo);
    },
    error: function (err) {
      console.log(err);
    }
  });

},


//edit user

//logout user


//message:


renderMessage: function() {
  //if userId from local Storage is not the same as userId associated with message, don't render message ?
  //otherwise:
  $.ajax({
    url: chatter.config.url,
    type: 'GET',
    success: function(chatter) {
      console.log(chatter);
      var template = _.template(templates.messageTmpl);   //check template - error message says userMessage not defined
      var markup="";
      chatter.forEach(function(item, index, array){
        markup += template(item);
      });
      console.log(markup);
      $('.chatArea').prepend().html(markup);
    },
    error: function(err) {
      console.log(err);

    }

  });


},

createMessage: function (userMessage) {
  $.ajax({
    url: chatter.config.url,
    // userName: "userId",  check: see Val's code
    data: userMessage,
    type: 'POST',
    success: function (data) {
      console.log(data);
      chatter.renderMessage();

    },
    error: function(err) {
      console.log(err);
    }

  });
  $('input').val(''); //empty message input field

},

// deleteMessage: function (_id, userId) {
//   console.log(userId, "currentUser" )  //check: userId from messageTmpl? where does currentUser in Val/Chris work come from?
//   console.log(localStorage.userName, "localStorage.userName"); //check!! Val/Chris
//   if (userId === localStorage.userName) {    //check
//   $.ajax({
//     url: chatter.config.url + '/' + _id,
//     type: 'DELETE',
//     success: function (data) {
//       console.log (data);
//       chatter.renderMessage();
//     },
//     error: function (err) {
//       console.log(err);
//     }
//   });
// }
//  else {
//     alert ("You are not able to delete other users' messages")
//   }
// }

};

//on click of logIn button, create user:
  //post user info from user input to server
  //set user info to local storage

//render user:
  //get user info from server
  //add markup to .userList (list of logged in users)

//on click of .createMessage submit button, create message:
  //post message info with related user info to server

//render message:
  //get message info from server
  //add markup to .chatArea (list of messages)

//delete message:
  //if currently logged-in user (as stored in localStorage) is same as user id of rendered message:
  //on click of delete button on rendered message, delete message from server and from rendered list in chatArea
