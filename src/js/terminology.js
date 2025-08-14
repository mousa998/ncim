document.querySelectorAll(".letter-selector .btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".letter-selector .btn")
      .forEach((b) => b.classList.remove("active-letter"));
    btn.classList.add("active-letter");
  });
});
