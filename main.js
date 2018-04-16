

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
      unqfy[comando](a);
      return `el artista '${a.name}', fue insertado correctamente.`;
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


