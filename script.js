const image_btn = document.querySelector(".image-btn");
const record_btn = document.querySelector(".record-btn");
const timer_cont = document.querySelector(".timer-cont");
image_btn.addEventListener("click", function () {
  image_btn.classList.add("scale-capture");
  setTimeout(() => {
    image_btn.classList.remove("scale-capture");
  }, 1000)
})


let isRecord = false;
record_btn.addEventListener("click", function () {
  if (!isRecord) {
    record_btn.classList.add("scale-record");
    timer_cont.style.display = "block";
  } else {
    record_btn.classList.remove("scale-record");
    timer_cont.style.display = "none";
  }
  isRecord = !isRecord;
})
