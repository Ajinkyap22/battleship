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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _Components_ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Components/ship */ \"./src/Components/ship.js\");\n\r\n\r\nclass Gameboard {\r\n  constructor(size = 100) {\r\n    this.board = [];\r\n    this.ships = [];\r\n    this.size = size;\r\n    this.allSunk = false;\r\n    this.allPlaced = false;\r\n  }\r\n\r\n  // board initialization\r\n  init() {\r\n    this.board = [];\r\n    for (let i = 0; i < this.size; i++) {\r\n      this.board.push({ hasShip: false, isHit: false, isValid: true });\r\n    }\r\n  }\r\n\r\n  // ship methods\r\n  createShips() {\r\n    this.ships = [];\r\n    const sizes = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4];\r\n\r\n    for (const size of sizes) {\r\n      const ship = new _Components_ship__WEBPACK_IMPORTED_MODULE_0__.default(size);\r\n      this.ships.push(ship);\r\n    }\r\n  }\r\n\r\n  placeShip(ship, coords, axis = \"x\") {\r\n    const cells = [];\r\n\r\n    if (!this.validateCoords(ship, coords, axis))\r\n      throw new Error(\"Cannot place the ship here\");\r\n\r\n    for (let i = 0; i < ship.length; i++) {\r\n      if (axis == \"x\") {\r\n        cells.push(coords + i);\r\n        this.markAsShip(coords + i);\r\n      } else {\r\n        cells.push(coords + i * 10);\r\n        this.markAsShip(coords + i * 10);\r\n      }\r\n    }\r\n\r\n    this.markAsInvalid(ship, coords, axis);\r\n    ship.cells.push(...cells);\r\n\r\n    if (this.ships.length < 10) this.ships.push(ship);\r\n  }\r\n\r\n  autoPlace(ship) {\r\n    let [coords, axis] = this.generateRandomCoords();\r\n\r\n    while (!this.validateCoords(ship, coords, axis)) {\r\n      [coords, axis] = this.generateRandomCoords();\r\n    }\r\n\r\n    this.placeShip(ship, coords, axis);\r\n  }\r\n\r\n  placeShipsRandomly() {\r\n    this.ships.forEach((ship) => this.autoPlace(ship));\r\n\r\n    this.allPlaced = true;\r\n  }\r\n\r\n  generateRandomCoords() {\r\n    const coords = Math.floor(Math.random() * this.size);\r\n    const axis = Math.floor(Math.random() * 2) ? \"x\" : \"y\";\r\n    return [coords, axis];\r\n  }\r\n\r\n  receiveAttack(coords) {\r\n    // Error handling\r\n    // if (this.board[coords].isHit) {\r\n    //   throw new Error(\"Already hit\");\r\n    // }\r\n\r\n    if (this.board[coords].isHit) return;\r\n\r\n    // Mark coord as hit\r\n    this.board[coords].isHit = true;\r\n\r\n    // Mark ship as hit\r\n    if (this.board[coords].hasShip) {\r\n      this.markAsHit(coords);\r\n    }\r\n\r\n    // Determine whether ship has been sunk\r\n    this.allShipsSunk();\r\n  }\r\n\r\n  allShipsSunk() {\r\n    this.allSunk = this.ships.every((ship) => ship.sunk);\r\n  }\r\n\r\n  // error handling\r\n  validateCoords(ship, coords, axis) {\r\n    if (coords > this.board.length || ship.length > this.board.length) {\r\n      return false;\r\n    }\r\n\r\n    if (axis == \"x\") {\r\n      // if ship size > 1 & any of coords % 10 === 9 then false\r\n\r\n      if (coords + (ship.length - 1) > this.board.length) {\r\n        return false;\r\n      }\r\n\r\n      if (ship.length > 1) {\r\n        for (let i = coords; i < coords + ship.length - 1; i++) {\r\n          if (i % 10 === 9) return false;\r\n        }\r\n      }\r\n\r\n      for (let i = 0; i < ship.length; i++) {\r\n        if (this.board[coords + i].hasShip || !this.board[coords + i].isValid) {\r\n          return false;\r\n        }\r\n      }\r\n    } else {\r\n      if (coords + (ship.length - 1) * 10 > this.board.length) {\r\n        return false;\r\n      }\r\n\r\n      for (let i = 0; i < ship.length; i++) {\r\n        if (\r\n          this.board[coords + i * 10].hasShip ||\r\n          !this.board[coords + i * 10].isValid\r\n        ) {\r\n          return false;\r\n        }\r\n      }\r\n    }\r\n\r\n    return true;\r\n  }\r\n\r\n  // helpers\r\n  markAsShip(pos) {\r\n    this.board[pos].hasShip = true;\r\n  }\r\n\r\n  markAsHit(coords) {\r\n    const ship = this.getShip(coords);\r\n    const index = ship.cells.indexOf(coords);\r\n    ship.hit(index);\r\n    ship.isSunk();\r\n  }\r\n\r\n  getShip(coords) {\r\n    return this.ships.find((ship) => ship.cells.includes(coords));\r\n  }\r\n\r\n  markAsInvalid(ship, coords, axis) {\r\n    if (axis === \"x\") {\r\n      if (this.board[coords - 1] && coords % 10 !== 0) {\r\n        // left of ship\r\n        this.board[coords - 1].isValid = false;\r\n        ship.adjCoords.push(coords - 1);\r\n      }\r\n\r\n      // right of ship\r\n      if (\r\n        this.board[coords + ship.length] &&\r\n        (coords + ship.length) % 10 !== 0\r\n      ) {\r\n        this.board[coords + ship.length].isValid = false;\r\n        ship.adjCoords.push(coords + ship.length);\r\n      }\r\n\r\n      // top left of ship\r\n      if (this.board[coords - 11] && coords % 10 !== 0) {\r\n        this.board[coords - 11].isValid = false;\r\n        ship.adjCoords.push(coords - 11);\r\n      }\r\n\r\n      // top right of ship\r\n      if (\r\n        this.board[coords + (ship.length - 1) - 9] &&\r\n        (coords + (ship.length - 1) - 9) % 10 !== 0\r\n      ) {\r\n        this.board[coords + (ship.length - 1) - 9].isValid = false;\r\n        ship.adjCoords.push(coords + (ship.length - 1) - 9);\r\n      }\r\n\r\n      // bottom left of ship\r\n      if (this.board[coords + 9] && (coords + 9) % 10 !== 9) {\r\n        this.board[coords + 9].isValid = false;\r\n        ship.adjCoords.push(coords + 9);\r\n      }\r\n\r\n      // bottom right of ship\r\n      if (\r\n        this.board[coords + (ship.length - 1) + 11] &&\r\n        (coords + (ship.length - 1) + 11) % 10 !== 0\r\n      ) {\r\n        this.board[coords + (ship.length - 1) + 11].isValid = false;\r\n        ship.adjCoords.push(coords + (ship.length - 1) + 11);\r\n      }\r\n\r\n      for (let i = coords; i < coords + ship.length; i++) {\r\n        // right coords\r\n        if (this.board[i + 10]) {\r\n          this.board[i + 10].isValid = false;\r\n          ship.adjCoords.push(i + 10);\r\n        }\r\n\r\n        // left coords\r\n        if (this.board[i - 10]) {\r\n          this.board[i - 10].isValid = false;\r\n          ship.adjCoords.push(i - 10);\r\n        }\r\n      }\r\n    } else {\r\n      // cell below ship\r\n      if (this.board[coords + ship.length * 10]) {\r\n        this.board[coords + ship.length * 10].isValid = false;\r\n        ship.adjCoords.push(coords + ship.length * 10);\r\n      }\r\n\r\n      // cell above ship\r\n      if (this.board[coords - 10]) {\r\n        this.board[coords - 10].isValid = false;\r\n        ship.adjCoords.push(coords - 10);\r\n      }\r\n\r\n      // top left\r\n      if (this.board[coords - 11] && coords % 10 !== 0) {\r\n        this.board[coords - 11].isValid = false;\r\n        ship.adjCoords.push(coords - 11);\r\n      }\r\n\r\n      // top right\r\n      if (this.board[coords - 9] && coords % 10 !== 9) {\r\n        this.board[coords - 9].isValid = false;\r\n        ship.adjCoords.push(coords - 9);\r\n      }\r\n\r\n      // bottom left\r\n      if (this.board[coords + ship.length * 10 - 1] && coords % 10 !== 0) {\r\n        this.board[coords + ship.length * 10 - 1].isValid = false;\r\n        ship.adjCoords.push(coords + ship.length * 10 - 1);\r\n      }\r\n\r\n      // bottom right\r\n      if (this.board[coords + ship.length * 10 + 1] && coords % 10 !== 9) {\r\n        this.board[coords + ship.length * 10 + 1].isValid = false;\r\n        ship.adjCoords.push(coords + ship.length * 10 + 1);\r\n      }\r\n\r\n      for (let i = coords; i < coords + ship.length * 10; i += 10) {\r\n        // cells on right of ship\r\n        if (this.board[i + 1] && (i + 1) % 10 !== 0) {\r\n          this.board[i + 1].isValid = false;\r\n          ship.adjCoords.push(i + 1);\r\n        }\r\n        // cells on left of ship\r\n        if (this.board[i - 1] && (i - 1) % 10 !== 9) {\r\n          this.board[i - 1].isValid = false;\r\n          ship.adjCoords.push(i - 1);\r\n        }\r\n      }\r\n    }\r\n  }\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Gameboard);\r\n\n\n//# sourceURL=webpack://battleship/./src/Components/gameboard.js?");

