const picklejs = require('picklejs');

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

    this.artists = [];
    //this.mailSender = null;
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

    return artist.emails ;
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
    const classes = [Notificador,Artist];
    fs.registerClasses(...classes);
    return fs.load(filename);
  }

}



module.exports={Notificador};