
class Subject {

  constructor(){
    this.observers = [];
  }

  addObserver(anObserver){
    this.observers.push(anObserver);
  }

  removeObserver(anOsberverToRemove) {
    this.observers = this.observers.filter((observer) => observer !== anOsberverToRemove);
  }
  updateAll(something,someData){
    this.observers.forEach(observer => observer.update(something,someData));
  }
}

class Observer{

  update(something,someData){

    throw Error('Need to be redefined by all sub-clases');

  }
}

module.exports = {
  Subject,Observer
};