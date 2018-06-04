'use strict';

function generarDiccionario(array) {
  const dic = [];
  while (isNotEmpty(array)) {
    const param = array.shift();
    const value = array.shift();
    dic[param] = value;
  }
  return dic;
}

function compareStrings(str1, str2) {
  //chequea por identidad y luego por inclusion.
  return str1 == str2 || str1.toLocaleLowerCase().includes(str2.toLocaleLowerCase());
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

function print(anObject) {
  console.log(anObject.toString());
}

function printArray(anArray) {
  anArray.forEach(a => {
    print(a);
  });
}


module.exports = {
  isNotUndefined,
  generarDiccionario,
  compareStrings,
  isNotEmpty,
  aplanar,
  print,
  printArray
};