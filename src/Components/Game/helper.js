import game from "../../script";

function playAgain() {
  closeModal();
  game.init();
}

function showModal(classname) {
  document.querySelector(`.${classname}`).classList.remove("hide");
  document.querySelector(".overlay").classList.remove("hide");
}

function closeModal() {
  document
    .querySelectorAll(".modal")
    .forEach((modal) => modal.classList.add("hide"));
  document.querySelector(".overlay").classList.add("hide");
}

function toggleClasses() {
  // Fleet
  document.querySelector(".fleet").classList.toggle("hide");
  // bot board
  document.querySelector(".bot__grid").classList.toggle("hide");
  // start button
  document.querySelector(".start").classList.toggle("hide");
  // how to play button
  document.querySelector(".how").classList.toggle("hide");
  // rearrange button
  document.querySelector(".rearrange").classList.toggle("hide");
  // clear button
  document.querySelector(".clear").classList.toggle("hide");
  // axis button
  document.querySelector(".axis").classList.toggle("hide");
  // note
  document.querySelector("#note").classList.toggle("hide");
}

export { playAgain, showModal, closeModal, toggleClasses };
