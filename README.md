# -2018-UNQfy---Barraza-Testay-
Trabajo Práctico de Seminario - Taller de Servicios Web, Universidad Nacional de Quilmes.


Funcionamiento:

para utilizar unqfy mediante node ejecutar los siguientes commandos en consola.

node main.js <comando> <parametros con argumentos>

node main.js help 
| muestra los comandos disponibles.

node main.js help <comando>
| ayuda sobre ese comando.

node main.js addArtist name unNombre country unPais 
| crea un artista y lo agrega a unqfy

node main.js addAlbum name unNombre year unAño artist unArtista 
| crea un album y lo agrega a su respectivo dueño.

node main.js addPlaylist name unNombre duration unaDuracion genres "generos en ca de na dos" 
| crea un artista y lo agrega a unqfy

node main.js addTrack name unNombre duration unaDuracion genre genero album unAlbum 
| crea una cancion y la agrega al album.

node main.js listArtist 
| lista todos los artistas.

node main.js listAlbum 
| lista todos los albumnes. 

node main.js listTrack 
| lista todas las canciones de unqfy..

node main.js listTrackByArtist  name unNombre
| lista todas las canciones de un artista.

node main.js listTrackAlbum  album unAlbum
| lista todas las canciones de un album.

node main.js listTrackByGenre genre unGenero 
| lista todas las canciones de un genero.

node main.js searchArtist name unNombre 
| busca el artista con ese nombre. 

node main.js searchAlbum name unNombre 
| busca el album con ese nombre.

node main.js searchTrack name unNombre 
| busca la cancion con ese nombre.

node main.js searchPlaylist name unNombre 
| busca la playlist con ese nombre.

