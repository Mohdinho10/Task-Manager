import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
let client;

export const initWhatsApp = () => {
  if (!client) {
    client = new Client({
      authStrategy: new LocalAuth({ clientId: "task-manager" }),
    });

    client.on("qr", (qr) => {
      qrcode.generate(qr, { small: true });
      console.log("Scan the QR code above with WhatsApp");
    });

    client.on("ready", () => console.log("WhatsApp client ready!"));

    client.on("auth_failure", (msg) =>
      console.error("WhatsApp auth failure:", msg)
    );

    client.initialize();
  }

  return client;
};

export const sendWhatsAppMessage = async (phone, message) => {
  if (!client) client = initWhatsApp();

  // Format phone number (country code + number, no +)
  const number = phone.replace(/\D/g, ""); // remove any non-digit
  const chatId = `${number}@c.us`;

  try {
    await client.sendMessage(chatId, message);
    console.log(`WhatsApp sent to ${phone}`);
  } catch (err) {
    console.error(`Failed to send WhatsApp to ${phone}:`, err.message);
  }
};
