# -2018-UNQfy---Barraza-Testay-
## Trabajo Práctico de Seminario - Taller de Servicios Web, Universidad Nacional de Quilmes.


### Funcionamiento:

para utilizar unqfy mediante node ejecutar los siguientes commandos en consola.

node main.js <comando> <parametros con argumentos>
nota: los argumentos pueden pasarse en diferente orden, ejemplo:
node main.js addArtist name "Pepito" country "Argentina"
o:
node main.js addArtist country "Argentina" name "Pepito"

En Caso que algún argumento faltara será notificado vía consola, ejemplo:
node main.js addArtist 
--> se esperaba: name, Country.

---------- comandos disponibles: ----------

Muestra los comandos disponibles.
```
node main.js help 
```
Ayuda sobre ese comando.
```
node main.js help <comando>
```

Crea un artista y lo agrega a unqfy.
```
node main.js addArtist name "Pepito" country "Argentina"
```

Crea un album y lo agrega a su respectivo dueño.
```
node main.js addAlbum name "YLosCronoSaurios" year 2018 artist "Pepito"
```

Crea una cancion y la agrega al album.
```
node main.js addTrack name "Crono" duration 200 genre "pop" album "YLosCronoSaurios"
```

Crea una playlist con canciones de ese género; Los generos deben estar separados por comas y sin espacios.

```
node main.js addPlaylist name "Sauriotron" duration 1000 genres "rock,pop"
```

Lista todos los artistas.

```
node main.js listArtist 
```
Lista todos los albumnes. 

```
node main.js listAlbum 
```
Lista todos los playlist registrados.

```
node main.js listPlaylist
```
Lista todas las canciones registradas.

```
node main.js listTrack 
```
Lista todas las canciones de un artista.

```
node main.js listTrackByArtist  name "Pepito"
```
Lista todas las canciones de un album.

```
node main.js listTrackByAlbum  name "YLosCronoSaurios"
```
Lista todas las canciones de un o unos generos. Los generos deben estar separados por comas y sin espacios.

```
node main.js listTrackByGenre genres "rock"
```
Busca y muestra la información de dicho artista.

```
node main.js searchArtist name "Pepito"
```
Busca y muestra la información del album con ese nombre.

```
node main.js searchAlbum name "YLosCronoSaurios"
```

Busca y muestra la información de la cancion con ese nombre.

```
node main.js searchTrack name "Crono"
```

Información sobre la playlist indicada.
```
node main.js searchPlaylist name "Sauriotron"
```

Elimina al artista y todas sus canciones.

```
node main.js removeArtist name "Pepito"
```
Elimina un album especifico y sus canciones.

```
node main.js removeAlbum name "YLosCronoSaurios"
```
Elimina una playlist.

```
node main.js removePlaylist name "Sauriotron"
```
Elimina una canción.we
```
node main.js removeTrack name "Crono"
```
