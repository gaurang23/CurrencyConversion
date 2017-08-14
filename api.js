var api = {
  getRates(){
    var url = 'http://api.fixer.io/latest';
    return fetch(url).then((res) => res.json());
  }
}


module.exports = api;
