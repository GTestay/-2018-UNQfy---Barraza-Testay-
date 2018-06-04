const fs = require('fs');
const rp = require('request-promise');
const {generateToken} = require('./funcionesAuxiliares');


class MusixMatch {
  constructor() {
    this.api = 'http://api.musixmatch.com/ws/1.1';
    this.token = generateToken('./tokenApiMusic.json');
  }

  searchLyricsFor(track) {

    return this.searchTrack(track).then(aTrackSearched => {
      return this.searchLyric(aTrackSearched);
    });
  }

  options(endpoint) {
    return {
      uri: this.api + endpoint,
      qs: {
        apikey: '55cfe972c4aa0776d9d46382ee6e7122',
      },
      json: true
    };
  }

  searchTrack(aTrackToSearch) {
    console.log('BUSCANDO CANCION');
    const options = this.options(`/track.search?q_track=${aTrackToSearch.name}`);
    return rp.get(options).then(response => {
      const trackList = response.message.body.track_list;
      const track = trackList
        .map(t => t.track)
        .find((t) => t.album_name == (aTrackToSearch.albumName));

      // console.log(track);
      return track;
    });
  }

  searchLyric(aTrackSearched) {
    console.log('BUSCANDO LETRA DE ' + aTrackSearched.track_name);
    const options = this.options(`/track.lyrics.get?track_id=${aTrackSearched.track_id}`);

    return rp.get(options).then(responseTrack => {
      const lyricSearched = responseTrack.message.body.lyrics;
      // console.log(lyricSearched.lyrics_body);

      return lyricSearched.lyrics_body;
    });
  }
}


module.exports = {MusixMatch};