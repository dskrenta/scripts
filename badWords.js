const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

async function main() {
  try {
    const file = await readFileAsync('./bad-words.txt', 'utf-8');
    const jsonContent = JSON.stringify({ words: file.split('\n') });
    await writeFileAsync('./bad-words.json', jsonContent);
  }
  catch (error) {
    console.error(error);
  }
}

main();