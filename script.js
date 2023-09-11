const uid = new ShortUniqueId();
const image_btn = document.querySelector(".image-btn");
const record_btn = document.querySelector(".record-btn");
const timer = document.querySelector(".timer");
const video = document.querySelector("video");
const filter_layer = document.querySelector(".filter-layer");
let timerIntervalId;
const allFilters = document.querySelectorAll(".filter");
let filterColor = "transparent";
const gallery_cont = document.querySelector(".gallery-cont");

const constraints = {
  audio: true,
  video: true
}

// this will store video media stream
const chunks = [];
let mediaRecorder;

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  video.srcObject = stream;
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.addEventListener("start", () => {
    console.log("reco starting");
  });
  mediaRecorder.addEventListener("dataavailable", function (e) {
    console.log("data avail");
    chunks.push(e.data);
    // single blob created or video created
  })

  mediaRecorder.addEventListener("stop", () => {
    console.log("rec stop");
    // console.log(chunks.length);
    let blob = new Blob(chunks, { mimeType: "video/mp4" });
    let videoUrl = URL.createObjectURL(blob);
    if (db) {
      let videoID = uid.rnd();
      let dbTransaction = db.transaction("video", "readwrite");
      let videoStore = dbTransaction.objectStore("video");
      let videoEntry = {
        id: videoID,
        blobData: blob,
        updatedAt: new Date()
      };
      let addRequest = videoStore.add(videoEntry);
      addRequest.onsuccess = function () {
        console.log(
          "videoEntry added to the videoStore",
          addRequest.result
        );
      };

    }
    // const videoLink = document.createElement("a");
    // videoLink.href = videoUrl;
    // console.log(videoUrl);
    // videoLink.download = "myVideo.mp4";
    // videoLink.click();
  });
})

image_btn.addEventListener("click", function () {
  image_btn.classList.add("scale-capture");
  let canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  let ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // jb image add krenge canvas pe to filter color bhi chahiye as vo sirf vido ka dekh rha aur uska screenshot lega to alag se usme color fill krna pdega
  ctx.fillStyle = filterColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);


  const imageUrl = canvas.toDataURL('image/jpeg');
  if (db) {
    let transaction = db.transaction("image", "readwrite");
    // get an object store to operate on it
    let imageStore = transaction.objectStore("image"); // (2)
    let imageEntry = {
      id: uid.rnd(),
      url: imageUrl,
      updatedAt: new Date()
    };
    let request = imageStore.add(imageEntry); // (3)

    request.onsuccess = function () { // (4)
      console.log("image added to the store", request.result);
    };

    request.onerror = function () {
      console.log("Error", request.error);
    };
  }
  setTimeout(() => {
    image_btn.classList.remove("scale-capture");
  }, 1000)
})


let isRecord = false;
record_btn.addEventListener("click", function () {
  if (!isRecord) {
    mediaRecorder.start();
    record_btn.classList.add("scale-record");
    timer.style.display = "block";
    startTimer();
  } else {
    mediaRecorder.stop();
    record_btn.classList.remove("scale-record");
    timer.style.display = "none";
    stopTimer();
  }
  isRecord = !isRecord;
})

function startTimer() {
  let counter = 0;
  timerIntervalId = setInterval(() => {
    counter++;
    let totalSecs = counter;
    let hrs = parseInt(totalSecs / 3600);
    totalSecs = parseInt(totalSecs % 3600);
    let mins = parseInt(totalSecs / 60);
    totalSecs = parseInt(totalSecs % 60);
    let secs = totalSecs;
    hrs = hrs < 10 ? `0${hrs}` : hours;
    mins = mins < 10 ? `0${mins}` : mins;
    secs = secs < 10 ? `0${secs}` : secs;
    timer.innerHTML = hrs + ':' + mins + ':' + secs;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerIntervalId);
  timer.innerHTML = "00:00:00";
}
// console.log(allFilters);
allFilters.forEach((filterEle) => {
  filterEle.addEventListener("click", function (e) {
    // when we add filter bg-color as canvas takes a screenshot and creates puckture so our filter will also come with that

    //as eg orabge vli class ka background color chahiye
    filterColor = window.getComputedStyle(filterEle).getPropertyValue('background-color');
    filter_layer.style.backgroundColor = filterColor;
  })
});

gallery_cont.addEventListener("click", () => {
  location.assign("./gallery.html");
})