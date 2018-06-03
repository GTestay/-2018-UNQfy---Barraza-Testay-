/* eslint-disable no-case-declarations */
const fs = require('fs');const unqmod = require('./unqfy');
const {isNotUndefined, isNotEmpty, generarDiccionario} = require('./funcionesAuxiliares');

// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function getUNQfy(filename) {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

function saveUNQfy(unqfy, filename) {
  unqfy.save(filename);
}

function help(command) {
  let info;
  switch (command) {
  case 'addArtist':
    info = `
addArtist: agrega un artista.

Argumentos:
name: nombre del artista
country: país de procedencia`;
    break;
  case 'addAlbum':
    info = `
addAlbum: agrega un album.

Argumentos:
name: nombre del album
year: año que fue grabado.
artist: artista que lo grabó.`;
    break;
  case 'addPlayList':
    info = `
addPlaylist: agrega una playlist.

Argumentos:
name: nombre de la playlist
duration: duración de la playlist.
genres: géneros de canciones que incluirá.`;
    break;
  case 'addTrack':
    info = `
addTrack: agrega una canción.

Argumentos:
name: nombre de la canción
duration: duración.
genre: género.
album: nombre del album en el cual está incluída.`;
    break;
  case 'listArtist':
    info = 'listArtist: lista todos los artistas.';
    break;
  case 'listAlbum':
    info = 'listAlbum: lista todos los albumnes.';
    break;
  case 'listPlaylist':
    info = 'listPlaylist: lista todos los playlist.';
    break;
  case 'listTrack':
    info = 'listTrack: lista todas las canciones.';
    break;
  case 'listTrackByAlbum':
    info = `
listTrackByAlbum: lista todas las canciones del album indicado.

Argumentos:
name: nombre del album.
`;
    break;
  case 'listTrackByArtist':
    info = `
listTrackByArtist: lista todas las canciones de un artista.

Argumentos:
name: nombre del artista.
`;
    break;
  case 'listTrackByGenre':
    info = `
listTrackByGenre: lista todos las canciones de uno o mas géneros.

Argumentos:
genres: géneros.

Se debe escribir los géneros entre comillas, y si incluye mas de uno, tienen que estar separados por comas y sin espacios, por ejemplo:
"pop,rock,otros"
`;
    break;
  case 'searchArtist':
    info = `
searchArtist: muestra la información de un artista registrado.

Argumentos:
name: nombre del artista.
`;
    break;
  case 'searchAlbum':
    info = `
searchAlbum: muestra la información de un album.

Argumentos:
name: nombre del album.
`;
    break;
  case 'searchPlaylist':
    info = `
searchPlaylist: muestra la información de una playlist.

Argumentos:
name: nombre de la playlist.
`;
    break;
  case 'searchTrack':
    info = `
searchTrack: muestra la información de una canción.

Argumentos:
name: nombre de la canción.
`;
    break;
  case 'removeAlbum':
    info = `
removeAlbum:

Argumentos:
name: nombre del album.
`;
    break;
  case 'removeArtist':
    info = `
removeArtist: elimina un artista.

Argumentos:
name: nombre del artista.
`;
    break;
  case 'removePlaylist':
    info = `
removePlaylist: borra una playlist

Argumentos:
name: nombre de la playlist a borrar.
`;
    break;
  case 'removeTrack':
    info = `
removeTrack: elimina una canción.

Argumentos:
name: nombre de la canción.
`;
    break;
  default:
    info = `
Escriba 'help comando' para recibir la ayuda de dicho comando.

comandos disponibles:
addArtist
addAlbum
addPlayList
addTrack
listArtist
listAlbum
listPlaylist
listTrack
listTrackByAlbum
listTrackByArtist
listTrackByGenre
searchArtist
searchAlbum
searchPlaylist
searchTrack
removeAlbum
removeArtist
removePlaylist
removeTrack
`;
  }
  console.log(info);
}

function runCommand(func, params, args) {
  if (params.every(p => isNotUndefined(args[p]))) {
    console.log(func(args));
  } else {
    console.log(`error: se esperaba los siguientes parametros: ${params} `);
  }
}

