const fs = require('fs');
const {ipcRenderer} = require('electron');

const admin = require('firebase-admin');
// Initialize Firebase
let config = require('./firebase.json');
admin.initializeApp({
    credential: admin.credential.cert(config),
    databaseURL: 'https://mychat-9a2b7.firebaseio.com/'
});
const database = admin.database();

document.getElementById('login').addEventListener('click', () => {
    let message = document.getElementById("message");

    let number = document.getElementById("number").value;
    let pin = document.getElementById("pin").value;
    // TODO: make a proper internation number checker 
    number = number.replace(/\s/g, '');

    if ('' !== number && '' !== pin) {
        database.ref(`reverseMap/${number}`).once('value').then((snapshot) => {
            // TODO: move login process to cloud functions
            let value = snapshot.val();

            if ('object' === typeof value && value.pin == pin) {
                message.classList.remove('error');
                message.classList.add('success');
                message.innerText = 'Logging you in';

                // send a user details main process
                ipcRenderer.send('login-user', value);

                // trigger event to load new page
                fs.readFile(__dirname + '/test.html', (error, page) => {
                    if (error) {
                        throw error;
                    }

                    //document.getElementsByTagName("html")[0].innerHTML = page;
                });
            }
            else {
                message.classList.remove('success');
                message.classList.add('error');
                message.innerText = 'the account authentication is in correct';
            }
        });
    }
    else {
        // alert user to insert username and password
        message.classList.remove('success');
        message.classList.add('error');
        message.innerText = 'Please enter number and pin';
    }

});
