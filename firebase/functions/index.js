// to create Cloud Functions and set up triggers
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

// Take the body payload passed to this HTTP endpoint and insert it into
// Firestore under the path /data/:documentId/payload
exports.addPayload = functions.https.onRequest(async (req, res) => {
  // Grab the request body
  const dataBody = req.body;

  // Push the new data into Firestore using the Firebase Admin SDK.
  const writeResult = await admin.firestore().collection("data").add(dataBody);

  // Send back a message that we've successfully written the message
  res.json({ result: `data with ID: ${writeResult.id} added.` });
});
