$(document).ready(function(){

  chatter.init();

// to delete bad data uncomment out this line and put in correct id from server
// chatter.deleteMessage('54dbb6a21d5f6803000000c8');


});

var chatter = {

init: function () {
  chatter.initStyling();
  chatter.initEvents();
  //
  // setInterval(chatter.renderMessage, 1000);
},

initStyling: function () {
  chatter.renderUser();
  chatter.renderMessage();

},

initEvents: function () {

//create user on login:

$('.createUser').on('submit', function(event) {
  event.preventDefault();

  var newUser = {
    userName: $(this).find('input[name="logInName"]').val()
  };
  chatter.createUser(newUser);

});

//delete user on logout:

$('.userList').on('click', '.logout', function(event) {
  event.preventDefault();
  var userId = $(this).closest('li').data('userid');
  chatter.deleteUser(userId);

});


//create message on submit:

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
$('.chatArea').on('click', '.deleteMsg', function(event) {
  event.preventDefault();

  // if user id on msg === user id in local storage, do it
  //  otherwise: send alert
  
  var msgId = $(this).closest('article').data('chatid');
  var msgUserID = $(this).closest('article').data('userid');
  var userInfoParse = JSON.parse(localStorage.getItem('userInfo'));
  var localStorageUserID = userInfoParse._id;
  console.log(msgId);
  console.log(msgUserID);
  console.log(localStorageUserID);
  if (msgUserID === localStorageUserID) {
  chatter.deleteMessage(msgId);
  } else {
  alert("You cannot delete other users' messages.")
  }

});



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

deleteUser: function (userId) {
  $.ajax({
    url: chatter.config.url,
    type: 'DELETE',
    success: function (data) {
      localStorage.removeItem('userInfo');
      $('#userLogIn').val("");
      console.log('logout worked');
      chatter.renderUser();

    },
    error: function (err) {
      console.log(err);
    }

  });

},


//message:


renderMessage: function() {
  //if userId from local Storage is not the same as userId associated with message, don't render message ?
  //otherwise:
  $.ajax({
    url: chatter.config.url,
    type: 'GET',
    success: function(chatter) {
      console.log(chatter);
      var template = _.template(templates.messageTmpl);   //check template - error message says userId not defined
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

deleteMessage: function (_id) {

   $.ajax({
     url: chatter.config.url + '/' + _id,
     type: 'DELETE',
     success: function (data) {
       console.log (data);
       chatter.renderMessage();
     },
    error: function (err) {
      console.log(err);
    }
  });
}


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
