function loadDoc(url1,callback) {

  // console.log("here")
 var Aj = $.ajax({
  url: url1,
  //success: callback(),
  cache: false,
  crossDomain:true,
  success: callback/*function(html,callback){
  	//foo(html);
    //$("#results").append(html);
    //console.log(html);
    var el = document.createElement( 'html' );
el.innerHTML = html;
var dataTable = el.getElementsByTagName("TABLE");

var obj = [];
var temp = dataTable.results.rows;
var keys = {"0":temp[0].cells[0].innerText,"1":temp[0].cells[1].innerText,"2":temp[0].cells[2].innerText,"3":temp[0].cells[3].innerText};
var cin = temp[0].cells[0].innerText;
var name = temp[0].cells[1].innerText;
var country = temp[0].cells[2].innerText;
var address = temp[0].cells[3].innerText;
for( var i=1;i<temp.length;i +=1)
{
 	obj.push({
       cin: temp[i].cells[0].innerText,
       name: temp[i].cells[1].innerText,
       country: temp[i].cells[2].innerText,
       address: temp[i].cells[3].innerText
     });

   }
   //console.log("in-")
   //console.log(obj);
   return obj;
//console.log(dataTable.results.rows.length);
  }*/
})

}

// Create the XHR object.
// function createCORSRequest(method, url) {
//   var xhr = new XMLHttpRequest();
//   if ("withCredentials" in xhr) {
//     // XHR for Chrome/Firefox/Opera/Safari.
//     xhr.open(method, url, true);
//   } else if (typeof XDomainRequest != "undefined") {
//     // XDomainRequest for IE.
//     xhr = new XDomainRequest();
//     xhr.open(method, url);
//   } else {
//     // CORS not supported.
//     xhr = null;
//   }
//   return xhr;
// }
//
// // Helper method to parse the title tag from the response.
// function getTitle(text) {
//   return text.match('<title>(.*)?</title>')[1];
// }
//
// // Make the actual CORS request.
// function makeCorsRequest() {
//   // All HTML5 Rocks properties support CORS.
//   var url = 'http://updates.html5rocks.com';
//
//   var xhr = createCORSRequest('GET', url);
//   if (!xhr) {
//     alert('CORS not supported');
//     return;
//   }
//
//   // Response handlers.
//   xhr.onload = function() {
//     var text = xhr.responseText;
//     var title = getTitle(text);
//     alert('Response from CORS request to ' + url + ': ' + title);
//   };
//
//   xhr.onerror = function() {
//     alert('Woops, there was an error making the request.');
//   };
//
//   xhr.send();
// }
//makeCorsRequest()