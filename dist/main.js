/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Components/gameboard.js":
/*!*************************************!*\
  !*** ./src/Components/gameboard.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _Components_ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Components/ship */ \"./src/Components/ship.js\");\n\r\n\r\nclass Gameboard {\r\n  constructor() {\r\n    this.board = [];\r\n    this.ships = [];\r\n    this.size = 100;\r\n    this.allSunk = false;\r\n    this.allPlaced = false;\r\n  }\r\n\r\n  // board initialization\r\n  init() {\r\n    for (let i = 0; i < this.size; i++) {\r\n      this.board.push({ hasShip: false, isHit: false, isValid: true });\r\n    }\r\n  }\r\n\r\n  // helpers\r\n  markAsShip(pos) {\r\n    this.board[pos].hasShip = true;\r\n  }\r\n\r\n  markAsHit(coords) {\r\n    const ship = this.ships.find((ship) => ship.cells.includes(coords));\r\n    const index = ship.cells.indexOf(coords);\r\n    ship.ship.hit(index);\r\n    ship.ship.isSunk();\r\n  }\r\n\r\n  markAsInvalid(ship, coords, axis) {\r\n    if (axis === \"x\") {\r\n      // left of ship\r\n      if (this.board[coords - 1]) this.board[coords - 1] = false;\r\n\r\n      // right of ship\r\n      if (this.board[coords + ship.length])\r\n        this.board[coords + ship.length].isValid = false;\r\n\r\n      // top left of ship\r\n      if (this.board[coords - 11]) this.board[coords - 11] = false;\r\n\r\n      // top right of ship\r\n      if (this.board[coords + (ship.length - 1) - 9])\r\n        this.board[coords + (ship.length - 1) - 9].isValid = false;\r\n\r\n      // bottom left of ship\r\n      if (this.board[coords + 9]) this.board[coords + 9] = false;\r\n\r\n      // bottom right of ship\r\n      if (this.board[coords + (ship.length - 1) + 11])\r\n        this.board[coords + (ship.length - 1) + 11].isValid = false;\r\n\r\n      for (let i = coords; i < coords + ship.length; i++) {\r\n        // right coords\r\n        if (this.board[i + 10]) this.board[i + 10].isValid = false;\r\n\r\n        // left coords\r\n        if (this.board[i - 10]) this.board[i - 10].isValid = false;\r\n      }\r\n    } else {\r\n      // cell below ship\r\n      if (this.board[coords + ship.length * 10])\r\n        this.board[coords + ship.length * 10].isValid = false;\r\n\r\n      // cell above ship\r\n      if (this.board[coords - 10]) this.board[coords - 10].isValid = false;\r\n\r\n      // top left\r\n      if (this.board[coords - 11]) this.board[coords - 11].isValid = false;\r\n\r\n      // top right\r\n      if (this.board[coords - 9]) this.board[coords - 9].isValid = false;\r\n\r\n      // bottom left\r\n      if (this.board[coords + ship.length * 10 - 1])\r\n        this.board[coords + ship.length * 10 - 1].isValid = false;\r\n\r\n      // bottom right\r\n      if (this.board[coords + ship.length * 10 + 1])\r\n        this.board[coords + ship.length * 10 + 1].isValid = false;\r\n\r\n      for (let i = coords; i < coords + ship.length * 10; i += 10) {\r\n        // cells on right of ship\r\n        if (this.board[i + 1]) this.board[i + 1].isValid = false;\r\n        // cells on left of ship\r\n        if (this.board[i - 1]) this.board[i - 1].isValid = false;\r\n      }\r\n    }\r\n  }\r\n\r\n  // error handling\r\n  validateCoords(ship, coords, axis) {\r\n    if (coords > this.board.length || ship.length > this.board.length) {\r\n      return false;\r\n    }\r\n\r\n    if (axis == \"x\") {\r\n      if (coords + ship.length > this.board.length) {\r\n        return false;\r\n      }\r\n\r\n      for (let i = 0; i < ship.length; i++) {\r\n        if (this.board[coords + i].hasShip || !this.board[coords + i].isValid) {\r\n          return false;\r\n        }\r\n      }\r\n    } else {\r\n      if (coords + ship.length * 10 > this.board.length) {\r\n        return false;\r\n      }\r\n\r\n      for (let i = 0; i < ship.length; i++) {\r\n        if (\r\n          this.board[coords + i * 10].hasShip ||\r\n          !this.board[coords + i * 10].isValid\r\n        ) {\r\n          return false;\r\n        }\r\n      }\r\n    }\r\n\r\n    return true;\r\n  }\r\n\r\n  // ship methods\r\n  createShips() {\r\n    const sizes = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4];\r\n\r\n    for (const size of sizes) {\r\n      const ship = new _Components_ship__WEBPACK_IMPORTED_MODULE_0__.default(size);\r\n      this.ships.push(ship);\r\n    }\r\n  }\r\n\r\n  placeShip(ship, coords, axis = \"x\") {\r\n    const cells = [];\r\n\r\n    if (!this.validateCoords(ship, coords, axis))\r\n      throw new Error(\"Cannot place the ship here\");\r\n\r\n    for (let i = 0; i < ship.length; i++) {\r\n      if (axis == \"x\") {\r\n        cells.push(coords + i);\r\n        this.markAsShip(coords + i);\r\n        this.markAsInvalid(ship, coords, axis);\r\n      } else {\r\n        cells.push(coords + i * 10);\r\n        this.markAsShip(coords + i * 10);\r\n        this.markAsInvalid(ship, coords, axis);\r\n      }\r\n    }\r\n    if (this.ships.length < 10) this.ships.push({ ship, cells });\r\n  }\r\n\r\n  autoPlace(ship) {\r\n    let [coords, axis] = this.generateRandomCoords();\r\n\r\n    while (!this.validateCoords(ship, coords, axis)) {\r\n      [coords, axis] = this.generateRandomCoords();\r\n    }\r\n\r\n    this.placeShip(ship, coords, axis);\r\n  }\r\n\r\n  placeShipsRandomly() {\r\n    this.ships.forEach((ship) => this.autoPlace(ship));\r\n\r\n    this.allPlaced = true;\r\n  }\r\n\r\n  generateRandomCoords() {\r\n    const coords = Math.floor(Math.random() * this.size);\r\n    const axis = Math.floor(Math.random() * 2) ? \"x\" : \"y\";\r\n    return [coords, axis];\r\n  }\r\n\r\n  receiveAttack(coords) {\r\n    // Error handling\r\n    if (this.board[coords].isHit) {\r\n      throw new Error(\"Already hit\");\r\n    }\r\n\r\n    // Mark coord as hit\r\n    this.board[coords].isHit = true;\r\n\r\n    // Mark ship as hit\r\n    if (this.board[coords].hasShip) {\r\n      this.markAsHit(coords);\r\n    }\r\n\r\n    // Determine whether ship has been sunk\r\n    this.allShipsSunk();\r\n  }\r\n\r\n  allShipsSunk() {\r\n    this.allSunk = this.ships.every((ship) => ship.ship.sunk);\r\n  }\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Gameboard);\r\n\n\n//# sourceURL=webpack://battleship/./src/Components/gameboard.js?");

