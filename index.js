const http = require('http');

const url = require('url');

const crypto = require('crypto');

const server = http.createServer((req, res) => {

  const { pathname, query } = url.parse(req.url, true);

  if (pathname === '/create_klv') {

    const game_version = parseFloat(query.game_version) || 4.23;

    const protocol = parseInt(query.protocol) || 189;

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

  return Math.floor(Math.random() * (/*max*/ 2147483647 - /*min*/ -2147483648 + 1)) + /*min*/ -2147483648;

}

function generate_rid() {

  return crypto.randomBytes(32 / 2).toString('hex').toUpperCase();

}

function get_md5_checksum(str) {

  return crypto.createHash('md5').update(str).digest('hex');

}

function create_klv(game_version, protocol, hash, rid) {

  const salts = [

    "0b02ea1d8610bab98fbc1d574e5156f3",

    "b414b94c3279a2099bd817ba3a025cfc",

    "bf102589b28a8cc3017cba9aec1306f5",

    "dded9b27d5ce7f8c8ceb1c9ba25f378d"

  ];

  

  return get_md5_checksum(`${salts[0]}${game_version}${salts[1]}${hash}${salts[2]}${rid}${salts[3]}${protocol}`).toUpperCase();

}

server.listen(8080, () => {

  console.log('API Server is running.');

});
