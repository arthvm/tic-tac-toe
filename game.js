const gameController = (function () {})();
const gameBoard = (function () {
  let _board = new Array(9);
  const getSlot = (indx) => _board[indx];
})();
const displayController = (function () {})();

function createPlayer(name, marker) {
  return { name, marker };
}
