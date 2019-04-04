'use strict';

const readline = require('readline');

const HELP_OBJ = {
  exit: 'leave the game',
  move: 'move <direction>',
  look: 'look around',
  help: 'display the help table',
  exits: 'lists exits for the current room',
  credits: 'displays game credits'
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const prompt = (question) => {
  return new Promise((resolve, reject) => {
    rl.question(`${question}\n`, (answer) => {
      resolve(answer);
    })
  });
}

const data = {
  room: 'entryway',
  health: 100,
  inventory: [
    {
      id: 'key1',
      type: 'key',
      description: 'A shiny key made of bronze'
    }
  ]
};

const rooms = {
  entryway: {
    description: 'Hi, You are standing in a room.',
    exits: {
      north: 'door',
      east: 'hall',
      west: 'stairs',
      south: 'bathroom'
    },
    items: [
      {
        type: 'book',
        description: 'Wizards of Waverly Place'
      }
    ]
  },
  stairs: {

  },
  door: {
    locked: true,
    unlock: 'key1',
    description: 'An oak door leading outside',
    exits: {
      north: 'field'
    }
  },
  hall: {

  },
  bathroom: {

  },
  field: {
    description: 'Sunflower field with birds',
    exits: {
      north: '',
      south: 'door',
      east: '',
      west: ''
    }
  },
  "izzy's": {
    description: 'Juicy steak awaits, you win the game. Fuck off.',
    exits: {

    }
  }
};

const actions = {
  move: (direction) => {
    if (direction in rooms[data.room].exits) {
      const moveRoom = rooms[data.room].exits[direction];
      console.log(`You have moved from ${data.room} to ${moveRoom}`);
      data.room = moveRoom;
    }
    else {
      console.log('No such direction.');
    }
  }
};

function boolMatch(string, regex) {
  const match = string.match(regex);
  return match ? match[0] : false;
}

async function main() {
  try {
    gamePrompt();
  }
  catch (error) {
    console.error(error);
  }
}

async function gamePrompt() {
  try {
    const command = await prompt('What would you like to do?');

    if (command === 'exit') {
      console.log('Bye!');
      rl.close();
    }
    else {
      if (boolMatch(command, /move [a-z]+/)) {
        actions.move(command.replace('move ', ''));
      }
      else if (command === 'exits') {
        console.log(rooms[data.room].exits);
      }
      else if (command === 'look') {
        console.log(`${rooms[data.room].description} ${rooms[data.room].items && `Items: ${rooms[data.room].items.map(item => item.description)}`}`);
      }
      else if (command === 'credits') {
        console.table({
          'David Skrenta': 'Programmer',
          'Rachel Skrenta': 'Programmer, Idea Person'
        })
      }
      else if (command === 'help') {
        console.table(HELP_OBJ);
      }
      else {
        console.log(`I'm sorry, I don't understand.`);
        console.table(HELP_OBJ);
      }

      gamePrompt();
    }
  }
  catch (error) {
    console.error(error);
  }
}

main();
