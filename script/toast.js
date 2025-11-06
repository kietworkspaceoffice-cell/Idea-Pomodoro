
const toastEl = document.getElementById("toast");
const toast = new bootstrap.Toast(toastEl, { autohide: false });
const progressBar = document.querySelector(".progress-bar");
const bodyContent = document.querySelector(".toast-body");
let toastActive = false;


export function showToast(content) {
    if(toastActive) return;
    toastActive = true;
    progressBar.style.width = '100%';
    console.log("Toast started at:", Date.now());
    bodyContent.innerHTML = content;
    toast.show();
    const timeStart = Date.now();
    const progress = setInterval( () => {
        const duration = Date.now() - timeStart;
        progressBar.style.width = `${100 - duration*100/5000}%`;
        console.log(duration*100/5000);
        if ((Date.now() - timeStart) >= 5000) { // hàm if bắt buộc phải đặt trong setInterval
            clearInterval(progress);//Vì khi đặt bên ngoài thì nó chỉ được kiểm tra 1 lần duy nhất ở thời điểm khởi tạo
            setTimeout( () => {
                toast.hide();
                toastActive = false;
            }, 700); // Và sẽ khiến setInterval không dừng
            
        };
    },50);
    
    
};