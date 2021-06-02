import Ship from "../Components/Factories/ship";

test("Ship Hit", () => {
  const newShip = new Ship(3);

  newShip.hit(2);

  expect(newShip.positions).toEqual([0, 0, 1]);
});

test("Ship Not Sinked", () => {
  const newShip = new Ship(3);

  newShip.hit(2);

  expect(newShip.isSunk()).toBeFalsy();
});

test("Ship Sinked", () => {
  const newShip = new Ship(3);

  newShip.hit(2);
  newShip.hit(0);
  newShip.hit(1);

  expect(newShip.isSunk()).toBeTruthy();
});
