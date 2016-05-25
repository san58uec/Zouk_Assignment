var config = {
  apiKey: "AIzaSyB9FSQ1qjvKlFn2WF6nMtAf5PEWdcf8hYo",
  authDomain: "mca-keys.firebaseapp.com",
  databaseURL: "https://mca-keys.firebaseio.com",
  storageBucket: ""
}

var dbref = null
var db = null
var limit = 10
var prevlimit = 5

var historydb = null
var prevsearch = null

var auth = null

var lastCallback = null

var sug = null
var q = null
var submit = null
var table = null
var formsContainer = null
var signupform = null
var signupemail = null
var signuppassword = null
var signinform = null
var signinemail = null
var signinpassword = null
var userDataContainer = null
var userEmail = null
var logout = null
var searchContainer = null
var prevsearches = null

var pq = null
var idSelected = null

var user = null
var signedin = false


function createValCallback (prefix, cb) {

  return function (snap) {
    var obj = []
    var url = "http://cors.io/?u=http://www.zaubacorp.com/companysearchresults/"+prefix
        loadDoc(url,function(data){
var el = document.createElement( 'html' )
el.innerHTML = data
var dataTable = el.getElementsByTagName("TABLE")


var temp = dataTable.results.rows
var keys = {"0":temp[0].cells[0].innerText,"1":temp[0].cells[1].innerText,"2":temp[0].cells[2].innerText,"3":temp[0].cells[3].innerText};
var cin = temp[0].cells[0].innerText
var name = temp[0].cells[1].innerText
var country = temp[0].cells[2].innerText
var address = temp[0].cells[3].innerText
for( var i=1;i<temp.length;i +=1)
{
  obj.push({
       cin: temp[i].cells[0].innerText,
       name: temp[i].cells[1].innerText,
       country: temp[i].cells[2].innerText,
       address: temp[i].cells[3].innerText
     })

   }
   //console.log("in-")
   cb(obj,prefix)
    })
    
  
  }
}

function find (prefix, callback) {
  console.log(prefix)
  if (idSelected) idSelected = null

  if (lastCallback) {
    db.off('value', lastCallback)
  }

  
  lastCallback = createValCallback(prefix, callback)
  db.startAt(prefix.toUpperCase())
    .limitToFirst(limit)
    .on('value', lastCallback)
}

function clickhandler (e) {
  e.preventDefault()

  var val = e.target.innerHTML
  // console.log(val)
  q.value = val
  idSelected = e.target.getAttribute('data-id')
  sug.innerHTML = ''

  return false
}

function createEl (text, id) {
  var p = document.createElement('p')
  var el = document.createElement('a')
  el.href = '#'
  el.innerHTML = text
  el.onclick = clickhandler
  el.setAttribute('data-id', id)
  p.appendChild(el)
  return p
}

function showSuggestions (obj,prefix) {
   console.log(obj)
      var x = []

    
    for (var k = 0; k < obj.length ; k += 1) {
      var name = obj[k]['name']
      if (obj[k]['name'].indexOf(prefix.toUpperCase()) == 0) {
        x.push({
          name: obj[k]['name'],
          id: obj[k]['CIN']
        })
      }
    }
    console.log(x)
    x.sort( function(a,b)
    {
      return a.name < b.name;
    })
  for (var i = 0 ; i < x.length ; i += 1) {
    // console.log(el)
    sug.appendChild(createEl(x[i].name, x[i].id))
  }
}

function showTabularData (data) {
  table.innerHTML = ''

  var createColumn = function (text) {
    var el = document.createElement('td')
    el.innerHTML = text
    return el
  }

  var createRow = function (key, val) {
    var tr = document.createElement('tr')
    tr.appendChild(createColumn(key))
    tr.appendChild(createColumn(val))
    return tr
  }

  for (var k in data) {
    table.appendChild(createRow(k, data[k]))
  }
}

function companyDetail(cin,name,flag)
  {
    console.log(cin)
    console.log(name)
     var url = "http://cors.io/?u=http://www.zaubacorp.com/company/"+name+"/"+cin
        loadDoc(url,function(data){

        var el = document.createElement( 'html' );
el.innerHTML = data;
var dataTable = el.getElementsByTagName("TABLE");

 console.log(dataTable[0].rows)
 
 var obj =[]

  var temp = dataTable[0].rows

  for( var i = 0; i < temp.length ; i += 1 )
  {

  obj[temp[i].firstChild.innerText] = temp[i].lastChild.innerText
    
  }

        showTabularData(obj)
      if( flag)
      addToHistory(name, cin)

      idSelected = null
      q.val = null


        })

  }


