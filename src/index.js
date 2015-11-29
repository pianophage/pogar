// index.js - Entry point. From the base directory, do 'node src/index.js' to run pogar.

// Imports
var Commands = require('./modules/CommandList');
var GameServer = require('./GameServer');

// Show the console by default.
var shouldShowConsole = true;

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
var gameServer = new GameServer();
gameServer.start();
// Add command handler
gameServer.commands = Commands.list;
// Initialize the server console
if (shouldShowConsole) {
    var readline = require('readline');
    var in_ = readline.createInterface({ input: process.stdin, output: process.stdout });
    setTimeout(prompt, 100);
}


// Console functions

function prompt() {
    in_.question('>', function(str) {
    	parseCommands(str);
        return prompt(); // Too lazy to learn async
    });
};

function parseCommands(str) {
    // Log the string
    gameServer.log.onCommand(str);

    // Don't process ENTER
    if (str === '')
        return;

    // Splits the string
    var split = str.split(' ');

    // Process the first string value
    var first = split[0].toLowerCase();

    // Get command function
    var execute = gameServer.commands[first];
    if (typeof execute != 'undefined') {
        execute(gameServer,split);
    } else {
        console.log('[Console] Invalid Command!');
    }
};
