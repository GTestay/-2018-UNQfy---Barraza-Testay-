const req = require('request-promise');
const fs = require('fs');

class Spotify {

  constructor() {

  }

  token() {
    const filepath = './spotifyCreds.json';
    if (fs.existsSync(filepath)) {
      console.log('Leyendo Token');
      let unToken = fs.readFileSync(filepath).toString();
      unToken = JSON.parse(unToken).access_token;
      return unToken;
    } else {
      throw new Error('ARCHIVO INEXISTENTE');
    }
  }

  api() {
    return 'https://api.spotify.com/v1';
  }

  //Devuelve una promesa con la id
  getArtistFromAPI(artist) {
    const url = `${this.api()}/search?q=${artist.name}&type=artist`;

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
    const url = `${this.api()}/artists/${id}/albums`;

    console.log(url);
    const options = this.options(url);

    const albumRetrieve = req.get(options)
      .then(response => {

        const albums = [];


        response.items.forEach(a => {
          albums.push({
            name: a.name,
            id: a.id,
            images: a.images,
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
      headers: {Authorization: 'Bearer ' + this.token()},
      json: true
    };
  }
}


module.exports = {Spotify};