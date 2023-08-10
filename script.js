const image_btn = document.querySelector(".image-btn");
const record_btn = document.querySelector(".record-btn");
const timer = document.querySelector(".timer");
const video = document.querySelector("video");

const constraints = {
  audio: false,
  video: true
}

// this will stor video media stream
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
    console.log(chunks.length);
    let blob = new Blob(chunks, { mimeType: "video/mp4" });
    let videoUrl = URL.createObjectURL(blob);
    const videoLink = document.createElement("a");
    videoLink.href = videoUrl;
    console.log(videoUrl);
    videoLink.download = "myVideo.mp4";
    videoLink.click();
  });
})

image_btn.addEventListener("click", function () {
  image_btn.classList.add("scale-capture");
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
    setTimer();
  } else {
    mediaRecorder.stop();
    record_btn.classList.remove("scale-record");
    timer.style.display = "none";
  }
  isRecord = !isRecord;
})

function setTimer() {
  let counter = 0;
  setInterval(() => {
    let hrs = "00";
    let mins = "00";
    let secs = "00";
    counter++;
    let count = counter;
    console.log(count);
    if (count > 3600) {
      if (count / 3600 > 9) {
        hrs = parseInt(count / 3600);
      } else {
        hrs = "0" + parseInt(count / 3600);
      }
      count = parseInt(count % 3600);
    }


    if (count > 60) {
      if (count / 60 > 9) {
        mins = parseInt(count / 60);
      } else {
        mins = "0" + parseInt(count / 60);
      }
      count = parseInt(count % 60);
    }


    if (count > 0) {
      secs = count % 60;
      if (count > 9) {
        secs = count;
      } else {
        secs = "0" + count;
      }
    }
    console.log(hrs + ':' + mins + ':' + secs);
    timer.innerHTML = hrs + ':' + mins + ':' + secs;
  }, 1000)
}