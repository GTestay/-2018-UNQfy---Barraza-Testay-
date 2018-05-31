const req = require('request-promise');
const fs = require('fs');

class Spotify {

  constructor() {

  }

  token() {
    let unToken = fs.readFileSync('./spotifyCreds.json').toString();
    console.log(unToken);
    return JSON.parse(unToken).access_token;
  }

  api() {
    return 'https://api.spotify.com/v1';
  }

  //Devuelve una promesa con la id
  getArtistFromAPI(artist) {
    const url = `${this.api()}/search?q=${artist.name}&type=artist`;

    console.log(url);
    const options = {
      uri: url,
      headers: {Authorization: 'Bearer ' + this.token()},
      json: true
    };

    let artistListJson;
    const promise = req.get(options)
      .then((response) => {

        if (response.error) {
          console.log(response.error);
          return ;
        }
        artistListJson = response.artists.items;

        return artistListJson.find(a => a.name === artist.name);
      })
      .catch(error => console.log(error));

    return promise;

  }

  getAlbumsFromArtist(id) {
    const url = `${this.api()}/artists/${id}/albums`;

    console.log(url);
    const options = {
      uri: url,
      headers: {Authorization: 'Bearer ' + this.token()},
      json: true
    };

    const albumRetrieve = req.get(options).then(response => {
        const albums = [];

        response.items.forEach(a => {
          albums.push({
            name: a.name,
            id: a.id,
            images: a.images,
            year: a.release_date
          });
        });
        return albums;

      }
    );

    return albumRetrieve;
  }
}


module.exports = {Spotify};