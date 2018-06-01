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

// store token of all the friends
let friends;
ipcRenderer.on('accept-user-details', (event, arg) => {
    if ('string' !== typeof arg) {
        // proper error handling
        alert("ERROR!");
        // close app
    }

    database.ref(`Friends/${arg}`).once('value').then((snapshot) => {
        friends = snapshot.val();

        for (let key in friends) {
            let str = `<div class="contact-card friend-card" data-efchat-token="${key}">
                <div class="profile-pic-holder">
                    <div class="profile-pic">
                        <img class="dp-image" src="hello.png" alt="DP" title="${friends[key].name}'s profile pic!">
                    </div>
                    <div class="online-status"></div>
                </div>
                <div class="friend-name">${friends[key].name}</div>
            </div>`;
            $('#friends').append(str);
        }

        setChats(arg);
    });
});

const setChats = (token) => {
    database.ref(`Chats/${token}`).once('value').then((snapshot) => {
        let chats = snapshot.val();

        for (let key in chats) {
            // database.ref(`Users/${key}`).once('value').then((snapshot) => {
            //     // TODO: blablabla... see the app
            //     let friend = snapshot.val();
            // });

            let str = `<div class="contact-card chat-card" data-efchat-token="${key}">
                <div class="profile-pic-holder">
                    <div class="profile-pic">
                        <img class="dp-image" src="hello.png" alt="DP" title="${friends[key].name}'s profile pic!">
                    </div>
                    <div class="online-status"></div>
                </div>
                <div class="friend-name">${friends[key].name}</div>
                <div class="sidebar-message">${chats[key].lastMessage}</div>
                <div class="unread-message-status"></div>
            </div>`;
            $('#chats').append(str);
        }

        setFriendProfile();
    });
}

const setFriendProfile = () => {
    for (let key in friends) {
        database.ref(`Users/${key}`).once('value').then((snapshot) => {
            let dpURL = snapshot.val().profile_pic;

            let sel = $(`[data-efchat-token=${key}]`);
            for (let i=0; i<sel.length; i++)
                sel[i].querySelector(".dp-image").setAttribute('src', dpURL);
        });
    }
}
