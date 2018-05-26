const req = require('request-promise');
const fs = require('fs');

class Spotify {

  constructor() {
    this.token = this.generateToken();
  }

  generateToken() {//cambia cada tanto. refactorizar a lo groso.

    let credenciales = fs.readFileSync('spotifyCreds.json');
    credenciales = JSON.parse(credenciales);
    this.token = credenciales;
  }

  api() {
    return 'https://api.spotify.com/v1';
  }

  accessToken() {
    return 'BQCqE9Z2GgAKzMANDS1qt8wOXnZ0SefG85sEOQIcVlFx2Ls8qDivV4sBiZ9uSaW9opOZ8JD8_rBFOYYLfRdh2qPg7PACrUIUVs3U34lcSXjW9pSr0CKuic8DuwySOIriEFTXwgAz2AXOQbxg_8alrvfGgJgNV9KItw';
  }

  getArtistID(artist) {

    const options = {
      uri: `${this.api()}/search/q=name:${artist.name}`,
      headers: {
        Authorization: 'Bearer ' + this.token
      }
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


    return artistRetrieve;
  }

  getAlbumsFromArtist(id) {
    const albumRetrieve = req.get(`${this.api()}/artists/${id}/albums`);

    return JSON.parse(albumRetrieve);
  }
}


module.exports = Spotify;