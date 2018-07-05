const req = require('request-promise');
const {generateToken} = require('./funcionesAuxiliares');

class Spotify {

  constructor() {
    this.api = 'https://api.spotify.com/v1';
    this.token = generateToken('./spotifyCreds.json');
  }

  //Devuelve una promesa con la id
  getArtistFromAPI(artist) {
    const url = `${this.api}/search?q=${artist.name}&type=artist`;

    console.log(url);
    const options = this.options(url);

    let artistListJson;
    const promise = req.get(options)
      .then((response) => {

        artistListJson = response.artists.items;

        return artistListJson.find(a => a.name === artist.name);
      })
      .catch(error => console.log(error));

    return promise;

  }

  getAlbumsFromArtist(id) {
    const url = `${this.api}/artists/${id}/albums`;

    console.log(url);
    const options = this.options(url);

    const albumRetrieve = req.get(options)
      .then(response => {

        const albums = [];

        response.items.filter(a=>a.type === 'album').forEach(a => {
          albums.push({
            name: a.name,
            image: a.images[0],
            year: a.release_date
          });
        });
        console.log(albums.length);
        return albums;

      })
      .catch(error => console.log(error));

    return albumRetrieve;
  }

  options(url) {
    return {
      uri: url,
      headers: {Authorization: 'Bearer ' + this.token.access_token},
      json: true
    };
  }
}


module.exports = {Spotify};