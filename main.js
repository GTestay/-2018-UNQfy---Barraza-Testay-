

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
  const dic = new Array();
  while(array.length > 0) {
    const param = array.shift();
    const value = array.shift();
    dic[param] = value;
  }
  return dic;
}

function help(command) {
  let info;
  switch(command) {
  case 'addArtist':
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
listTrackByAlbum
listTrackByArtist
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
    console.log(`error: se esperaba los siguientes parametros: ${params} `);
  }
}

function main() {
  const unqfy = getUNQfy('estado.json');
  const comando = process.argv[2];
  const args = generarDiccionario(process.argv.slice(3));
  
  switch(comando) {
  case 'addAlbum':
    runCommand(a => {
      const artist = unqfy.getArtistByName(a.artist);
      if(isNotUndefined(artist)) {
        unqfy.addAlbum(a.artist, a);
        return `Album '${a.name}' de '${a.artist}', fue insertado correctamente.`;
      } else {
        return 'error: artista inexistente.';
      }
    }, ['name', 'year', 'artist'], args);
    break;
  case 'addArtist':
    runCommand(a => {
      const artist = unqfy.getArtistByName(a.name);
      if(isNotUndefined(artist)) {
        return `error: el artista '${a.name}' se encuentra registrado.`;
      } else {
        unqfy[comando](a);
        return `el artista '${a.name}', fue insertado correctamente.`;
      }
    }, ['name', 'country'], args);
    break;
  case 'addPlaylist':
    runCommand(a => {
      const p = unqfy.getPlaylistByName(a.name);
      if(isNotUndefined(p)) {
        return `error: la playlist '${a.name}' ya existe`;
      } else {
        unqfy.addPlaylist(a.name, a.genres.split(","), a.duration);
        return `Playlist '${a.name}' creada exitosamente.`;
      }
    }, ['name', 'duration', 'genres'], args);
    break;
  case 'addTrack':
    runCommand(a => {
      const album = unqfy.getAlbumByName(a.album);
      if(isNotUndefined(album)) {
        unqfy.addTrack(a.album, a);
        return `el track '${a.name}' del album '${a.album}', fue insertado correctamente.`;
      } else {
        return `error: el album '${a.album}' no existe.`;
      }
    }, ['name','duration','genre','album'], args);
    break;
  case 'help':
    help(process.argv[3]);
    break;
  case 'listAlbum':
    if(unqfy.albums.length > 0) {
      console.log('Albums:\n');
      unqfy.albums.forEach(a => console.log(a.toString()));
    } else {
      console.log('No hay albums registrados.');
    }
    break;
  case 'listArtist':
    if(unqfy.artists.length > 0) {
      console.log('Artists:\n');
      unqfy.artists.forEach(a => console.log(a.toString()));
    } else {
      console.log('No hay artistas registrados.');
    }
    break;
  case 'listPlaylist':
    if(unqfy.playlists.length > 0) {
      console.log('Playlists:\n');
      unqfy.playlists.forEach(p => console.log(p.toString()));
    } else {
      console.log('no hay playlist registradas.'); 
    }
    break;
  case 'listTrack':
    const tracks = unqfy.listTracks();
    if(tracks.length > 0) {
      console.log(`Tracks (${tracks.length}):\n`);
      tracks.forEach(t => console.log(t.toString()));
    } else {
      console.log('No hay tracks registrados.');
    }
    break;
  case 'listTrackByAlbum':
    runCommand(a => {
      const album = unqfy.getAlbumByName(a.name);
      if(isNotUndefined(album)) {
        console.log('Tracks:\n');
        album.tracks.forEach(t => console.log(t.toString()));
        return '\n';
      } else {
        return 'Album inexistente.'; 
      }
    }, ['name'], args);
    break;
  case 'listTrackByArtist':
    runCommand(a => {
      const artist = unqfy.getArtistByName(a.name);
      if(isNotUndefined(artist)) {
        const tracks = unqfy.getTracksMatchingArtist(a.name);
        if(tracks.length > 0) {
          console.log('Tracks:\n');
          tracks.forEach(t => console.log(t.name));
          return '\n';
        } else {
          return `${artist.name} no tiene tracks registrados.`;
        }
      } else {
        return `error: el artista '${a.name}' no existe.`; 
      }
    }, ['name'], args);
    break;
  case 'listTrackByGenre':
    runCommand(a => {
      const tracks = unqfy.getTracksMatchingGenres(a.genres.split(","));
      if(tracks.length > 0) {
        console.log('Tracks:\n');
        tracks.forEach(t => console.log(t.name));
        return "\n";
      } else {
        return `no hay tracks del genero: '${a.genre}'.`; 
      }
    }, ['genres'], args);
    break;
  case 'removeAlbum':
    runCommand(a => {
      const album = unqfy.getAlbumByName(a.name);
      if(isNotUndefined(album)) {
        unqfy.removeAlbum(a.name);
        return `el album '${a.name}', fue eliminado correctamente.`;
      } else {
        return `error: el album '${a.name}' no existe.`;
      }
    }, ['name'], args);
    break;
  case 'removeArtist':
    runCommand(a => {
      const artist = unqfy.getArtistByName(a.name);
      if(isNotUndefined(artist)) {
        unqfy.removeArtist(a.name);
        return `el artista '${a.name}', fue eliminado correctamente.`;
      } else {
        return `error: el artista '${a.name}' no existe.`;
      }
    }, ['name'], args);
    break;
  case 'removePlaylist':
    runCommand(a => {
      const p = unqfy.getPlaylistByName(a.name);
      if(isNotUndefined(p)) {
        unqfy.removePlaylist(a.name);
        return `La playlist '${a.name}', fue eliminada correctamente.`;
      } else {
        return `error: la playlist '${a.name}' no existe.`;
      }
    }, ['name'], args);
    break;
  case 'removeTrack':
    runCommand(a => {
      const track = unqfy.getTrackByName(a.name);
      if(isNotUndefined(track)) {
        unqfy.removeTrack(a.name);
        return `el track '${a.name}', fue eliminado correctamente.`;
      } else {
        return `error: el track '${a.name}' no existe.`;
      }
    }, ['name'], args);
    break;
  case 'searchAlbum':
    runCommand(a => {
      const album = unqfy.getAlbumByName(a.name);
      if(isNotUndefined(album)) {
        return 'album: '+album;
      } else {
        return 'Album inexistente.';
      }
    }, ['name'], args);
    break;
  case 'searchArtist':
    runCommand(a => {
      const artist = unqfy.getArtistByName(a.name);
      if(isNotUndefined(artist)) {
        return 'Artista: '+artist;
      } else {
        return 'Artista inexistente.';
      }
    }, ['name'], args);
    break;
  case 'searchPlaylist':
    runCommand(a => {
      const p = unqfy.getPlaylistByName(a.name);
      if(isNotUndefined(p)) {
        console.log(`PlayList: '${p.name}'\n`);
        if(p.tracks.length > 0) {
          p.tracks.forEach(t => console.log(`${t}`));
        } else {
          console.log('no tiene tracks.');
        }
        return '\n';
      } else {
        return 'Error: playlist inexistente.';
      }
    }, ['name'], args);
    break;
  case 'searchTrack':
    runCommand(a => {
      const track = unqfy.getTrackByName(a.name);
      if(isNotUndefined(track)) {
        return 'Track: '+track;
      } else {
        return 'track inexistente.';
      }
    }, ['name'], args);
    break;
  default:
    console.log('error: el comando no es correcto');
  }
  saveUNQfy(unqfy, 'estado.json');
}

main();


