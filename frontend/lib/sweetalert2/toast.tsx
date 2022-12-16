import Swal from "sweetalert2";

export const Toast = Swal.mixin({
  toast: true,
  showConfirmButton: false,
  timer: 3000,
  position: "bottom-end",
  showClass: {
    popup: "none",
  },
  hideClass: {
    popup: " animate__fadeOutUp",
  },
  // background: ,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});
