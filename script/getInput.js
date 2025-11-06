export function showConfirm(message) {
  return new Promise((resolve) => {
    const dialog = document.querySelector(".dialog-lightbox");
    const msg = document.getElementById("confirm-message");
    
    const btnYes = document.getElementById("confirm");
    const btnNo = document.getElementById("discard");

    msg.textContent = message;//nội dung msg
    dialog.classList.add("open-box");//mở dialog

    // Gán sự kiện
    const cleanup = () => {
      dialog.classList.remove("open-box");
      btnYes.removeEventListener("click", onYes);
      btnNo.removeEventListener("click", onNo);
    };

    const onYes = () => { cleanup(); resolve(true); };
    const onNo  = () => { cleanup(); resolve(false); };

    btnYes.addEventListener("click", onYes);
    btnNo.addEventListener("click", onNo);
  });
}
