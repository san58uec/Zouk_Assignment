const firebase = require('firebase')
const xlsx = require('node-xlsx')

// Initialize Firebase
var config = {
  databaseURL: "https://mca-keys.firebaseio.com",
  serviceAccount: __dirname + "/mca-keys-9740ed7733b6.json"
}

var app = firebase.initializeApp(config)
var db = firebase.database()
var ref = db.ref('data')

var workSheetsFromFile = xlsx.parse(__dirname + '/company_master_data_mar_2015_Uttar_Pradesh.xlsx');
var data = workSheetsFromFile[0].data

var colnames = data[0]

// console.log(val)
for (var i = 1 ; i < 1000 ; i += 1) {
  console.log(i)
  var val = data[i]
  var key = val[0]
  var ob = {}
  for (var j = 0 ; j < colnames.length ; j += 1) {
    ob[colnames[j]] = val[j]
  }
  // key: ob
  try {
    ref.child(key).set(ob, function (err) {
      if (err) console.log('can\'t add ' + i)
    })
  } catch (e) {
    // ...
  }
}

console.log('done')