/***/ }),

/***/ "./src/Components/player.js":
/*!**********************************!*\
  !*** ./src/Components/player.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nclass Player {\r\n  constructor(type, board) {\r\n    this.type = type;\r\n    this.board = board;\r\n    this.adjCoords = [];\r\n  }\r\n\r\n  generateBotMove() {\r\n    return Math.floor(Math.random() * 100);\r\n  }\r\n\r\n  attack(board, coords) {\r\n    if (!board.board[coords].isHit) {\r\n      board.receiveAttack(coords);\r\n    }\r\n  }\r\n\r\n  smartHit(board) {\r\n    const randomCoord = this.adjCoords.pop();\r\n\r\n    this.attack(board, randomCoord);\r\n\r\n    return randomCoord;\r\n  }\r\n\r\n  createAdjCoords(board, coords) {\r\n    // empty adjCoords first\r\n    this.adjCoords.length = 0;\r\n\r\n    const adj = [\r\n      coords + 20,\r\n      coords - 20,\r\n      coords + 2,\r\n      coords - 2,\r\n      coords - 10,\r\n      coords + 10,\r\n      coords - 1,\r\n      coords + 1,\r\n    ];\r\n\r\n    adj.forEach((cell) => {\r\n      if (this.validateCell(board, coords, cell)) this.adjCoords.push(cell);\r\n    });\r\n  }\r\n\r\n  validateCell(board, coords, cell) {\r\n    if (!board.board[cell] || board.board[cell].isHit) return false;\r\n\r\n    if (coords % 10 === 0) {\r\n      if (coords - cell < 10) return false;\r\n    }\r\n\r\n    if (coords % 10 === 9) {\r\n      if (cell - coords < 10) return false;\r\n    }\r\n\r\n    return true;\r\n  }\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Player);\r\n\n\n//# sourceURL=webpack://battleship/./src/Components/player.js?");

/***/ }),

