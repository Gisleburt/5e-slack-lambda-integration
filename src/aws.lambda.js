'use strict';

const AWS = require('aws-sdk');
const qs = require('querystring');

const token = '===TOKEN===';
const slashCommand = '/5e';

const commands = {
    help: {
        description: 'Lists available commands',
        call(additionalData, params) {
            return {
                response_type: 'in_channel',
                text: 'The following commands are currently available',
                attachments: {
                    text: Object.keys(commands).reduce((data, current) => (
                      `${data}\\n${slashCommand} ${current} - ${commands[current].description}`
                    ), '')
                },
            };
        },
    },
    roll: {
        description: `Roll a dice. Eg: ${slashCommand} roll d20`,
        call(additionalData, params) {
            return {
                response_type: 'in_channel',
                text: 'Ohps, dropped my dice!',
            };
        },
    },
};

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
        callback(null, commands[desiredCommand].call());
        return;
    }

    callback(`I don't understand the command "${commandText}". Try "${slashCommand} help"`);
}

function getFirstWord(string) {
    if (!string) {
        return '';
    }
    return string.split(' ')[0];
}

function removeFirstWord(string) {
    if (!string) {
        return '';
    }
    return string.substr(string.indexOf(" ") + 1);
}

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