function addPrevSearch (text, id) {
  var el = document.createElement('a')
  el.href = '#'
  el.innerHTML = text
  el.onclick = function (e) {
    e.preventDefault()
    text = text.replace(/[^A-Z0-9]/ig, "-")
    companyDetail(id,text,0)
    return false
  }
  prevsearches.appendChild(el)
}
function createPrevSearches (val) {
  prevsearches.innerHTML = ''

  var a = []
  for (var k in val) {
    a.push({
      id: k,
      v: val[k]
    })
  }

  a.sort(function (a, b) {
    return a.id < b.id
  })

  for (var i = 0 ; i < a.length ; i += 1) {
    addPrevSearch(a[i].v.val, a[i].v.id)
  }
}

function onsignin () {
  // console.log(user.uid)
  signedin = true
  formsContainer.style.display = 'none'
  userDataContainer.style.display = ''
  searchContainer.style.display = ''
  userEmail.innerHTML = user.email

  dbref.ref('history/' + user.uid)
    .orderByKey()
    .limitToLast(prevlimit)
    .once('value')
    .then(function (snap) {
      createPrevSearches(snap.val())
    })
}

function onsignout () {
  // console.log(user)
  signedin = false
  formsContainer.style.display = ''
  userDataContainer.style.display = 'none'
  searchContainer.style.display = 'none'
  userEmail.innerHTML = ''
}

function signup (e, p) {
  // console.log(e)
  // console.log(p)
  auth.createUserWithEmailAndPassword(e, p).catch(function (err) {
    throw err
  })
}

function signout () {
  auth.signOut().then(onsignout).catch(function (err) {
    throw err
  })
}

function signin (e, p) {
  auth.signInWithEmailAndPassword(e, p).catch(function (err) {
    throw err
  })
}

function addToHistory (val, id) {
  if (val != prevsearch) {
    // console.log(val)
    prevsearch = val
    var uid = user.uid
    dbref.ref('history/' +uid)
    .orderByKey()
    .limitToLast(prevlimit)
    .once('value')
    .then(function (snap) {
      var data = snap.val()
    var flag = 0
    for( var k in data)
    {
      console.log(data[k].id)
      if(data[k].id.localeCompare(id)==0)
        {
          console.log("baraba")
          flag =1
          break
        }
    }
  if( flag == 0)
  {
    dbref.ref('history/' + uid + '/' + Date.now()).set({
      id: id,
      val: val
    })
  }
})
}
}


function onLoad () {
  // Initialize Firebase
  firebase.initializeApp(config)

  dbref = firebase.database()
  db = dbref.ref('data').orderByChild('COMPANY_NAME')

  auth = firebase.auth()

  sug = document.querySelector('.suggestions')
  q = document.querySelector('#q')
  submit = document.querySelector('#submit')
  table = document.querySelector('.table tbody')
  formsContainer = document.querySelector('#formsContainer')

  signupform = document.querySelector('#signupform')
  signupemail = signupform.querySelector('#signupemail')
  signuppassword = signupform.querySelector('#signuppassword')

  signinform = document.querySelector('#signinform')
  signinemail = signinform.querySelector('#signinemail')
  signinpassword = signinform.querySelector('#signinpassword')

  userDataContainer = document.querySelector('#userContainer')
  userEmail = userDataContainer.querySelector('p')
  logout = userDataContainer.querySelector('a')

  searchContainer = document.querySelector('#searchContainer')

  prevsearches = document.querySelector('#prevsearches')
  auth.onAuthStateChanged(function (u) {
    if (u) {
      // already signed in
      user = u
      onsignin()
    } else {
      // not signed in
    }
  })
   //var obj1 = loadDoc("ab");
   //console.log(obj1);
    // var obj1 = makeCorsRequest("ab");
    // console.log(obj1);
  q.addEventListener('keyup', function (e) {
    sug.innerHTML = ''
    var prefix = e.target.value
    if (prefix != null && prefix != '' && prefix != pq) {
      // console.log(prefix)
      find(prefix, showSuggestions)

      pq = prefix
    }
  })

  submit.addEventListener('click', function () {
    var val = q.value
    console.log(val)
    val = val.replace(/[^A-Z0-9]/ig, "-")
    console.log(val)
    var obj = []
    var url = "http://cors.io/?u=http://www.zaubacorp.com/companysearchresults/"+val

        loadDoc(url,function(data){
    var el = document.createElement( 'html' )
    el.innerHTML = data
    var dataTable = el.getElementsByTagName("TABLE")
    console.log(dataTable)
    console.log(url)
    var temp = dataTable.results
    var cin = temp.rows[1].cells[0].innerText
    var name = temp.rows[1].cells[1].innerText
    companyDetail(cin,name,1)
  })
      })

  signupform.addEventListener('submit', function (e) {
    e.preventDefault();
    signup(signupemail.value, signuppassword.value)
    return false
  })

  signinform.addEventListener('submit', function (e) {
    e.preventDefault();
    signin(signinemail.value, signinpassword.value)
    return false
  })

  logout.addEventListener('click', function (e) {
    e.preventDefault()
    signout()
    return false
  })
}

window.addEventListener('load', onLoad)
