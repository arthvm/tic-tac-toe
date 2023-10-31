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
    if (getCurrentPlayer().type == "ai") {
      aiMove();
      displayController.updateBoardRender();
    }
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
          let currentPlayer = getCurrentPlayer();
          if (currentPlayer.type == "player") {
            playerMove(currentPlayer, tile);
            aiMove();
          }

          displayController.updateBoardRender();
          let _winState = checkWinner();
          if (_winState != null) {
            displayController.showResult(_winState);
          }
        },
        { once: true }
      );
    });
  };

  let _players = new Array();

  const _setPlayer = (playerName, playerMarker, type) =>
    _players.push(createPlayer(playerName, playerMarker, type));

  const _getPlayers = () => {
    const _playerInputs = document.querySelectorAll(".player-input");

    _playerInputs.forEach((input) => {
      if (input.value == "") {
        _setPlayer("AI", input.dataset.marker, "ai");
      } else {
        _setPlayer(input.value, input.dataset.marker, "player");
      }
    });
  };

  //Get current Player, alternating between both
  const getCurrentPlayer = () => {
    return _players[gameBoard.getEmptyTiles().length % 2 != 0 ? 0 : 1];
  };

  const checkWinner = () => {
    let winner;

    const _checkForRow = (function () {
      for (let i = 0; i <= 6; i += 3) {
        let currentRow = [];
        for (let j = i; j <= i + 2; j++) {
          currentRow[j] = gameBoard.getTile(j);
        }

        if (currentRow.every((tile) => tile == "X")) {
          winner = _players.find((player) => player.marker == "X");
        } else if (currentRow.every((tile) => tile == "0")) {
          winner = _players.find((player) => player.marker == "0");
        }
      }
    })();

    const _checkForCollum = (function () {
      for (let i = 0; i < 3; i++) {
        let currentCol = [];
        for (let j = i; j <= i + 6; j += 3) {
          currentCol[j] = gameBoard.getTile(j);
        }

        if (currentCol.every((tile) => tile == "X")) {
          winner = _players.find((player) => player.marker == "X");
        } else if (currentCol.every((tile) => tile == "0")) {
          winner = _players.find((player) => player.marker == "0");
        }
      }
    })();

    const _checkForDiagonal = (function () {
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
        diagonalLeft.every((tile) => tile == "X")
      ) {
        winner = _players.find((player) => player.marker == "X");
      } else if (
        diagonalRight.every((tile) => tile == "0") ||
        diagonalLeft.every((tile) => tile == "0")
      ) {
        winner = _players.find((player) => player.marker == "0");
      }
    })();

    if (winner == null && gameBoard.getEmptyTiles().length == 0) {
      return "tie";
    } else {
      return winner;
    }
  };

  return {
    getGameBtn,
    getCurrentPlayer,
    addCloseModalBtnListener,
    checkWinner,
  };
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

    if (winner == "tie") {
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

//Logic for the player
const playerMove = (currentPlayer, tile) => {
  gameBoard.addMarkerToBoard(currentPlayer.marker, +tile.dataset.index);
};

const aiMove = () => {
  let currentPlayer = gameController.getCurrentPlayer();
  let emptyTiles = gameBoard.getEmptyTiles();
  if (currentPlayer.type == "ai") {
    gameBoard.addMarkerToBoard(
      currentPlayer.marker,
      bestMove(currentPlayer.marker)
    );
  }
};

function bestMove(marker) {
  let _board = gameBoard.getBoard();
  let _bestScore = marker == "X" ? -Infinity : Infinity;
  let _move;
  for (let i = 0; i < _board.length; i++) {
    if (_board[i] == null) {
      _board[i] = marker;
      let _score = minimax(_board, 0, marker == "X" ? false : true);
      _board[i] = null;
      if (marker == "X") {
        if (_score > _bestScore) {
          _bestScore = _score;
          _move = i;
        }
      } else {
        if (_score < _bestScore) {
          _bestScore = _score;
          _move = i;
        }
      }
    }
  }

  return _move;
}

let scores = {
  X: 10,
  0: -10,
  tie: 0,
};

function minimax(board, depth, isMaximizing) {
  let _result = gameController.checkWinner();
  if (_result == "tie") {
    return scores[_result];
  } else if (_result != null) {
    return scores[_result.marker];
  }

  if (isMaximizing) {
    let _bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] == null) {
        board[i] = "X";
        let _score = minimax(board, depth + 1, false);
        board[i] = null;
        _bestScore = Math.max(_score, _bestScore);
      }
    }

    return _bestScore;
  } else {
    let _bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] == null) {
        board[i] = "0";
        let _score = minimax(board, depth + 1, true);
        board[i] = null;
        _bestScore = Math.min(_score, _bestScore);
      }
    }

    return _bestScore;
  }
}

//Player Factory
function createPlayer(name, marker, type) {
  return { name, marker, type };
}
