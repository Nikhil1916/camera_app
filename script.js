const image_btn = document.querySelector(".image-btn");
const record_btn = document.querySelector(".record-btn");
const timer = document.querySelector(".timer");
const video = document.querySelector("video");
let timerIntervalId;
const allFilters = document.querySelectorAll(".filter");

const constraints = {
  audio: false,
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
  let canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  let ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageUrl = canvas.toDataURL('image/jpeg');
  const imageLink = document.createElement("a");
  imageLink.href = imageUrl;
  console.log(imageUrl);
  imageLink.download = "myImg.jpeg";
  imageLink.click();
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
  let counter = 3590;
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
allFilters.forEach((filter) => {
  filter.addEventListener("click", function (e) {
    console.log(filter);
    // when we add filter bg-color as canvas takes a screenshot and creates puckture so our filter will also come with that
  })
})