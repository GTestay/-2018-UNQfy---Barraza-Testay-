const req = require('request-promise');
const fs = require('fs');

class Spotify {

  constructor() {
    this.token = this.generateToken();
  }

  generateToken() {//cambia cada tanto. refactorizar a lo groso.

    let credenciales = fs.readFileSync('spotifyCreds.json');
    credenciales = JSON.parse(credenciales);
    this.token = credenciales.access_token;
  }

  api() {
    return 'https://api.spotify.com/v1';
  }

  getArtistID(artist) {

    const options = {
      url: `${this.api()}/search/q=name:${artist.name}`,
      headers: {Authorization: 'Bearer ' + this.token},
      json: true
    };

    let parseArtist;
    const artistRetrieve = req.get(JSON.stringify(options));

    artistRetrieve
      .then((request) => {
        parseArtist = JSON.parse(request.data);
        console.log(parseArtist);
        return parseArtist;
      })
      .catch(error => console.log(error));

    console.log(artistRetrieve);
    return artistRetrieve;
  }

  getAlbumsFromArtist(id) {
    const albumRetrieve = req.get(`${this.api()}/artists/${id}/albums`);

    return JSON.parse(albumRetrieve);
  }
}


module.exports = {Spotify};