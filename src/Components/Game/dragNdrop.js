import game from "../../script";
import * as helper from "../Game/helper";

class DragDrop {
  _draggables;
  _axis;

  rearrange(e) {
    helper.toggleClasses();
    // display the ships to place
    this.displayFleet();
    // change text
    document.querySelector("#current").textContent = "Drag & Drop";
    // show axis button
    document.querySelector(".axis").classList.remove("hide");
  }

  displayFleet() {
    const fleet = document.querySelector(".fleet");
    this._axis = "x";

    game._playerBoard.init();
    game._playerBoard.createShips();
    fleet.innerHTML = "";

    fleet.classList.remove("vertical");
    fleet.classList.add("horrizontal");

    document.querySelector(".axis").textContent = "Axis : X";

    this.createFleet(fleet);

    game.displayBoard(game._playerBoard, "left");

    this._draggables = document.querySelectorAll(".fleet__ship");

    this.dragStart();
    this.dragEnd();

    this.dragAndDrop();
  }

  createFleet(fleet) {
    game._playerBoard.ships.forEach((ship, i) => {
      const shipDiv = document.createElement("div");

      shipDiv.setAttribute("class", "fleet__ship x__axis");
      shipDiv.setAttribute("id", `ship__${ship.length}`);
      shipDiv.setAttribute("draggable", true);
      shipDiv.setAttribute("data-index", i);

      this.appendShip(ship, shipDiv);

      fleet.appendChild(shipDiv);
    });
  }

  appendShip(ship, parent) {
    for (let i = 0; i < ship.length; i++) {
      const cell = document.createElement("div");

      cell.setAttribute("class", "fleet__cell");

      parent.appendChild(cell);
    }
  }

  dragStart() {
    this._draggables.forEach((draggable) => {
      draggable.addEventListener("dragstart", (e) => {
        draggable.classList.add("dragging");
      });
    });
  }

  dragEnd() {
    this._draggables.forEach((draggable) => {
      draggable.addEventListener("dragend", () => {
        draggable.classList.remove("dragging");
      });
    });
  }

  dragAndDrop() {
    document.querySelectorAll("#leftCell").forEach((cell) => {
      cell.addEventListener("dragover", (e) => e.preventDefault());

      cell.addEventListener("dragenter", (e) => {
        const dragging = document.querySelector(".dragging");
        const ship = game._playerBoard.ships[dragging.dataset.index];

        if (
          game._playerBoard.validateCoords(
            ship,
            +e.target.dataset.index,
            this._axis
          )
        )
          e.target.classList.add("valid");
        else e.target.classList.add("invalid");
      });

      cell.addEventListener("dragleave", (e) => {
        e.target.classList.remove("valid");
        e.target.classList.remove("invalid");
      });

      cell.addEventListener("drop", this.dropShip.bind(this));
    });
  }

  dropShip(e) {
    e.preventDefault();
    // get the index of the cell
    const coords = +e.target.dataset.index;
    // get the dragged ship from dom
    const draggable = document.querySelector(".dragging");
    // get the ship from the board
    const ship = game._playerBoard.ships[draggable.dataset.index];
    // get all the cells
    const cells = document.querySelectorAll("#leftCell");

    e.target.classList.remove("valid");
    e.target.classList.remove("invalid");

    // check if its a valid coord & place the ship on board
    if (
      !game._playerBoard.validateCoords(ship, coords, this._axis) ||
      !draggable.draggable
    )
      return;

    game._playerBoard.placeShip(ship, coords, this._axis);

    if (this._axis === "x") {
      for (let i = 0; i < ship.length; i++) {
        game.renderShip(coords + i, cells, game._playerBoard);
      }
    } else {
      for (let i = 0; i < ship.length; i++) {
        game.renderShip(coords + i * 10, cells, game._playerBoard);
      }
    }

    // Remove the dragged ship from the fleet
    draggable.childNodes.forEach((node) => node.classList.add("placed"));
    draggable.classList.add("placed");
    // check if all ships are placed
    game._playerBoard.areAllPlaced();
    if (game._playerBoard.allPlaced) helper.toggleClasses();
    // remove the ships draggable property
    draggable.setAttribute("draggable", false);
  }

  toggleAxis(e) {
    if (this._axis === "x") {
      // change axis
      this._axis = "y";
      // change text
      e.target.textContent = "Axis : Y";
      // chnage classes for fleet
      document.querySelector(".fleet").classList.remove("horrizontal");
      document.querySelector(".fleet").classList.add("vertical");
      // change classes for ships
      document.querySelectorAll(".fleet__ship").forEach((ship) => {
        ship.classList.remove("x__axis");
        ship.classList.add("y__axis");
      });
    } else {
      this._axis = "x";
      e.target.textContent = "Axis : X";

      document.querySelector(".fleet").classList.remove("vertical");
      document.querySelector(".fleet").classList.add("horrizontal");

      document.querySelectorAll(".fleet__ship").forEach((ship) => {
        ship.classList.remove("y__axis");
        ship.classList.add("x__axis");
      });
    }
  }
}

const dragDrop = new DragDrop();
export default dragDrop;
