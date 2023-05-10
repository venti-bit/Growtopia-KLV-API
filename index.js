const http = require('http');

const url = require('url');

const crypto = require('crypto');

const server = http.createServer((req, res) => {

  const { pathname, query } = url.parse(req.url, true);

  if (pathname === '/create_klv') {

    const game_version = parseFloat(query.game_version) || 4.24;

    const protocol = parseInt(query.protocol) || 190;

    const hash = generate_hash();

    const rid = generate_rid();

    const klv = create_klv(game_version, protocol, hash, rid);

    res.writeHead(200, { 'Content-Type': 'text/plain' });

    res.end(`hash|${hash}\nrid|${rid}\nklv|${klv}`);

  } else {

    res.writeHead(404, { 'Content-Type': 'text/plain' });

    res.end('Not Found');

  }

});

function generate_hash() {

  return crypto.randomInt(-2147483648, 2147483647);

}

function generate_rid() {

  return crypto.randomBytes(32 / 2).toString('hex').toUpperCase();

}

function get_md5_checksum(str) {

  return crypto.createHash('md5').update(str).digest('hex');

}

function create_klv(game_version, protocol, hash, rid) {

  const salts = [

    "13c93f386db9da3e00dda16d770b0c83",

    "6b1c01f9128a62a2c97b1a0da4612168",

    "3402d278d8519a522c94d122e98e2e49",

    "ba95613bc0fd94a9d89c5919670e7d5d"

  ];

  

  return get_md5_checksum(`${game_version}${salts[0]}${protocol}${salts[1]}${hash}${salts[2]}${rid}${salts[3]}`).toUpperCase(); //credits to teocodes.

}

server.listen(80, () => {

  console.log('API Server is running.');

});
