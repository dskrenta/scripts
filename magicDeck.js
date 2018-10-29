'use script';

const decks = [
  'Red Aggro',
  'Green White',
  'Blue Black',
  'Black Devition',
  'White Soldier',
  'Goblin',
  'Merfolk',
  'Blue White',
  'Black'  
];

function shuffle(a) {
  var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
}

function random(int) {
  return Math.floor(Math.random() * int + 1);
}

function magicDeck() {
  const shuffledDecks = shuffle(decks);
  const deck1 = shuffledDecks.pop();
  const deck2 = shuffledDecks.pop();
  const roll1 = random(20);
  const roll2 = random(20);
  let roll1Str = '';
  let roll2Str = '';
  if (roll1 > roll2) {
    roll1Str = `${roll1} 👑`;
    roll2Str = `${roll2} 😭`;
  }
  else if (roll1 < roll2) {
    roll2Str = `${roll1} 👑`;
    roll1Str = `${roll2} 😭`;
  } 
  else {
    roll2Str = `${roll1} 👑`;
    roll1Str = `${roll2} 👑`;
  }
  console.table({ 
    David: {
      Deck: deck1,
      Roll: roll1Str
    }, 
    Bryce: {
      Deck: deck2,
      Roll: roll2Str
    }
  });
}

magicDeck();
