// require ipcRenderer to communicate between main and renderer process
const { ipcRenderer } = require('electron');
// require remote to perform IPC easly and handle main process stuff in renderer process
const remote = require('electron').remote;
const {BrowserWindow} = remote;
const fs = require('fs');

// require events!!
const e = require('events');
var event = new e.EventEmitter();

// including jquery
const $ = require('jquery');
// including bcrypt for hashing passwords
const bcrypt = require('bcrypt');

// declearing firebase modules
const admin = require('firebase-admin');
const functions = require('firebase-functions');

// getting the credential of firebase project
const firebaseCredentials = require('./firebase.json');

// initializing firebase app.
// replace databaseURL with URL of you database
admin.initializeApp({
  credential: admin.credential.cert(firebaseCredentials),
  databaseURL: 'https://efchat-cb07c.firebaseio.com/'
});

event.on('change-window', () => {
  // let win = new BrowserWindow({width: 800, height: 600})
  fs.readFile(__dirname + '/user-list.html', (error, page) => {
    if (error) {
      // do something to handle error
      console.log(error);
    }
    else
    {
      // if no error, we are good to go!
      // first set the html of current page to null 
      $('html').html('');
      // then set the html to the page we just read
      $('html').html(page.toString());
      // console.log(page);
    }
  });
});


$('input[type=button]').on('click', (e) => {
  // prevent the default action of the event
  e.preventDefault();

  // get the username and password from their respetive field
  let username = $('#username').val();
  let password = $('#password').val();

  // remove all the whitespaces
  username = username.replace(/\s/g, '');
  password = password.replace(/\s/g, '');

  // console.log( e.target );

  let type = $(e.target).attr('name');
  // console.log( type );
  // console.log( username + ' : ' + password );

  // if both the username and password are not empyt
  // lets check if the user wants to login or signup
  if ('' !== username && '' !== password)
  {
    // if the user wants to login
    // get the user password from the firebase and compare it with the user entered password
    if ('login' === type)
    {
      // console.log( 'starting login process' );

      // 1: fetch the password from firebase
      // 2: compare it with user entered password
      // if matches
      // login user
      // if not
      // alert user about wrong password
      // if returned null object
      // alert user that the account does not exist

      admin.database().ref(`users/${username}`).once('value').then((snapshot) => {
        // fetch the password and store
        let fetchedPassword = snapshot.val();
        // console.log( fetchedPassword + '     ' + typeof fetchedPassword );
        // password     string
        // null     object

        if ('object' === typeof fetchedPassword)
        {
          // alert user that the account does not exist
          $('#message').text(`the account does not exist`);
        }
        else if ('string' === typeof fetchedPassword)
        {
          // compare the passwords

          if ( bcrypt.compareSync(password, fetchedPassword) )
          {
            // Yes! the passwords match, log the user in
            // console.log( 'logged in!!!' );
            $('#message').removeClass('error').addClass('success')
              .text(`Logging you in`);

            // also send am message to the main process to login the user
            ipcRenderer.send('login-user', username);

            // trigger event to load new page
            event.emit('change-window');
          }
          else
          {
            // the passwords doesn't match
            // alert the user
          }
        }
      });
    }
    // if the user wants to signup
    else if ('signup' === type)
    {
      // console.log( 'starting signup process' );

      // 1: add another password field for confirm password
      // 2: get that password
      // 3: check if both the passwords are same
      // if so
      // check if the username exist or not
      // if exist
      // alert user to change username
      // if not
      // insert the user details into firebase
      // login the user
      // if not
      // alert the user

      // heres what we want to do
      // if the user clicks on signup for first time show the confirm password box
      // when they click again we will check both the passwords and follow the above steps
      //
      // and heres who we do that
      // so first lets get the value of the #confirm-password
      // if #confirm-password does not exist then it will return unddefined
      // which means we have to create the #confirm-password input box
      // if it returnes a value, whether it be empyt that means, input box is creadted
      // and we need to check that value with password field

      // get the confirm password
      let confirmPassword = $('#confirm-password').val();

      // console.log( confirmPassword );

      // if the
      if (undefined !== confirmPassword)
      {
        // get the confirmPassword
        confirmPassword = confirmPassword.replace(/\s/g, '');

        // check whether password and confirmPassword match
        if (confirmPassword === password)
        {
          // now that the passwords match
          // get a snapshot of firebase with username

          admin.database().ref(`users/${username}`).once('value').then((snapshot) => {
            // fetch the password and store
            let fetchedPassword = snapshot.val();
            // console.log( fetchedPassword + '     ' + typeof fetchedPassword );
            // password     string
            // null     object

            // snapshot.va() will return a
            // string: if the user exis
            // object (null): if it doesn't

            if ('object' === typeof fetchedPassword)
            {
              // user does not exist
              // lets create a new one.
              
              const saltRounds = 10;
              let passwordHash = bcrypt.hashSync(password, saltRounds);
              
              admin.database().ref(`users/${username}`).set(passwordHash);
              
              // now alert user that their account has been created
              $('#message').removeClass('error').addClass('success')
                .text(`Account Created!`);

              // also send am message to the main process to login the user
              ipcRenderer.send('login-user', username);
            }
            else if ('string' === typeof fetchedPassword)
            {
              // a user already exists
              // alert the user to change username
            }
          });
        }
        else
        {
          // alert the user the passwords are not the same
          $('#message').removeClass('success').addClass('error')
            .text(`The passwords you entered does not match`);
        }
      }
      else
      {
        $('#password-fileds').append(`<input type=password id=confirm-password
         placeholder='Confirm Password *'>`);
      }
    }
  }
  else
  {
    // alert user to insert username and password
    $('#message').removeClass('success').addClass('error').text(`Please enter username and password`);
  }

});
