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
