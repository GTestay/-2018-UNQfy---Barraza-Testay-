const fs = require('fs');
const rp = require('request-promise');

class ApiProyecto {
  constructor() {

    this.api = `http://www.theaudiodb.com/api/v1/json/${1}`;
  }

  topTen() {
    return '/track-top10.php?s=';

  }

  searchTopTenTracksArtist(artist) {
    console.log('BUSCANDO TOP TEN');

    const options = this.options(artist.name);

    return rp.get(options)
      .then(response => {
        console.log(response);
        let tracks  = response.track;
        tracks.forEach(track => {
          console.log(track.strTrack);
        });
      })
      .catch(err => console.error(err));
  }

  options(parameter) {
    return {
      uri: this.api + this.topTen + parameter,
      json: true
    };
  }

}


module.exports = {ApiProyecto};