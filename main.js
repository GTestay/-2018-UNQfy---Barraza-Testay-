

const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy');

// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function getUNQfy(filename) {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    console.log();
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

// Guarda el estado de UNQfy en filename
function saveUNQfy(unqfy, filename) {
  console.log();
  unqfy.save(filename);
}

function generarDiccionario(array) {
  let dic = new Array();
  while(array.length > 0) {
    let param = array.shift();
    let value = array.shift();
    dic[param] = value;
  }
  return dic;
}

function help(command) {
  let info;
  switch(command) {
    case "addArtist":
      info=`
addArtist: agrega un nuevo artista.

params:
name: nombre del artista
country: país de procedencia
`;
    break;
    default:
      info=`
Escriba 'help comando' para recibir la ayuda de dicho comando.

comandos disponibles:
addArtist
addAlbum
addTrack
listArtist
listAlbum
listTrack
listTrackByGenre
searchArtist
searchAlbum
SearchTrack
`;
}
console.log(info);
}

function isNotUndefined(value) {
  return value != undefined;
}

function runCommand(func, params, args) {
  if(params.every(p => isNotUndefined(args[p]))) {
    console.log(func(args));
  } else {
    console.log("error: se esperaba los siguientes parametros: "+params);
  }
}

function main() {
  let unqfy = getUNQfy('estado.json');
  let comando = process.argv[2];
  let args = generarDiccionario(process.argv.slice(3));
  
  switch(comando) {
  case "addAlbum":
    runCommand(a => {
      let artist = unqfy.getArtistByName(a.artist);
      if(isNotUndefined(artist)) {
        unqfy.addAlbum(a.artist, a);
        return `Album '${a.name}' de '${a.artist}', fue insertado correctamente.`;
      } else {
        return "error: artista inexistente.";
      }
    }, ["name", "year", "artist"], args);
  break;
  case "addArtist":
    runCommand(a => {
      let artist = unqfy.getArtistByName(a.name);
      if(isNotUndefined(artist)) {
        return `error: el artista '${a.name}' se encuentra registrado.`;
      } else {
        unqfy[comando](a);
        return `el artista '${a.name}', fue insertado correctamente.`;
      }
    }, ["name", "country"], args);
  break;
  case "addTrack":
    runCommand(a => {
      let album = unqfy.getAlbumByName(a.album);
      if(isNotUndefined(album)) {
        unqfy.addTrack(a.album, a);
        return `el track '${a.name}' del album '${a.album}', fue insertado correctamente.`;
      } else {
        return `error: el album '${a.album}' no existe.`;
      }
    }, ["name","duration","genres","album"], args);
  break;
  case "help":
    help(process.argv[3]);
  break;
  case "listAlbum":
    console.log("Albums:\n");
    unqfy.albums.forEach(a => console.log(`${a.name} ('${a.artist}')`));
  break;
  case "listArtist":
    console.log("Artists:\n");
    unqfy.artists.forEach(a => console.log(`${a.name} ('${a.country}')`));
  break;
  case "listTrack":
    runCommand(a => {
      let album = unqfy.getAlbumByName(a.album);
      if(isNotUndefined(album)) {
        console.log("Tracks:\n");
        album.tracks.forEach(t => console.log(t.name));
      } else {
        return "Album inexistente."; 
      }
    }, ["album"], args);
  break;
  case "listTrackByGenre":
    runCommand(a => {
      let tracks = unqfy.getTracksMatchingGenres([a.genre]);
      if(tracks.length > 0) {
        console.log("Tracks:\n");
        tracks.forEach(t => console.log(t.name));
      } else {
        return `no hay tracks del genero: '${a.genre}'.`; 
      }
    }, ["genre"], args);
  break;
  case "removeArtist":
    runCommand(a => {
      let artist = unqfy.getArtistByName(a.name);
      if(isNotUndefined(artist)) {
        unqfy.removeArtist(a.name);
        return `el artista '${a.name}', fue eliminado correctamente.`;
      } else {
        return `error: el artista '${a.name}' no existe.`;
      }
    }, ["name"], args);
  break;
  case "searchAlbum":
    runCommand(a => {
      let album = unqfy.getAlbumByName(a.name);
      if(isNotUndefined(album)) {
        return "album: "+album;
      } else {
        return "Album inexistente.";
      }
    }, ["name"], args);
  break;
  case "searchArtist":
    runCommand(a => {
      let artist = unqfy.getArtistByName(a.name);
      if(isNotUndefined(artist)) {
        return "Artista: "+artist;
      } else {
        return "Artista inexistente.";
      }
    }, ["name"], args);
  break;
  case "searchTrack":
    runCommand(a => {
      let track = unqfy.getTrackByName(a.name);
      if(isNotUndefined(track)) {
        return "Track: "+track;
      } else {
        return "track inexistente.";
      }
    }, ["name"], args);
  break;
  default:
  console.log("error: el comando no es correcto");
  }
  saveUNQfy(unqfy, 'estado.json');
}

main();


