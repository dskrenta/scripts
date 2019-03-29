'use strict';

const os = require('os');

function main() {
  console.log(os.arch());
  console.log(os.cpus());
  console.log(os.endianness());
  console.log(os.freemem());
  console.log(os.homedir());
  console.log(os.loadavg());
  console.log(os.networkInterfaces());
  console.log(os.platform());
  console.log(os.release());
  console.log(os.tmpdir());
  console.log(os.type());
  console.log(os.uptime());
}

main();
