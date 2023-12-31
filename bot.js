const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client();

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

let usersSession = {};

client.on('message', async msg => {
    const chatId = msg.from;
    // Initialize user session if not exists
    if (!usersSession[chatId]) {
        usersSession[chatId] = { stage: 0 };
        msg.reply('שלום 👋🏻, ברוך הבא לקריפטו גולד... מה שמך בבקשה?');
        return;
    }

    // Handle conversation based on stage
    switch (usersSession[chatId].stage) {
        case 0: // Name stage
            usersSession[chatId].userName = msg.body;
            usersSession[chatId].stage = 1;
            msg.reply(`שלום ${msg.body}, תרצה שאפנה אליך\n1. כזכר 🤵🏼‍♂️\n2. כנקבה 🤵🏼‍♀️\nהשב 1️⃣ או זכר\nהשבי 2️⃣ או נקבה`);
            break;
        case 1: // Gender stage
            usersSession[chatId].gender = msg.body === '1' || msg.body.includes('זכר') ? 'זכר' : 'נקבה';
            usersSession[chatId].stage = 2;
            msg.reply('כמה זמן הנך סוחר ? 🚀\n1. מתחת לחצי שנה\n2. מעל לשנה\nהשב 1️⃣ או 2️⃣');
            break;
        case 2: // Trading Time stage
            usersSession[chatId].tradingTime = msg.body === '1' ? 'מתחת לחצי שנה' : 'מעל לשנה';
            usersSession[chatId].stage = 3;
            msg.reply('באיזו בורסה הנך סוחר ?\n1. MEXC\n2. Binance\nהשב 1️⃣ או 2️⃣');
            break;
        case 3: // Exchange stage
            usersSession[chatId].exchange = msg.body === '1' ? 'MEXC' : 'Binance';
            usersSession[chatId].stage = 4;
            msg.reply('איך אתה רוצה לסחור ?\n1. כתחביב\n2. כהכנסה ראשית\nהשב 1️⃣ או 2️⃣');
            break;
        case 4: // Trading Intent stage
            usersSession[chatId].tradingIntent = msg.body === '1' ? 'כתחביב' : 'כהכנסה ראשית';
            // Compile and send the summary message
            const summary = `
שם: ${usersSession[chatId].userName}
מגדר: ${usersSession[chatId].gender}
זמן מסחר: ${usersSession[chatId].tradingTime}
בורסה: ${usersSession[chatId].exchange}
כוונת מסחר: ${usersSession[chatId].tradingIntent}
            `;
            msg.reply(summary);
            // Here, implement the code to send data to the given phone number or another storage
            // Reset the stage for future conversations
            usersSession[chatId].stage = 0;
            break;
    }
});

client.initialize();
