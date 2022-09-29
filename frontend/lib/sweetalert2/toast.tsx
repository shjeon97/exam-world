import React from "react";
import Swal from "sweetalert2";

export const Toast = Swal.mixin({
  toast: true,
  showConfirmButton: false,
  timer: 3000,
  position: "bottom-end",
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});
