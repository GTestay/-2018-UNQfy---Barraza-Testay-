const classUnqfy = require('./unqfy');
const moduleSpotify = require('./Spotify');


let unqfy = null;
let spotify = null;

unqfy = new classUnqfy.UNQfy();
spotify = new moduleSpotify.Spotify();



const json = {
  name: 'Gustavo Cerati',
  country: 'ARG'
};

spotify.getArtistID(json).then(responseArtist =>{

  console.log(json.name === responseArtist.name);
  console.log('ID',responseArtist.id);
  console.log(responseArtist.name);

  return spotify.getAlbumsFromArtist(responseArtist.id);
}).then(response =>{
  console.log(response);
});



