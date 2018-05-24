const fs = require('fs');

const e = require('events');
var event = new e.EventEmitter();
const $ = require('jquery');

// Initialize Firebase
var config = require('./firebase.json');
firebase.initializeApp(config);

// event.on('change-window', () => {
//   fs.readFile(__dirname + '/user-list.html', (error, page) => {
//     if (error) {
//       console.log(error);
//     }
//     else {
//       $('html').html('');
//       $('html').html(page.toString());
//     }
//   });
// });

$('input[type=button]').on('click', (e) => {
  e.preventDefault();

  let username = $('#number').val();
  username = username.replace(/\s/g, '');

  let type = $(e.target).attr('name');

  if ('' !== username) {
    if ('login' === type) {
      firebase.database().ref(`users/${username}`).once('value').then((snapshot) => {
        // fetch the password and store
        let fetchedPassword = snapshot.val();
        // console.log( fetchedPassword + '     ' + typeof fetchedPassword );
        // password     string
        // null     object

        if ('object' === typeof fetchedPassword) {
          // alert user that the account does not exist
          $('#message').text(`the account does not exist`);
        }
        else if ('string' === typeof fetchedPassword) {
          // compare the passwords

          if (bcrypt.compareSync(password, fetchedPassword)) {
            // Yes! the passwords match, log the user in
            // console.log( 'logged in!!!' );
            $('#message').removeClass('error').addClass('success')
              .text(`Logging you in`);

            // also send am message to the main process to login the user
            ipcRenderer.send('login-user', username);

            // trigger event to load new page
            event.emit('change-window');
          }
          else {
            // the passwords doesn't match
            // alert the user
          }
        }
      });
    }
  }
  else {
    // alert user to insert username and password
    $('#message').removeClass('success').addClass('error').text(`Please enter username and password`);
  }

});
