'use strict';

const AWS = require('aws-sdk');
const qs = require('querystring');

const token = '===TOKEN===';
const slashCommand = '/5e';

const commands = {
    /**
     * Auto generated help
     */
    help: {
        description: 'Lists available commands',
        call(additionalData, params) {
            return {
                response_type: 'in_channel',
                text: 'The following commands are currently available',
                attachments: Object.keys(commands).map((key) => ({
                    text: `\`${slashCommand} ${key}\` - ${commands[key].description}`,
                    mrkdwn_in: ["text"],
                })),
            };
        },
    },
    /**
     * Dice rolling functionality
     */
    roll: {
        description: `Roll a dice. Eg: \`${slashCommand} roll 10d6\`, (rolls a d20 by default)`,
        call(additionalData, params) {
            return {
                response_type: 'in_channel',
                text: 'Ohps, dropped my dice!',
            };
        },
    },
};

/**
 * Handle an incoming event
 * @param event
 * @param callback
 * @returns {*}
 */
function processEvent(event, callback) {
    const params = qs.parse(event.body);
    const requestToken = params.token;
    if (requestToken !== token) {
        console.error(`Request token (${requestToken}) does not match expected`);
        return callback('Invalid request token');
    }

    const user = params.user_name;
    const command = params.command;
    const channel = params.channel_name;
    const commandText = params.text;

    // Get the first word after slashCommand
    const desiredCommand = getFirstWord(commandText);

    if(desiredCommand && commands.hasOwnProperty(desiredCommand) && commands[desiredCommand].hasOwnProperty('call')) {
        callback(null, commands[desiredCommand].call(removeFirstWord(commandText), params));
        return;
    }

    callback(`I don't understand the command "${commandText}". Try "${slashCommand} help"`);
}

/**
 * Get the first word in a string
 * @param string
 * @returns {string}
 */
function getFirstWord(string) {
    if (!string) {
        return '';
    }
    return string.split(' ')[0];
}

/**
 * Remove the first word from a string
 * @param string
 * @returns {string}
 */
function removeFirstWord(string) {
    if (!string || string.indexOf(" ") === false) {
        return '';
    }
    return string.substr(string.indexOf(" ") + 1);
}

/**
 * Handle errors or move on to processEvent
 * @param event
 * @param context
 * @param callback
 */
exports.handler = (event, context, callback) => {
    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? (err.message || err) : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (token) {
        processEvent(event, done);
        return;
    }

    done('Token has not been set.');
};

