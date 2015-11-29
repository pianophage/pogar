// index.js - Entry point. From the base directory, do 'node src/index.js' to run pogar.

'use strict';

let readline = require('readline'),
    Commands = require('./modules/CommandList'),
    GameServer = require('./GameServer');

// Console interface using readline.
let rl = null;

// Show the console by default.
let shouldShowConsole = true;

// Handle arguments
process.argv.forEach(function (arg) {
    if (arg === '--noconsole') {
        shouldShowConsole = false;
    } else if (arg === '--help') {
        console.log('Proper Usage: node src/index.js');
        console.log('    --noconsole         Disables the console');
        console.log('    --help              Help menu.');
        console.log('');

        process.exit(0);
    }
});

// Run Ogar
let gameServer = new GameServer();
gameServer.start();
// Add command handler
gameServer.commands = Commands.list;

// Initialize the server console.
if (shouldShowConsole) {
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('line', processCommand);

    rl.setPrompt('(pogar) ');
    rl.prompt();
}

// Process a command entered on the console.
function processCommand(line) {
    line = line.trim();

    if (line) {
        if (line === 'quit' || line === 'q') {
            rl.close();

            // TODO: we can't quit 'cuz the game server is holding us up, I think.

            return;
        }

        // Log the line.
        gameServer.log.onCommand(line);

        // Splits the string
        let split = line.split(' ');

        // Process the first string value
        let first = split[0].toLowerCase();

        // Get command function
        let execute = gameServer.commands[first];
        if (typeof execute !== 'undefined') {
            execute(gameServer, split);
        } else {
            console.log('error: unknown command \'' + first + '\'');
        }
    } else {
        // Ignore blank lines.
    }

    rl.prompt();
};
