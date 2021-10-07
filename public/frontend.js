let resultDiv = document.getElementById("results");

let myRequest = new Request('/memes');

fetch(myRequest)
.then(function(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
})
.then(function(response) {
  console.log(response);
  // let objectURL = URL.createObjectURL(response);
  // myImage.src = objectURL;
});