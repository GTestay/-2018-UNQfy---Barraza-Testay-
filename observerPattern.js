
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
  updateAll(someData){
    this.observers.forEach(observer => observer.update(someData));
  }
}

class Observer{

  update(someData){

    throw Error('Need to be redefined by all sub-clases');

  }
}

module.exports = {
  Subject,Observer
};