// js info demo 
let openRequest = indexedDB.open("myDatabase");
let db;
// console.log("okoko");
// events to be fired write like this or regular way open.addEventListener("upgradeneeded",()=>{})
openRequest.onupgradeneeded = function () {
  // triggers if the client had no database
  // ...perform initialization...
  console.log("db upgraded OR initalisation in db ");
  db = openRequest.result;
  db.createObjectStore("video", { keyPath: 'id' });
  db.createObjectStore("image", { keyPath: 'id' });
};

openRequest.onerror = function () {
  console.error("Error", openRequest.error);
};

openRequest.onsuccess = function () {
  console.log("connection succesful");
  db = openRequest.result;
  // continue working with database using db object
}; 