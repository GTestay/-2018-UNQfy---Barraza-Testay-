# -2018-UNQfy---Barraza-Testay-
Trabajo Práctico de Seminario - Taller de Servicios Web, Universidad Nacional de Quilmes.


Funcionamiento:

para utilizar unqfy mediante node ejecutar los siguientes commandos en consola.

node main.js <comando> <parametros con argumentos>

node main.js help 
| muestra los comandos disponibles.

node main.js help <comando>
| ayuda sobre ese comando.

node main.js addArtist name Pepito country Argentina
| crea un artista y lo agrega a unqfy

node main.js addAlbum name YLosCronoSaurios year 2018 artist Pepito
| crea un album y lo agrega a su respectivo dueño.

node main.js addPlaylist name Sauriotron duration 1000 genres "rock,pop"
| crea una playlist con canciones de ese género; Los generos deben estar separados por comas y sin espacios.

node main.js addTrack name Crono duration 200 genre pop album YLosCronoSaurios
| crea una cancion y la agrega al album.

node main.js listArtist 
| lista todos los artistas.

node main.js listAlbum 
| lista todos los albumnes. 

node main.js listTrack 
| lista todas las canciones registradas.

node main.js listTrackByArtist  name Pepito
| lista todas las canciones de un artista.

node main.js listTrackByAlbum  name YLosCronoSaurios
| lista todas las canciones de un album.

node main.js listTrackByGenre genres "rock"
| lista todas las canciones de un o unos generos. Los generos deben estar separados por comas y sin espacios.

node main.js searchArtist name Pepito
| Búsca y muestra la información de dicho artista.

node main.js searchAlbum name YLosCronoSaurios
| busca y muestra la información del album con ese nombre.

node main.js searchTrack name Crono
| busca y muestra la información de la cancion con ese nombre.

node main.js searchPlaylist name Sauriotron
| información sobre la playlist indicada.

node main.js removeArtist name Pepito
| elimina al artista y todas sus canciones.

node main.js removeAlbum name YLosCronoSaurios
| elimina un album especifico y sus canciones.

node main.js removePlaylist name Sauriotron
| elimina una playlist.

node main.js removeTrack name Crono
| elimina una cancion.