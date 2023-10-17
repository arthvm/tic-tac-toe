// Stores the logic related to the game itself
const gameController = (function () {
  //Add Event Listener to the tiles
  const _tileListener = (function () {
    const _tiles = document.querySelectorAll(".tile");

    _tiles.forEach((tile) => {
      tile.addEventListener("click", () => {
        gameBoard.addMarkerToBoard(
          getCurrentPlayer().marker,
          +tile.dataset.index
        );
      });
    });

    //Get current Player, alternating between both
    const getCurrentPlayer = () => console.log("TODO: getCurrentPlayer");
  })();
})();

// Stores the logic that manages the board
const gameBoard = (function () {
  let _board = new Array(9);

  const getEmptyTiles = () => {
    let _emptyTiles = new Array();
    for (let i = 0; i < _board.length; i++) {
      if (_board[i] == null) {
        _emptyTiles.push(i);
      }
    }
    return _emptyTiles;
  };

  const addMarkerToBoard = (marker, tile) => {
    if (getEmptyTiles().includes(tile)) {
      _board[tile] = marker;
    }
  };

  return { getEmptyTiles, addMarkerToBoard };
})();

//Stores the logic that renders the game
const displayController = (function () {})();

//Player Factory
function createPlayer(name, marker) {
  return { name, marker };
}