function main() {
  const unqfy = getUNQfy('estado.json');
  const comando = process.argv[2];
  const args = generarDiccionario(process.argv.slice(3));

  switch (comando) {
  case 'addAlbum':
    runCommand(a => {
      const artist = unqfy.getArtistByName(a.artist);
      if (isNotUndefined(artist)) {
        unqfy.addAlbum(a.artist, a);
        return `Album '${a.name}' de '${a.artist}', fue insertado correctamente.`;
      } else {
        return 'error: artista inexistente.';
      }
    }, ['name', 'year', 'artist'], args);
    break;
  case 'addArtist':
    runCommand(a => {
      try {
        const artist = unqfy.getArtistByName(a.name);
      } catch (ArtistNotFoundException) {
        unqfy[comando](a);
        return `el artista '${a.name}', fue insertado correctamente.`;
      }
      return `error: el artista '${a.name}' se encuentra registrado.`;
    }, ['name', 'country'], args);
    break;
  case 'addPlaylist':
    runCommand(a => {
      const p = unqfy.getPlaylistByName(a.name);
      if (isNotUndefined(p)) {
        return `error: la playlist '${a.name}' ya existe`;
      } else {
        unqfy.addPlaylist(a.name, a.genres.split(','), a.duration);
        return `Playlist '${a.name}' creada exitosamente.`;
      }
    }, ['name', 'duration', 'genres'], args);
    break;
  case 'addTrack':
    runCommand(a => {
      const album = unqfy.getAlbumByName(a.album);
      if (isNotUndefined(album)) {
        unqfy.addTrack(a.album, a);
        return `el track '${a.name}' del album '${a.album}', fue insertado correctamente.`;
      } else {
        return `error: el album '${a.album}' no existe.`;
      }
    }, ['name', 'duration', 'genre', 'album'], args);
    break;
  case 'help':
    help(process.argv[3]);
    break;
  case 'listAlbum':
    if (isNotEmpty(unqfy.allAlbums())) {
      console.log('Albums:\n');
      unqfy.allAlbums().forEach(a => console.log(`Nombre: ${a.name} Año: ${a.year} Artista: ${a.artistName}`));
    } else {
      console.log('No hay albums registrados.');
    }
    break;
  case 'listArtist':
    if (isNotEmpty(unqfy.artists)) {
      console.log('Artists:\n');
      unqfy.artists.forEach(a => console.log(a.toString()));
    } else {
      console.log('No hay artistas registrados.');
    }
    break;
  case 'listPlaylist':
    if (isNotEmpty(unqfy.playlists)) {
      console.log('Playlists:\n');
      unqfy.playlists.forEach(p => console.log(`Nombre: ${p.name}`));
    } else {
      console.log('no hay playlist registradas.');
    }
    break;
  case 'listTrack':
    const tracks = unqfy.listTracks();
    if (isNotEmpty(tracks)) {
      console.log(`Tracks (${tracks.length}):\n`);
      tracks.forEach(t => console.log(`Nombre: ${t.name} Duracion: ${t.duration} Album: ${t.album.name}`));
    } else {
      console.log('No hay tracks registrados.');
    }
    break;
  case 'listTrackByAlbum':
    runCommand(a => {
      const album = unqfy.getAlbumByName(a.name);
      if (isNotUndefined(album)) {
        console.log('Tracks:\n');
        album.tracks.forEach(t => console.log(`${t.name}`));
        return '\n';
      } else {
        return 'Album inexistente.';
      }
    }, ['name'], args);
    break;

  case 'listTrackByArtist':
    runCommand(a => {
      const artist = unqfy.getArtistByName(a.name);
      if (isNotUndefined(artist)) {
        const tracks = unqfy.getTracksMatchingArtist(a.name);
        if (isNotEmpty(tracks)) {
          console.log('Tracks:\n');
          tracks.forEach(t => console.log(`Nombre: ${t.name}`));
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
      const tracks = unqfy.getTracksMatchingGenres(a.genres.split(','));
      if (isNotEmpty(tracks)) {
        console.log('Tracks:\n');
        tracks.forEach(t => console.log(`${t.name}`));
        return '\n';
      } else {
        return `no hay tracks del genero: '${a.genres}'.`;
      }
    }, ['genres'], args);
    break;
  case 'removeAlbum':
    runCommand(a => {
      const album = unqfy.getAlbumByName(a.name);
      if (isNotUndefined(album)) {
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
      if (isNotUndefined(artist)) {
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
      if (isNotUndefined(p)) {
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
      if (isNotUndefined(track)) {
        unqfy.removeTrack(a.name);
        return `el track '${a.name}', fue eliminado correctamente.`;
      } else {
        return `error: el track '${a.name}' no existe.`;
      }
    }, ['name'], args);
    break;
  case 'searchAlbum':
    runCommand(a => {
      const albums = unqfy.searchAlbumByName(a.name);
      if (isNotEmpty(albums)) {
        albums.forEach(a => console.log(`Nombre: ${a.name}`));
        return '\n';
      } else {
        return 'No hay Albums para mostrar.';
      }
    }, ['name'], args);
    break;
  case 'searchArtist':
    runCommand(a => {
      const artists = unqfy.searchArtistByName(a.name);
      if (isNotEmpty(artists)) {
        artists.forEach(a => console.log(a.toString()));
        return '\n';
      } else {
        return 'No hay Artistas para mostrar.';
      }
    }, ['name'], args);
    break;
  case 'searchArtistById':
    runCommand(a => {
      const artists = unqfy.getArtistById(a.id);
      return artists.toString();
      //return 'Id inexistente.';
    }, ['id'], args);
    break;
  case 'searchPlaylist':
    runCommand(a => {
      const playlists = unqfy.searchPlaylistByName(a.name);
      if (isNotEmpty(playlists)) {
        console.log('PlayList: \n');
        playlists.forEach(p => console.log(`Nombre: ${p.name} cantidad de canciones: ${p.tracks.length}`));
        return '\n';
      } else {
        return 'No hay Playlists para mostrar.';
      }
    }, ['name'], args);
    break;
  case 'searchTrack':
    runCommand(a => {
      const tracks = unqfy.searchTrackByName(a.name);
      if (isNotEmpty(tracks)) {
        tracks.forEach(t => console.log(`Nombre: ${t.name}`));
        return '\n';
      } else {
        return 'No hay Tracks para mostrar.';
      }
    }, ['name'], args);
    break;
  default:
    console.log('error: el comando no es correcto');
  }
  saveUNQfy(unqfy, 'estado.json');
}

main();