/***/ }),

/***/ "./src/Components/player.js":
/*!**********************************!*\
  !*** ./src/Components/player.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nclass Player {\r\n  constructor(type, board) {\r\n    this.type = type;\r\n    this.board = board;\r\n  }\r\n\r\n  generateBotMove() {\r\n    return Math.floor(Math.random() * 100);\r\n  }\r\n\r\n  attack(board, coords) {\r\n    if (!board.board[coords].isHit) {\r\n      board.receiveAttack(coords);\r\n    }\r\n  }\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Player);\r\n\n\n//# sourceURL=webpack://battleship/./src/Components/player.js?");

/***/ }),

/***/ "./src/Components/ship.js":
/*!********************************!*\
  !*** ./src/Components/ship.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nclass Ship {\r\n  constructor(length, sunk = false) {\r\n    this.length = length;\r\n    this.sunk = sunk;\r\n\r\n    this.positions = Array(this.length).fill(0);\r\n  }\r\n\r\n  hit(pos) {\r\n    this.positions[pos] = 1;\r\n  }\r\n\r\n  isSunk() {\r\n    this.sunk = this.positions.every((pos) => pos == 1);\r\n    return this.sunk;\r\n  }\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ship);\r\n\n\n//# sourceURL=webpack://battleship/./src/Components/ship.js?");

/***/ }),

