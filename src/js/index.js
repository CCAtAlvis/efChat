const fs = require('fs');

const e = require('events');
var event = new e.EventEmitter();
const $ = require('jquery');

// Initialize Firebase
var config = require('./firebase.json');
firebase.initializeApp(config);
const database = firebase.database();

$('input[type=button]').on('click', (e) => {
  e.preventDefault();
  console.log("hiu");
  let number = $('#number').val();
  number = number.replace(/\s/g, '');

  var phoneNumber = number;
  var appVerifier = window.recaptchaVerifier;
  firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
    .then(function (confirmationResult) {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      window.confirmationResult = confirmationResult;
      console.log("success");
    }).catch(function (error) {
      // Error; SMS not sent
      // ...
      console.log("error")
    });

  if ('' !== number) {
    database.ref(`users/${number}`).once('value').then((snapshot) => {
      // fetch the password and store
      let fetchedPassword = snapshot.val();

      if ('object' === typeof fetchedPassword) {
        $('#message').removeClass('success').addClass('error')
          .text(`the account does not exist`);
      }
      else if ('string' === typeof fetchedPassword) {
        $('#message').removeClass('error').addClass('success')
          .text(`Logging you in`);

        // also send am message to the main process to login the user
        ipcRenderer.send('login-user', number);

        // trigger event to load new page
        event.emit('change-window');
      }
    });
  }
  else {
    // alert user to insert username and password
    $('#message').removeClass('success').addClass('error').text(`Please enter username and password`);
  }

});



// event.on('change-window', () => {
//   fs.readFile(__dirname + '/user-list.html', (error, page) => {
//     if (error) {
//       console.log(error);
//     }
//     
//   });
// });
