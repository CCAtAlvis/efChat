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

let userToken;
let userDetails;
let currentFriendToken;

// store token of all the friends
let friends;
ipcRenderer.on('accept-user-details', (event, arg) => {
    if ('string' !== typeof arg) {
        // proper error handling
        alert("ERROR!");
        // close app
    }

    userToken = arg;
    database.ref(`Friends/${arg}`).once('value').then((snapshot) => {
        friends = snapshot.val();

        for (let key in friends) {
            let str = `<div class="contact-card friend-card" onclick="cardClicked(this, event);" data-efchat-token="${key}">
                <div class="profile-pic-holder">
                    <div class="profile-pic">
                        <img class="dp-image" src="" alt="DP" title="${friends[key].name}'s profile pic!">
                    </div>
                    <div class="online-status"></div>
                </div>
                <div class="friend-name">${friends[key].name}</div>
            </div>`;
            $('#friends').append(str);
        }

        setChats();
        setUserDetails();
    });
});

const setUserDetails = () => {
    database.ref(`Users/${userToken}`).once('value').then((snapshot) => {
        userDetails = snapshot.val();
    });
}

const setChats = () => {
    database.ref(`Chats/${userToken}`).once('value').then((snapshot) => {
        let chats = snapshot.val();

        for (let key in chats) {
            // database.ref(`Users/${key}`).once('value').then((snapshot) => {
            //     // TODO: blablabla... see the app
            //     let friend = snapshot.val();
            // });

            let str = `<div class="contact-card chat-card" onclick="cardClicked(this, event);" data-efchat-token="${key}">
                <div class="profile-pic-holder">
                    <div class="profile-pic">
                        <img class="dp-image" src="" alt="DP" title="${friends[key].name}'s profile pic!">
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

    init();
}

const init = () => {

}

const cardClicked = (obj, e) => {
    e.preventDefault();
    
    let friendToken =  obj.getAttribute('data-efchat-token');
    if (currentFriendToken === friendToken)
        return;

    $('#message-display-window').html('');
    currentFriendToken = friendToken;

    let friendDpURL;
    database.ref(`Users/${friendToken}`).once('value').then((snapshot) => {
        friendDpURL = snapshot.val().profile_pic;
    });

    database.ref(`Messages/${userToken}/${friendToken}`).once('value').then((snapshot) => {
        let messages = snapshot.val();
        for (let key in messages) {
            let str;

            if (messages[key].from === userToken) {
                str = `<div class="message user-message" data-efchat-token="${userToken}">
                    <div class="message-display-pic user-message-dp">
                        <img class="message-dp-image" src="${userDetails.profile_pic}">
                    </div>

                    <div class="message-body user-message-body">
                        ${messages[key].message}
                    </div>
                </div>`;
            }
            else {
                str = `<div class="message friend-message" data-efchat-token="${messages[key].from}">
                    <div class="message-display-pic friend-message-dp">
                        <img class="message-dp-image" src="${friendDpURL}">
                    </div>  

                    <div class="message-body friend-message-body">
                        ${messages[key].message}
                    </div>  
                </div>`;

            }

            $('#message-display-window').append(str);
        }
    });
} 
