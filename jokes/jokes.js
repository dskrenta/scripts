'use strict';

const fs = require('fs');
const { promisify } = require('util');

const JOKES_DIR = 'jokes';
const JOKES_FILE = '../../feedvix/data/jokes.js';

const readDirAsync = promisify(fs.readdir);
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

async function main() {
    try {
        let jokesArr = [];
        const files = await readDirAsync(JOKES_DIR);
        for (let file of files) {
            const fileContents = await readFileAsync(`${JOKES_DIR}/${file}`, 'utf-8');
            const parsedJokes = fileContents.split('%');
            for (let joke of parsedJokes) {
                joke = joke.replace(/\t/g, `&emsp;`);
                joke = joke.replace(/\n/g, `<br>`);
                jokesArr.push(joke.substring(4, joke.length));
            }
        }
        jokesArr.pop();
        console.log(JSON.stringify(jokesArr, null, 2));
        await writeFileAsync(JOKES_FILE, `module.exports = ${JSON.stringify(jokesArr)};`);
    }
    catch (error) {
        console.error(error);
    }
}

main();
