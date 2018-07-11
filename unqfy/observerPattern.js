class Subject {

  constructor() {
    this.observers = [];
  }

  addObserver(anObserver) {
    if (!this.observers.includes(anObserver)) {
      this.observers.push(anObserver);
    }
  }

  removeObserver(anOsberverToRemove) {
    this.observers = this.observers.filter((observer) => observer !== anOsberverToRemove);
  }

  changed(something, data) {
    this.observers.forEach(observer => observer.update(something, data));
  }
}

class Observer {

  update(something, data) {

    throw Error('Need to be redefined by all sub-clases');

  }
}

module.exports = {
  Subject, Observer
};