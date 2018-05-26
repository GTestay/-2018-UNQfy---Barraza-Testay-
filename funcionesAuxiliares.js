'use strict';

function generarDiccionario(array) {
  const dic = [];
  while (array.length > 0) {
    const param = array.shift();
    const value = array.shift();
    dic[param] = value;
  }
  return dic;
}

function isNotUndefined(value) {
  return value != undefined;
}


function isNotEmpty(array) {
  return array.length > 0;
}

function aplanar(array) {
  return array.reduce((arg1, arg2) => arg1.concat(arg2), []);
}

module.exports = {
  isNotUndefined,
  generarDiccionario,
  isNotEmpty,
  aplanar
};