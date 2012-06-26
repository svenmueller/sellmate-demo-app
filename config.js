//exports.host_api: 'http://api.sellmate.com';
//exports.host_auth: 'https://auth.sellmate.com';
exports.host_api: 'http://api.sellmatepages.com';
exports.host_auth: 'https://auth.sellmatepages.com';

exports.response_type: 'code';
exports.grant_type_auth: 'authorization_code';
exports.grant_type_refresh: 'refresh_token';
exports.shop: 'test';
exports.client_id: 12002;
exports.client_secret: 'GDqbHdpkm4kbJ7loT';
exports.redirect_uri: 'http://localhost:8888/callback';
exports.charset: 'UTF-8';
exports.mac_algorithm: 'HmacSHA256';

exports.pageLimit = 25;

exports.shopUrl = this.host_api + '/' + this.shop;