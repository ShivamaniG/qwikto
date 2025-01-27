const admin = require("firebase-admin");
const axios = require("axios");

async function initializeFirebase() {
  try {
    const response = await axios.get('https://res.cloudinary.com/dot6dzqn6/raw/upload/v1737979489/t849kcw27dqapolnjmyu.json');
    
    const serviceAccount = response.data;

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://qwikto-97b8e.firebaseio.com", 
    });

    console.log("Firebase initialized successfully!");
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
}

initializeFirebase();

module.exports = admin;
