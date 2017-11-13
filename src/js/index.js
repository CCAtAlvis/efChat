// including jquery
const $ = require("jquery");

// declearing firebase modules
const admin = require("firebase-admin");
const functions = require("firebase-functions");

// getting the credential of firebase project
const firebaseCredentials = require("./firebase.json");

// initializing firebase app.
// replace databaseURL with URL of you database
admin.initializeApp({
    credential: admin.credential.cert(firebaseCredentials),
    databaseURL: "https://efchat-cb07c.firebaseio.com/"
});

$("input[type=button]").on( "click", ( e ) => {
    // prevent the default action of the event
    e.preventDefault();

    // get the username and password from their respetive field
    let username = $( "#username" ).val();
    let password = $( "#password" ).val();

    // remove all the whitespaces
    username = username.replace( /\s/g, "" );
    password = password.replace( /\s/g, "" );

    // console.log( e.target );

    let type = $(e.target).attr("name");
    // console.log( type );
    // console.log( username + " : " + password );

    // if both the username and password are not empyt
    // lets check if the user wants to login or signup
    if ( "" !== username && "" !== password )
    {
        // if the user wants to login
        // get the user password from the firebase and compare it with the user entered password 
        if ( "login" === type )
        {

        }
        // if the user wants to signup
        else if ( "signup" === type )
        {
            // console.log( "starting signup process" );

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
            let confirmPassword = $( "#confirm-password" ).val();

            // console.log( confirmPassword );

            // if the 
            if ( undefined !== confirmPassword )
            {
                // get the confirmPassword
                confirmPassword = confirmPassword.replace( /\s/g, "" );

                // check whether password and confirmPassword match
                if ( confirmPassword === password )
                {
                    // now that the passwords match
                    // get a snapshot of firebase with username

                    admin.database().ref( `users/${username}` ).once( "value" ).then( ( snapshot ) => {
                        // fetch the password and store
                        let fetchedPassword = snapshot.val();
                        // console.log( fetchedPassword + "     " + typeof fetchedPassword );
                        // password     string
                        // null     object

                        // snapshot.va() will return a
                        // string: if the user exis
                        // object (null): if it doesn't

                        if ( "object" === typeof fetchedPassword )
                        {
                            // user does not exist
                            // lets create a new one.

                            admin.database().ref( `users/${username}` ).set( password );

                            // now alert user that their account has been created
                        }
                        else if ( "string" === typeof fetchedPassword )
                        {
                            // a user already exists
                            // alert the user to change username
                        }
                    });
                }
                else
                {
                    // alert the user the passwords are not the same
                }
            }
            else
            {
                $("#password-fileds").append( "<input type=password id=confirm-password placeholder=\"Confirm Password *\">" );
            }
        }
    }

});
