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
          console.log(imageEl, ' pl');
          const delete_btn = imageEl.querySelector(".delete");
          delete_btn.addEventListener("click", () => {
            deleteFnc(image?.id);
          });

          const download_btn = imageEl.querySelector(".download");
          download_btn.addEventListener("click", () => {
            downloadFnc(image);
          })
        })
      }
    }

    let videoTransaction = db.transaction("video", "readonly"); // (1)
    // get an object store to operate on it
    let videoStore = videoTransaction.objectStore("video"); // (2)
    let videoReq = videoStore.getAll();
    videoReq.onsuccess = function () {
      if (videoReq.result != undefined) {
        console.log(videoReq.result, ' get images');
        const gallery_cont = document.querySelector(".gallery-cont");
        const videoResult = videoReq.result;
        videoResult.forEach((video) => {
          // console.log(image);
          const blobData = video?.blobData;
          const videoUrl = URL.createObjectURL(blobData);
          // const imageId = image?.id;
          const videoEl = document.createElement("div");
          videoEl.setAttribute("class", "media-cont")
          videoEl.innerHTML = `
          <div class="media">
          <video autoplay loop muted src="${videoUrl}"/>
          </div>
          <div class="cursor-pointer delete action-btn">DELETE</div>
          <div class="cursor-pointer download action-btn">DOWNLOAD</div>
          `;
          gallery_cont.append(videoEl);
          // console.log(videoEl,' pl');
          const delete_btn = videoEl.querySelector(".delete");
          delete_btn.addEventListener("click", () => {
            deleteFnc(video?.id, 'video');
          });

          const download_btn = videoEl.querySelector(".download");
          download_btn.addEventListener("click", () => {
            downloadFnc(video, 'video');
          })
        })
      }
    }
  }
}

function deleteFnc(mediaId, mediaType = 'image') {
  // console.log(mediaId,"delete fnc called");
  if (mediaType == 'image') {
    const imageTransaction = db.transaction("image", "readwrite"); // (1)
    const imageStore = imageTransaction.objectStore("image");
    imageStore.delete(mediaId);
  } else {
    const videoTransaction = db.transaction("video", "readwrite"); // (1)
    const videoStore = videoTransaction.objectStore("video");
    videoStore.delete(mediaId);
  }
  const gallery_cont = document.querySelectorAll(".gallery-cont > *");
  gallery_cont.forEach((mediaEl) => mediaEl.remove());
  dbCheck();
}

function downloadFnc(media, mediaType = 'image') {
  if (mediaType == 'image') {
    const imageUrl = media?.url;
    const imageLink = document.createElement("a");
    imageLink.href = imageUrl;
    imageLink.download = `img-${media?.id}.png`;
    imageLink.click();
  } else {
    const videoUrl = URL.createObjectURL(media?.blobData);
    const videoLink = document.createElement("a");
    videoLink.href = videoUrl;
    videoLink.download = `video-${media?.id}.mp4`;
    videoLink.click();
  }
}