let express = require('express');
let app = express();
const fs = require('fs');
const unqmod = require('./unqfy');

let router = express.Router();

let port = process.env.PORT || 8080;        // set our port

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


router.use(function (req, res, next) {
    console.log('Request received!');
    next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

app.use('/api', router);
router.route('/artist').get(function (req, res) {
    if (req.query.name && req.query.country){
        let unqfy = getUNQfy('estado.json');
unqfy.addArtist(req.query);
        saveUNQfy(unqfy, 'estado.json');
        res.json({ message: 'okey' });
    }else{
        res.json({ message: 'Se esperaba: name, country ' });
}
});



app.listen(port);
console.log('Magic happens on port ' + port);