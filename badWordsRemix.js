const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

async function main() {
  try {
    const nonBadFile = await readFileAsync('./non-bad-words.txt', 'utf-8');
    const nonBadContent = nonBadFile.split('\n').map(term => term.replace('-', '').trim());
    const badFile = await readFileAsync('./bad-words.txt', 'utf-8');
    const filteredTerms = badFile.split('\n').map(term => term.trim()).filter(term => {
      for (let word of nonBadContent) {
        if (word === term) {
          return false;
        }
      }
      return true;
    });
    const jsonContent = JSON.stringify({ words: filteredTerms });
    await writeFileAsync('./bad-words.json', jsonContent);
  }
  catch (error) {
    console.error(error);
  }
}

main();