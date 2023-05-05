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

    "42e2ae20305244ddaf9b0de5e897fc74",

    "ccc18d2e2ca84e0a81ba29a0af2edc9c",

    "92e9bf1aad214c69b1f3a18a03aae8dc",

    "58b92130c89c496b96164b776d956242"

  ];

  

  return get_md5_checksum(`${salts[0]}${game_version}${salts[1]}${hash}${salts[2]}${rid}${salts[3]}${protocol}`).toUpperCase();

}

server.listen(8080, () => {

  console.log('API Server is running.');

});
