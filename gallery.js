const back_btn = document.querySelector(".back");
back_btn.addEventListener("click", () => {
  console.log("ok")
  location.assign("./index.html");
});
// console.log(db);
setTimeout(dbCheck, 100);
function dbCheck() {
  console.log(db);
  if (db) {
    let imageTransaction = db.transaction("image", "readonly");
    // get an object store to operate on it
    let imageStore = imageTransaction.objectStore("image"); // (2)

    let imageReq = imageStore.getAll();
    imageReq.onsuccess = function () {
      if (imageReq.result != undefined) {
        console.log(imageReq.result, ' get images');
        const gallery_cont = document.querySelector(".gallery-cont");
        const imageResult = imageReq.result;
        imageResult.forEach((image) => {
          // console.log(image);
          const imageUrl = image?.url;
          // const imageId = image?.id;
          const imageEl = document.createElement("div");
          imageEl.setAttribute("class", "media-cont")
          imageEl.innerHTML = `
          <div class="media">
          <img src="${imageUrl}"/>
          </div>
          <div class="cursor-pointer delete action-btn">DELETE</div>
          <div class="cursor-pointer download action-btn">DOWNLOAD</div>
          `;
          gallery_cont.append(imageEl);
        })
      }
    }
  }
}