// Stores the logic related to the game itself
const gameController = (function () {
  const _gameBtn = document.querySelector(".game-btn");

  const getGameBtn = () => _gameBtn;

  const _addGameBtnListener = (function () {
    _gameBtn.addEventListener("click", () => {
      displayController.changeBtn(_gameBtn.dataset.mode);

      if (_gameBtn.dataset.mode == "start") {
        _startGame();
      } else {
        _restartGame();
      }
    });
  })();

  const addCloseModalBtnListener = () => {
    const _closeModalBtn = document.querySelector(".close-result");

    _closeModalBtn.addEventListener("click", () => {
      _closeModalBtn.parentElement.close();
      _restartGame();
    });
  };

  const _startGame = function () {
    _addTileListener();
    _getPlayers();
    _disablePlayerInput();
    gameController.getGameBtn().dataset.mode = "restart";
  };

  const _restartGame = function () {
    location.reload();
  };

  const _disablePlayerInput = () => {
    const _playerInputs = document.querySelectorAll(".player-input");

    _playerInputs.forEach((inputs) => {
      inputs.disabled = true;
    });
  };

  const _addTileListener = () => {
    const _tiles = document.querySelectorAll(".tile");

    _tiles.forEach((tile) => {
      tile.addEventListener(
        "click",
        () => {
          gameBoard.addMarkerToBoard(
            getCurrentPlayer().marker,
            +tile.dataset.index
          );

          displayController.updateBoardRender();
          _checkResult();
        },
        { once: true }
      );
    });
  };

  let _players = new Array();

  const _setPlayer = (playerName, playerMarker) =>
    _players.push(createPlayer(playerName, playerMarker));

  const _getPlayers = () => {
    const _playerInputs = document.querySelectorAll(".player-input");

    _playerInputs.forEach((input) => {
      if (input.value == "") {
        console.log("AI"); //TODO:  ADD AI
      } else {
        _setPlayer(input.value, input.dataset.marker);
      }
    });
  };

  //Get current Player, alternating between both
  const getCurrentPlayer = () => {
    return _players[gameBoard.getEmptyTiles().length % 2 != 0 ? 0 : 1];
  };

  const _checkResult = () => {
    const _checkForRow = () => {
      for (let i = 0; i <= 6; i += 3) {
        let currentRow = [];
        for (let j = i; j <= i + 2; j++) {
          currentRow[j] = gameBoard.getTile(j);
        }

        if (
          currentRow.every((tile) => tile == "X") ||
          currentRow.every((tile) => tile == "0")
        ) {
          return true;
        }
      }
    };

    const _checkForCollum = () => {
      for (let i = 0; i < 3; i++) {
        let currentCol = [];
        for (let j = i; j <= i + 6; j += 3) {
          currentCol[j] = gameBoard.getTile(j);
        }

        if (
          currentCol.every((tile) => tile == "X") ||
          currentCol.every((tile) => tile == "0")
        ) {
          return true;
        }
      }
    };

    const _checkForDiagonal = () => {
      const diagonalRight = [
        gameBoard.getTile(0),
        gameBoard.getTile(4),
        gameBoard.getTile(8),
      ];

      const diagonalLeft = [
        gameBoard.getTile(2),
        gameBoard.getTile(4),
        gameBoard.getTile(6),
      ];

      if (
        diagonalRight.every((tile) => tile == "X") ||
        diagonalRight.every((tile) => tile == "0") ||
        diagonalLeft.every((tile) => tile == "X") ||
        diagonalLeft.every((tile) => tile == "0")
      ) {
        return true;
      }
    };

    if (_checkForRow() || _checkForCollum() || _checkForDiagonal()) {
      displayController.showResult(
        getCurrentPlayer() == _players[0] ? _players[1] : _players[0]
      ); // REMOVE AFTER TESTING
    } else if (gameBoard.getEmptyTiles().length == 0) {
      displayController.showResult(); // REMOVE AFTER TESTING
    }
  };

  return { getGameBtn, getCurrentPlayer, addCloseModalBtnListener };
})();

// Stores the logic that manages the board
const gameBoard = (function () {
  let _board = new Array(9);

  const getBoard = () => _board;

  const getTile = (tile) => _board[tile];

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

  return { getBoard, getTile, getEmptyTiles, addMarkerToBoard };
})();

//Stores the logic that renders the game
const displayController = (function () {
  const _board = document.querySelector(".board");
  const _tiles = document.querySelectorAll(".tile");
  // Render marker on HTML
  const updateBoardRender = () => {
    _tiles.forEach((tile) => {
      tile.textContent = gameBoard.getBoard()[+tile.dataset.index];
    });
  };

  const changeBtn = (mode) => {
    if (mode == "start") {
      _board.classList.add("active");
      gameController.getGameBtn().value = "Restart";
    } else {
      _board.classList.remove("active");
      gameController.getGameBtn().value = "Start Game";
    }
  };

  const showResult = (winner) => {
    const _resultDialog = document.querySelector(".result-dialog");
    const _gameResult = document.querySelector(".game-result-txt");
    const _gameWinner = document.querySelector(".winner-name");

    if (winner == null) {
      _gameResult.textContent = "It's a";
      _gameWinner.textContent = "Draw!";
      _resultDialog.showModal();
    } else {
      _gameResult.textContent = "The winner is:";
      _gameWinner.textContent = winner.name;
      _resultDialog.showModal();
    }

    gameController.addCloseModalBtnListener();
  };

  return { changeBtn, updateBoardRender, showResult };
})();

//Player Factory
function createPlayer(name, marker) {
  return { name, marker };
}
