

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

function runCommand(UNQfy, func, params, args, message) {
  if(params.every(p => isNotUndefined(args[p]))) {
    UNQfy[func](args);
    console.log(message);
  } else {
    console.log("error: se esperaba los siguientes parametros: "+params);
  }
}

function main() {
  let unqfy = getUNQfy('estado.json');
  let comando = process.argv[2];
  let args = generarDiccionario(process.argv.slice(3));
  
  switch(comando) {
  case "addArtist":
    runCommand(unqfy, comando, ["name", "country"], args, "el artista fue insertado exitosamente");
  case "help":
    help(process.argv[3]);
  break;
  default:
  console.log("error: el comando no es correcto");
  }
  
  saveUNQfy(unqfy, 'estado.json');
}

main();


