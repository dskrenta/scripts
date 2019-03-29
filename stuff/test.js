'use strict';

const readline = require('readline');

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

const systems = {
  engineering: {
    warp: {
      factor: 0, // 0 - 9.99
      status: true, // true = online, false = offline
      antimatterContainment: 100, // 0 - 100
      leftNacelPlasmaFeed: true,
      rightNacelPlasmaFeed: true
    },
    impulse: {
      factor: 0, // 0 - 1
      heading: {
        spacialCoordinates: {
          x: 0,
          y: 0,
          z: 0
        }
      }
    },
    shields: {
      status: true,
      integrity: 100 // 0 - 100
    },
    lifeSupport: {
      status: true
    },
  },
  transporters: {
    status: true
  },
  medical: {
    status: true
  },
  tactical: {
    status: true
  },
  science: {
    status: true,
    sensors: true
  }
};

async function main() {
  try {
    const verify = await prompt('Verify Identify:');
    if (verify === 'commander data') {
      console.log('Welcome commander data');
      console.table(systems);
    }
    else {
      console.log('Access Denied');
    }

    rl.close();
  }
  catch (error) {
    console.error(error);
  }
}

main();
