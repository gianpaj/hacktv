const appleBtn = document.querySelector('.btn-apple');
const androidBtn = document.querySelector('.btn-android');

window.addEventListener('load', () => {
	console.log(getMobileOperatingSystem());
	console.log(androidBtn);
});

function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
        appleBtn.style.display = 'none';
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        androidBtn.style.display = 'none';
    }

    return "unknown";
}