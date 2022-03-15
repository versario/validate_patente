const express = require('express');
const serverless = require('serverless-http');
const letterValues = require('./db/letterValues.json');

const app = express();
app.use(express.json());

app.post('/validatePatente', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  try {
    var { patente, dv } = req.body;
    var status;
    var description;
    patente = patente.toUpperCase();
    var format = getFormat(patente);
    if (format) {
      var numericValues = getNumericValues(patente, format);
      var calculatedDv = getDv(numericValues, format);
      if (dv.toString() === calculatedDv) {
        status = "Ok";
        description = "Patente válida";
      } else {
        status = "Bad";
        description = "Patente inválida";
      }
    } else {
      status = "Bad";
      description = "Formato de patente inválido";
    } 
    res.status(200).send({"status": status, "description": description});
  } catch(err) {
    res.status(500).send({"status": "Bad", "description": "Se ha producido un problema: " + err});
  }
});

const getDv = (nums, format) => {
  if (format === "LLLL.NN" || format === "LLL.NNN") {
    let sp =
        nums[ 5 ] * 2 +
        nums[ 4 ] * 3 +
        nums[ 3 ] * 4 +
        nums[ 2 ] * 5 +
        nums[ 1 ] * 6 +
        nums[ 0 ] * 7;
    let r = sp % 11;
    if (r === 0) return "0";
    let rv = 11 - r;
    if (rv === 10) return "K";
    return rv.toString();
  }
  if (format === "LL.NNNN") {
    let s =
      nums[ 6 ] * 2 +
      nums[ 5 ] * 3 +
      nums[ 4 ] * 4 +
      nums[ 3 ] * 5 +
      nums[ 2 ] * 6 +
      nums[ 1 ] * 7 +
      nums[ 0 ] * 2;
    let ri = s % 11;
    let rf = 11 - ri;
    if (rf === 11) return "0";
    if (rf === 10) return "K";
    if (rf < 10) return rf.toString();
  }
};

const getFormat = (patente) => {
  if (patente.search(/^[A-Z][A-Z][A-Z][A-Z]\d\d$/) != -1) return "LLLL.NN";
  if (patente.search(/^[A-Z][A-Z][A-Z]\d\d\d$/) != -1) return "LLL.NNN";
  if (patente.search(/^[A-Z][A-Z]\d\d\d\d$/) != -1 ) return "LL.NNNN";
  return;
};

const getNumericValues = (patente, format) => {
  var letters;
  var numbers;
  var lettersLength;
  var result = [];
  if (format === "LLLL.NN" || format === "LLL.NNN") {
    lettersLength = (format === "LLLL.NN") ? 4 : 3;
    letters = patente.substring(0, lettersLength).split("");
    numbers = patente.substring(lettersLength, patente.length).split("");
    letters.forEach(letter => {
      result.push(findNumericValue(letter));
    });
  }
  if (format === "LL.NNNN") {
    numbers = patente.substring(2,patente.length).split("");
    var numericValue = findNumericValue(patente.substring(0,2)).split("");
    numericValue.forEach(num => {
      result.push(num);
    });
  }
  return result.concat(numbers);
};

const findNumericValue = (letter) => {
  for(var key in letterValues) {
    if(key === letter) return letterValues[key];
  }
};

module.exports.handler = serverless(app);