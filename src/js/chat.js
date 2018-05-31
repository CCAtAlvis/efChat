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

const $ = require('jquery');

ipcRenderer.send('get-user-details');

ipcRenderer.on('accept-user-details', (event, arg) => {
    if ('string' !== typeof arg) {
        // proper error handling
        alert("ERROR!");
        // close app
    }

    let friends;
    database.ref(`Friends/${arg}`).once('value').then((snapshot) => {
        friends = snapshot.val();

        for (let key in friends) {
            let str = `<div class="friend" data-efchat-friend-key="${key}">
                <div class="profil-pic-holder">
                    <div class="profil-pic"></div>
                    <div class="online-status"></div>
                </div>
                <div class="friend-name">${friends[key].name}</div>
            </div>`;
            $('#friends').append(str);
        }
    });

    database.ref(`Messages/${arg}`).once('value').then((snapshot) => {
        let chats = snapshot.val();

        for (let key in chats) {
            // database.ref(`Users/${key}`).once('value').then((snapshot) => {
            //     // TODO: blablabla... see the app
            //     let friend = snapshot.val();
            // });

            let str = `<div class="chat" data-efchat-chat-key="${key}">
                <div class="profil-pic-holder">
                    <div class="profil-pic"></div>
                    <div class="online-status"></div>
                </div>
                <div class="friend-name">${friends[key].name}</div>
                <div class="unread-message-status"></div>
            </div>`;
            $('#chats').append(str);
        }
    });
});