/***/ "./src/Components/ship.js":
/*!********************************!*\
  !*** ./src/Components/ship.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nclass Ship {\r\n  constructor(length, sunk = false) {\r\n    this.length = length;\r\n    this.sunk = sunk;\r\n    this.cells = [];\r\n    this.adjCoords = [];\r\n    this.positions = Array(this.length).fill(0);\r\n  }\r\n\r\n  hit(pos) {\r\n    this.positions[pos] = 1;\r\n  }\r\n\r\n  isSunk() {\r\n    this.sunk = this.positions.every((pos) => pos == 1);\r\n    return this.sunk;\r\n  }\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ship);\r\n\n\n//# sourceURL=webpack://battleship/./src/Components/ship.js?");

/***/ }),

/***/ "./src/script.js":
/*!***********************!*\
  !*** ./src/script.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Components_ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Components/ship */ \"./src/Components/ship.js\");\n/* harmony import */ var _Components_gameboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Components/gameboard */ \"./src/Components/gameboard.js\");\n/* harmony import */ var _Components_player__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Components/player */ \"./src/Components/player.js\");\n\r\n\r\n\r\n\r\n// TODO - Game tests\r\n\r\n// Doing - Smart bot - count number of bot turns & number of cells hit to check if it plays every turn\r\n\r\n// Done - Ship tests, Gameboard tests, Player tests\r\n\r\n// Not Sure/ Review\r\n\r\n// Game - UI, Create players & boards - predetermined corrds, gameOver(), userInput\r\n\r\nclass Game {\r\n  _player;\r\n  _playerBoard;\r\n  _bot;\r\n  _botBoard;\r\n  _gameOver;\r\n  _botBoardContainer;\r\n\r\n  constructor() {\r\n    this.turn = 1;\r\n    this._botBoardContainer = document.querySelector(\".right\");\r\n\r\n    this.init();\r\n\r\n    document\r\n      .querySelector(\".reset\")\r\n      .addEventListener(\"click\", this.reset.bind(this));\r\n  }\r\n\r\n  init() {\r\n    this._gameOver = false;\r\n    // create 10 x 10 board\r\n    this._playerBoard = new _Components_gameboard__WEBPACK_IMPORTED_MODULE_1__.default();\r\n    this._playerBoard.init();\r\n    this._botBoard = new _Components_gameboard__WEBPACK_IMPORTED_MODULE_1__.default();\r\n    this._botBoard.init();\r\n\r\n    // create 2 players - human & bot\r\n    this._player = new _Components_player__WEBPACK_IMPORTED_MODULE_2__.default(\"Human\", this._playerBoard);\r\n    this._bot = new _Components_player__WEBPACK_IMPORTED_MODULE_2__.default(\"Bot\", this._botBoard);\r\n\r\n    this.displayBoard(this._playerBoard, \"left\");\r\n    this.displayBoard(this._botBoard, \"right\");\r\n\r\n    // create ships for each board & place them\r\n    this.displayShips(this._playerBoard, \"left\");\r\n    this.displayShips(this._botBoard, \"right\");\r\n    this.hideBotShips(this._botBoard, \"right\");\r\n\r\n    this._botBoardContainer\r\n      .querySelectorAll(\".cell\")\r\n      .forEach((cell) =>\r\n        cell.addEventListener(\r\n          \"click\",\r\n          this.playerAttack.bind(this, this._botBoard, this._player)\r\n        )\r\n      );\r\n  }\r\n\r\n  // method to create board on ui\r\n  displayBoard(board, name) {\r\n    const boardContainer = document.querySelector(`.${name}`);\r\n    boardContainer.innerHTML = \"\";\r\n\r\n    for (let i = 0; i < board.size; i++) {\r\n      // create a div element\r\n      const cell = document.createElement(\"div\");\r\n\r\n      // set class for it\r\n      cell.setAttribute(\"class\", \"cell\");\r\n      cell.setAttribute(\"data-index\", i);\r\n\r\n      // append it to the parent\r\n      boardContainer.append(cell);\r\n    }\r\n  }\r\n\r\n  // place ships method that creates 10 ships & places them\r\n  displayShips(board, className) {\r\n    // create ships\r\n    board.createShips();\r\n    // place them\r\n    board.placeShipsRandomly();\r\n    // add ship class to all ships\r\n    this.renderShips(board, className);\r\n  }\r\n\r\n  renderShips(board, className) {\r\n    const grid = document.querySelector(`.${className}`);\r\n    const cells = grid.querySelectorAll(\".cell\");\r\n\r\n    for (let i = 0; i < board.size; i++) {\r\n      if (board.board[i].hasShip) {\r\n        cells[i].classList.add(\"ship\");\r\n      }\r\n    }\r\n  }\r\n\r\n  hideBotShips(board, className) {\r\n    const grid = document.querySelector(`.${className}`);\r\n    const cells = grid.querySelectorAll(\".cell\");\r\n\r\n    for (let i = 0; i < board.size; i++) {\r\n      if (board.board[i].hasShip) {\r\n        cells[i].classList.add(\"hidden\");\r\n      }\r\n    }\r\n  }\r\n\r\n  switchTurn(current) {\r\n    document\r\n      .querySelectorAll(\".gameboard\")\r\n      .forEach((board) => board.classList.remove(\"inactive\"));\r\n\r\n    if (current === 1) {\r\n      this.turn = 2;\r\n      document.querySelector(\".right\").classList.add(\"inactive\");\r\n\r\n      setTimeout(() => {\r\n        this.botAttack(this._playerBoard, this._bot, \"left\");\r\n      }, 700);\r\n    } else {\r\n      this.turn = 1;\r\n    }\r\n  }\r\n\r\n  // method to take user input\r\n  playerAttack(board, player, e) {\r\n    if (this.turn !== 1) return;\r\n\r\n    const cell = e.target;\r\n    const coords = +cell.dataset.index;\r\n\r\n    if (board.board[coords].isHit) return;\r\n\r\n    const rightBoard = document.querySelector(\".right\");\r\n\r\n    player.attack(board, coords);\r\n\r\n    this.markCell(board, cell, this.turn, rightBoard, player);\r\n\r\n    this.gameOver(board);\r\n  }\r\n\r\n  botAttack(board, player, className) {\r\n    const leftBoard = document.querySelector(`.${className}`);\r\n    let coords;\r\n\r\n    if (player.adjCoords.length !== 0) {\r\n      coords = player.smartHit(board);\r\n    } else {\r\n      coords = player.generateBotMove();\r\n\r\n      if (board.board[coords].isHit)\r\n        return this.botAttack(board, player, className);\r\n\r\n      player.attack(board, coords);\r\n    }\r\n\r\n    const cell = leftBoard.querySelector(`[data-index=\"${coords}\"]`);\r\n\r\n    this.markCell(board, cell, this.turn, leftBoard, player);\r\n\r\n    this.gameOver(board);\r\n  }\r\n\r\n  markCell(board, cell, turn, domBoard, player) {\r\n    if (cell.classList.contains(\"ship\")) {\r\n      cell.classList.add(\"hit\");\r\n\r\n      const coords = +cell.dataset.index;\r\n\r\n      const prevShipSunk = this.sinkShip(board, coords, domBoard, player);\r\n\r\n      if (turn == 2 && !this._gameOver) {\r\n        setTimeout(() => {\r\n          if (!prevShipSunk) player.createAdjCoords(board, coords);\r\n          this.botAttack(board, player, \"left\");\r\n        }, 700);\r\n      }\r\n    } else {\r\n      cell.classList.add(\"miss\");\r\n\r\n      cell.textContent = \"⚫\";\r\n\r\n      this.switchTurn(turn);\r\n    }\r\n  }\r\n\r\n  sinkShip(board, coords, domBoard, player) {\r\n    const ship = board.getShip(coords);\r\n\r\n    if (ship.sunk) {\r\n      player.adjCoords.length = 0;\r\n\r\n      ship.adjCoords.forEach((coord) => {\r\n        const cell = domBoard.querySelector(`[data-index=\"${coord}\"]`);\r\n        cell.textContent = \"⚫\";\r\n\r\n        if (!cell.classList.contains(\"miss\")) cell.classList.add(\"border\");\r\n        board.board[coord].isHit = true;\r\n      });\r\n\r\n      return true;\r\n    }\r\n  }\r\n\r\n  // method to end game\r\n  gameOver(board) {\r\n    if (!board.allSunk) return;\r\n\r\n    this._gameOver = true;\r\n\r\n    // make both boards inactive\r\n    document\r\n      .querySelectorAll(\".gameboard\")\r\n      .forEach((board) => board.classList.add(\"inactive\"));\r\n\r\n    // alert gameover\r\n    alert(\"gameover\");\r\n  }\r\n\r\n  reset() {\r\n    this._gameOver = false;\r\n    this.turn = 1;\r\n\r\n    this._playerBoard.init();\r\n    this._botBoard.init();\r\n\r\n    this.displayBoard(this._playerBoard, \"left\");\r\n    this.displayBoard(this._botBoard, \"right\");\r\n\r\n    this.displayShips(this._playerBoard, \"left\");\r\n    this.displayShips(this._botBoard, \"right\");\r\n    this.hideBotShips(this._botBoard, \"right\");\r\n\r\n    document\r\n      .querySelectorAll(\".gameboard\")\r\n      .forEach((board) => board.classList.remove(\"inactive\"));\r\n\r\n    this._botBoardContainer\r\n      .querySelectorAll(\".cell\")\r\n      .forEach((cell) =>\r\n        cell.addEventListener(\r\n          \"click\",\r\n          this.playerAttack.bind(this, this._botBoard, this._player)\r\n        )\r\n      );\r\n  }\r\n}\r\n\r\nconst game = new Game();\r\n\n\n//# sourceURL=webpack://battleship/./src/script.js?");

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