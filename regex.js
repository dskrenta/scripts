'use strict';

/*
const stuff = {
  header1: 'My header 1',
  header2: 'My header 2'
};

const html = render`
  <div>
    <h1>${stuff.header1}</h1>
    <h2>${stuff.header2}</h2>
  </div>
`;

function render(chunks, ...data) {
  console.log(chunks, data);
  chunks.forEach(chunk => {
    console.log(clean(chunk).trim());
  });
} 

function clean(str) {
  return str.replace('\[\s\r\n]\g', '');
}
*/

const elementNameRegex = new RegExp(/<\/*(.*?)>/g);

const html = '<div>inner content</div>';

// const res = html.match(elementNameRegex);

const res = elementNameRegex.exec(html);

console.log(res);