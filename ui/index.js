// JS DOM expirements

'use strict';

const tagNameRegex = new RegExp(/\s*<\/*([a-zA-Z0-9]+)>\s*/g);
const tagNameRegex2 = new RegExp(/\s*<\/*(.*?)>\s*/g);

function render(strings, ...values) {
  console.log(strings, values);
  // chunks.forEach(chunk => console.log(chunk.match(tagNameRegex2)));

  for (let string of strings) {
    console.log(string.match(/<[a-zA-Z0-9]+>/), string);
  }

  let str = '';
  strings.forEach((string, i) => {
    str += values[i] ? string + values[i] : string;
  });
  return str;
}

const stuff = {
  name: {
    first: 'David',
    last: 'Skrenta'
  },
  age: 19
};

function withProxy(obj) {
  const handler = {
    get: (obj, prop) => {
      // console.log(`getting ${prop} on ${obj}`);
      return obj[prop];
    },
    set: (obj, prop, value) => {
      // console.log(`setting ${prop} on ${obj} to ${value}`);
      obj[prop] = value; 
      return true;
    }
  }

  return new Proxy(obj, handler);
}

const data = withProxy(stuff);


const html = render`
  <div>
    <h1 class="dataNameFirst">${data.name.first}<h1> 
    <h2 class="dataNameLast">${data.name.last}</h2>
    <p class="dataAge">${data.age}</p>
  </div>
`;

// data.name.first = 'Rachel';

// document.getElementById('root').appendChild(document.createElement(html));

/*
  Development notes: 

  render tagged template function: 
    - create template for insertion into dom tree
    - create dom fragment
    - create elements from inserted html string
    - connect elements that use state with proxied state object for future updates

  render(props) => html
  compare new change to dispatch new update
*/

document.getElementById('root').insertAdjacentHTML('afterend', html);

setInterval(() => {
  const current = document.querySelector('.dataAge').textContent;
  document.querySelector('.dataAge').textContent = parseInt(current) + 1;
}, 1000);