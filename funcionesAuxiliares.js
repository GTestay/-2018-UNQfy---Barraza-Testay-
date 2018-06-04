'use strict';
const fs = require('fs');

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


function generateToken(jsonPath) {

  const filepath = jsonPath;
  if (fs.existsSync(filepath)) {
    console.log('Leyendo Token');
    let unToken = fs.readFileSync(filepath).toString();
    return JSON.parse(unToken);
  } else {
    throw new Error('ARCHIVO INEXISTENTE');
  }
}

module.exports = {
  isNotUndefined,
  generarDiccionario,
  generateToken,
  compareStrings,
  isNotEmpty,
  aplanar,
  print,
  printArray
};