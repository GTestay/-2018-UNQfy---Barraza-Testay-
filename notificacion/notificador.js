const picklejs = require('picklejs');
const {MailSender} = require('./mailSender');
const rp = require('request-promise');
const { ResourceNotFound} = require('./Excepciones');


class Artist {
  constructor(id){
    this.artistId = id || 0;
    this.emails = [];
  }

  addEmail(email){
    this.emails.push(email);
  }


  removeEmail(email){
    this.emails = this.emails.filter(e => e !== email);
  }
}

class Notificador {

  constructor(){
    this.mailSender = new MailSender();
    this.artists = [];
  }


  notify(artistId,subject,message,from){
    const artist =this.find(artistId);
    if(undefined === artist){
      throw new ResourceNotFound();
    }
    this.mailSender.sendMail(artist,subject,message,from)
      .catch(err => {
        console.error(err);
      });
  }

  subscribe(email,artistId){
    let artist = this.find(artistId);

    if(artist === undefined){
      artist = new Artist(artistId);
      this.artists.push(artist);

    }
    artist.addEmail(email);
    console.log(artist);

  }


  unsubscribe(artistId,email){

    let artist = this.find(artistId);

    if(artist === undefined){
      artist = new Artist(artistId);
      this.artists.push(artist);

    }
    artist.removeEmail(email);
  }

  find(artistId){

    return this.artists.find(a => a.artistId == artistId);
  }

  subscriptions(artistId){
    const artist = this.find(artistId);
    if(undefined !== artist){
      return artist.emails ;
    }else{
      throw new ResourceNotFound();
    }
  }

  removeArtist(artistId){
    this.artists = this.artists.filter(a => a.artistId !== artistId);
  }


  //Persistence
  save(filename = 'notificador.json') {
    new picklejs.FileSerializer().serialize(filename, this);
  }

  static load(filename = 'notificador.json') {
    const fs = new picklejs.FileSerializer();
    const classes = [MailSender,Notificador,Artist];
    fs.registerClasses(...classes);
    return fs.load(filename);
  }

}

class ApiUnqfy {
  constructor(){
    this.route = 'http://localhost';
    this.port = process.env.UNQFY_PORT ;

  }
  options(endpoint) {
    return {
      uri: this.generateUrl(endpoint),
      json: true
    };
  }

  generateUrl(endpoint) {
    return `${this.route}:${this.port}/api/${endpoint} `;
  }

  artistExist(artistId){
    const options = this.options(`artists/${artistId}`);
    console.log('Buscando Artista');

    return rp.get(options).then(artist=>{
      console.log('Artista Encontrado');
      return true;
    })
      .catch(err => {
        console.log('Artista no existe');
        return false;
      });
  }

}


module.exports={Notificador,ApiUnqfy};