/***/ "./src/script.js":
/*!***********************!*\
  !*** ./src/script.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Components_ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Components/ship */ \"./src/Components/ship.js\");\n/* harmony import */ var _Components_gameboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Components/gameboard */ \"./src/Components/gameboard.js\");\n/* harmony import */ var _Components_player__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Components/player */ \"./src/Components/player.js\");\n\r\n\r\n\r\n\r\n// TODO - Game tests\r\n\r\n// Doing -\r\n\r\n// Done - Ship tests, Gameboard tests, Player tests\r\n\r\n// Not Sure/ Review\r\n\r\n// Game - UI, Create players & boards - predetermined corrds, gameOver(), userInput\r\n\r\nclass Game {\r\n  constructor() {\r\n    this.init();\r\n\r\n    this.turn = 1;\r\n  }\r\n\r\n  init() {\r\n    // create 10 x 10 board\r\n    const playerBoard = new _Components_gameboard__WEBPACK_IMPORTED_MODULE_1__.default();\r\n    playerBoard.init();\r\n    const botBoard = new _Components_gameboard__WEBPACK_IMPORTED_MODULE_1__.default();\r\n    botBoard.init();\r\n\r\n    // create 2 players - human & bot\r\n    const player = new _Components_player__WEBPACK_IMPORTED_MODULE_2__.default(\"Human\", playerBoard);\r\n    const bot = new _Components_player__WEBPACK_IMPORTED_MODULE_2__.default(\"Bot\", botBoard);\r\n\r\n    this.displayBoard(playerBoard, \"left\");\r\n    this.displayBoard(botBoard, \"right\");\r\n\r\n    // create ships for each board & place them\r\n    this.displayShips(playerBoard, \"left\");\r\n    this.displayShips(botBoard, \"right\");\r\n\r\n    // add event listeners\r\n    const leftBoard = document.querySelector(\".left\");\r\n    leftBoard\r\n      .querySelectorAll(\".cell\")\r\n      .forEach((cell) =>\r\n        cell.addEventListener(\r\n          \"click\",\r\n          this.playerAttack.bind(this, botBoard, player)\r\n        )\r\n      );\r\n  }\r\n\r\n  // method to create board on ui\r\n  displayBoard(board, name) {\r\n    for (let i = 0; i < board.size; i++) {\r\n      // create a div element\r\n      const cell = document.createElement(\"div\");\r\n\r\n      // set class for it\r\n      cell.setAttribute(\"class\", \"cell\");\r\n\r\n      // append it to the parent\r\n      document.querySelector(`.${name}`).append(cell);\r\n    }\r\n  }\r\n\r\n  // place ships method that creates 10 ships & places them\r\n  displayShips(board, className) {\r\n    // create ships\r\n    board.createShips();\r\n    // place them\r\n    board.placeShipsRandomly();\r\n    // add ship class to all ships\r\n    this.renderShips(board, className);\r\n  }\r\n\r\n  renderShips(board, className) {\r\n    const grid = document.querySelector(`.${className}`);\r\n    const cells = grid.querySelectorAll(\".cell\");\r\n\r\n    for (let i = 0; i < board.size; i++) {\r\n      if (board.board[i].hasShip) cells[i].classList.add(\"ship\");\r\n    }\r\n  }\r\n\r\n  switchTurn(current) {\r\n    document\r\n      .querySelectorAll(\".gameboard\")\r\n      .forEach((board) => board.classList.remove(\"inactive\"));\r\n    if (current === 1) {\r\n      this.turn = 2;\r\n      document.querySelector(\".left\").classList.add(\"inactive\");\r\n    } else {\r\n      this.turn = 1;\r\n      document.querySelector(\".right\").classList.add(\"inactive\");\r\n    }\r\n  }\r\n\r\n  // method to take user input\r\n  playerAttack(board, player, e) {}\r\n\r\n  // method to end game\r\n}\r\n\r\nconst game = new Game();\r\n\n\n//# sourceURL=webpack://battleship/./src/script.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/script.js");
/******/ 	
/******/ })()
;