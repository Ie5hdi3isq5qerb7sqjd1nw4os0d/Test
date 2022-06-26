const P = require('pino');
const { DisconnectReason, useSingleFileAuthState, delay } = require('@adiwajshing/baileys');
const makeWASocket = require('@adiwajshing/baileys').default;
const chalk = require("chalk");
const fs = require('fs');

console.log(`
${chalk.red.bold('<>=======')}${chalk.blue.bold('Alpha-X-Bot')}${chalk.red.bold('====')}${chalk.blue.bold('Multi-Device-QR-Code')}${chalk.red.bold('=======<>')}
${chalk.white.bold('[[ New and speed version of Alpha-X-Bot-MD QR Code ]]')} 
`);


fs.unlink('./auth.json', (err => { }));

const startMultiDeviceQrGen = () => {

    const { state, saveState } = useSingleFileAuthState('./auth.json');


    const sock = makeWASocket({
        logger: P({ level: 'fatal' }),
        printQRInTerminal: true,
        browser: ['Alpha-X-Multi-Device', 'Web', 'v2'],
        auth: state
    });

    sock.ev.on('creds.update', saveState);


    sock.ev.on('connection.update', async (update) => {


        let _a, _b;
        let connection = update.connection, lastDisconnect = update.lastDisconnect;

        if (connection == 'connecting') {
            await console.log(
                chalk.green.bold('⚙ Connecting to WhatsApp Web...\n'))
        };

        if (connection == 'open') {

            await console.log(chalk.green.bold('✅Successfully connected to WhatsApp Web\n'));

            await console.log(chalk.cyan.bold('⚙️ Genarating your session...\n'));

            //await delay(5000);

            var AuthString = 'AlphaX;;;' + Buffer.from(JSON.stringify(sock.authState.creds)).toString('base64');

            await console.log(chalk.white.italic(AuthString + '\n'));

            await sock.sendMessage(sock.user.id, { text: `${AuthString}` });
          
            await console.log(chalk.cyan.bold('☝️ Copy this code!\n'));

            await fs.unlink('./auth.json', (err => { }));

            process.exit(0);

        };

        if (connection == 'close') {

            if (((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== DisconnectReason.loggedOut) {

                startMultiDeviceQrGen()

            } else {

                console.log(chalk.Red("❌ Couldn't connect to whatsapp!"));

                fs.unlink('./auth.json', (err => { }));

                process.exit(0);
            };

        };

    });
  
};

startMultiDeviceQrGen()
