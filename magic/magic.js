'use strict';

const sampleDeck = [
  {
    type: 'land',
    name: 'Mountain',
    color: 'red'
  },
  {
    type: 'land',
    name: 'Mountain',
    color: 'red'
  },
  {
    type: 'land',
    name: 'Mountain',
    color: 'red'
  },
  {
    type: 'land',
    name: 'Mountain',
    color: 'red'
  },
  {
    type: 'land',
    name: 'Mountain',
    color: 'red'
  },
  {
    type: 'land',
    name: 'Mountain',
    color: 'red'
  },
  {
    type: 'land',
    name: 'Mountain',
    color: 'red'
  },
  {
    type: 'land',
    name: 'Mountain',
    color: 'red'
  },
  {
    type: 'land',
    name: 'Moutain',
    color: 'red'
  },
  {
    type: 'land',
    name: 'Mountain',
    color: 'red'
  },
  {
    type: 'land',
    name: 'Island',
    color: 'blue'
  },
  {
    type: 'land',
    name: 'Island',
    color: 'blue'
  },
  {
    type: 'land',
    name: 'Island',
    color: 'blue'
  },
  {
    type: 'land',
    name: 'Island',
    color: 'blue'
  },
  {
    type: 'land',
    name: 'Island',
    color: 'blue'
  },
  {
    type: 'land',
    name: 'Island',
    color: 'blue'
  },
  {
    type: 'land',
    name: 'Island',
    color: 'blue'
  },
  {
    type: 'land',
    name: 'Island',
    color: 'blue'
  },
  {
    type: 'land',
    name: 'Island',
    color: 'blue'
  },
  {
    type: 'land',
    name: 'Island',
    color: 'blue'
  },
  {
    type: 'instant',
    name: 'Bolt',
    text: 'Bolt deals 3 damage to target player',
    cost: {
      blue: 0,
      red: 1,
      green: 0,
      white: 0,
      black: 0,
      colorless: 0,
    },
    effect: ({ targetPlayer }) => {
      state[targetPlayer].life -= 3;
    }
  },
  {
    type: 'instant',
    name: 'Bolt',
    text: 'Bolt deals 3 damage to target player',
    cost: {
      blue: 0,
      red: 1,
      green: 0,
      white: 0,
      black: 0,
      colorless: 0,
    },
    effect: ({ targetPlayer }) => {
      state[targetPlayer].life -= 3;
    }
  },
  {
    type: 'instant',
    name: 'Bolt',
    text: 'Bolt deals 3 damage to target player',
    cost: {
      blue: 0,
      red: 1,
      green: 0,
      white: 0,
      black: 0,
      colorless: 0,
    },
    effect: ({ targetPlayer }) => {
      state[targetPlayer].life -= 3;
    }
  },
  {
    type: 'instant',
    name: 'Bolt',
    text: 'Bolt deals 3 damage to target player',
    cost: {
      blue: 0,
      red: 1,
      green: 0,
      white: 0,
      black: 0,
      colorless: 0,
    },
    effect: ({ targetPlayer }) => {
      state[targetPlayer].life -= 3;
    }
  },
  {
    type: 'creature',
    name: 'Crazy Brawler',
    cost: {
      blue: 1,
      red: 1,
      green: 0,
      white: 0,
      black: 0,
      colorless: 0,
    },
    power: 2,
    toughness: 3
  },
  {
    type: 'creature',
    name: 'Crazy Brawler',
    cost: {
      blue: 1,
      red: 1,
      green: 0,
      white: 0,
      black: 0,
      colorless: 0,
    },
    power: 2,
    toughness: 3
  },
  {
    type: 'creature',
    name: 'Crazy Brawler',
    cost: {
      blue: 1,
      red: 1,
      green: 0,
      white: 0,
      black: 0,
      colorless: 0,
    },
    power: 2,
    toughness: 3
  },
  {
    type: 'creature',
    name: 'Crazy Brawler',
    cost: {
      blue: 1,
      red: 1,
      green: 0,
      white: 0,
      black: 0,
      colorless: 0,
    },
    power: 2,
    toughness: 3
  }
];

const state = {
  player1: {
    life: 20,
    deck: sampleDeck,
    hand: [],
    graveyard: [],
    battlefield: {
      lands: [],
      creatures: []
    }
  },
  player2: {
    life: 20,
    deck: sampleDeck,
    hand: [],
    graveyard: [],
    battlefield: {
      lands: [],
      creatures: []
    }
  }
};

function shuffle(cards) {
  for (let i = 0; i < cards.length; i++) {
    const randIndex = rand(0, cards.length);
    const temp = cards[i];
    cards[i] = cards[randIndex];
    cards[randIndex] = temp;
  }
  return cards;
}

function shuffleDeck(player) {
  state[player].deck = shuffle(state[player].deck);
}

function rand(min, max) {
  return Math.floor(Math.random() * max) + min;
}

function drawCard(player) {
  return state[player].deck.shift();
}

function drawHand(player) {
  for (let i = 0; i < 7; i++) {
    state[player].hand.push(drawCard(player));
  }
}

function rollForOrder() {
  let player1Roll = 0;
  let player2Roll = 0;

  do {
    player1Roll = rand(1, 20);
    player2Roll = rand(1, 20);
  }
  while (player1Roll === player2Roll)

  if (player1Roll > player2Roll) {
    return {
      first: 'player1',
      second: 'player2'
    };
  }

  return {
    first: 'player2',
    second: 'player1'
  };
}

function convertedManaCost(card) {
  let cmc = 0;
  for (const colorKey in card.cost) {
    cmc += card.cost[colorKey];
  }
  return cmc;
}

function handAnalytics(player) {
  const analytics = {
    landCount: 0,
    creatureCount: 0,
    instantCount: 0,
  };

  for (const card of state[player].hand) {
    if (card.type === 'land') {
      analytics.landCount += 1;
    }
    else if (card.type === 'creature') {
      analytics.creatureCount += 1;
    }
    else if (card.type === 'instant') {
      analytics.instantCount += 1;
    }
  }

  return analytics;
}

function playCard(player, cardIndex) {
  const card = state[player].hand[cardIndex];
  delete state[player].hand[cardIndex];

  if (card.type === 'land') {
    state[player].battlefield.lands.push(card);
  }
  /*
  else if (card.type === 'creature') {
    analytics.creatureCount += 1;
  }
  else if (card.type === 'instant') {
    analytics.instantCount += 1;
  }
  */
}

function turnStep(player, turnIndex) {
  let playedLand = false;

  // Draw card for turn if not first turn in game
  if (turnIndex !== 0) {
    drawCard(player);
  }

  if (!playedLand && handAnalytics(player).landCount > 0) {
    playCard(player, landIndex)
  }
}

function startGame() {
  // roll die for first player
  const order = rollForOrder();
  // player1 shuffle
  shuffleDeck('player1');
  // player2 shuffle
  shuffleDeck('player2');
  // player1 draw
  drawHand('player1');
  // player2 draw
  drawHand('player2');

  console.log(handAnalytics('player1'), handAnalytics('player2'));

  let turnIndex = 0;

  // console.log(state);
}

startGame();
