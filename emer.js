const readline = require("readline");
const fetch = require("node-fetch");
const twilio = require("twilio");

// ========== CONFIG ==========
const accountSid = "AC67c2ed44876eb2f48a9acc844644f784";  // Your Twilio SID
const authToken = "9e718cd4af751c63a29ff583af1a030b";     // Your Twilio Auth Token
const client = twilio(accountSid, authToken);

const ALERT_PHONE = "whatsapp:+919123705935";  // Receiver WhatsApp number
const TWILIO_PHONE = "whatsapp:+16188457220";  // Your Twilio Sandbox WhatsApp
const IPINFO_TOKEN = "798195e3c4473d";         // From ipinfo.io

// Function to fetch location
async function getLocation() {
  try {
    let res = await fetch(`https://ipinfo.io/json?token=${IPINFO_TOKEN}`);
    let data = await res.json();
    let [lat, long] = data.loc.split(",");
    return { lat, long, city: data.city, region: data.region, country: data.country };
  } catch (err) {
    console.error("Location fetch failed:", err);
    return { lat: "0", long: "0", city: "Unknown", region: "", country: "" };
  }
}

// Function to send WhatsApp alert
async function sendAlert(location) {
  let message = `🚨 Emergency Alert 🚨\n\nMy location: https://maps.google.com/?q=${location.lat},${location.long}\nCity: ${location.city}, ${location.region}, ${location.country}`;

  try {
    let msg = await client.messages.create({
      from: TWILIO_PHONE,
      to: ALERT_PHONE,
      body: message
    });
    console.log("✅ WhatsApp Alert sent! SID:", msg.sid);
  } catch (err) {
    console.error("❌ Failed to send WhatsApp alert:", err);
  }
}

// ========== KEY LISTENER ==========
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

console.log("⚡ Press ENTER anytime to send WhatsApp Emergency Alert! (Ctrl+C to quit)");

process.stdin.on("keypress", async (str, key) => {
  if (key.name === "return") {  // "return" = Enter key
    console.log("🚨 Emergency Triggered! Fetching location...");
    let loc = await getLocation();
    sendAlert(loc);
  }
  if (key.ctrl && key.name === "c") process.exit();
});

