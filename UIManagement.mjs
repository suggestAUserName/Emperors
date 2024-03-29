import {
  PIECE_SHAPE_SIZE,
  MAP_PHASE,
  STONE_PHASE,
  PLAYER_1,
  PLAYER_2,
} from "./Constants.mjs";

import { StrategyDetails } from "./GameManagement.mjs";

//A class that manages the different aspects of rendering
export class RenderManager {
  constructor(gameBoard) {
    this.gridContainer = document.getElementById("game-board");

    this.board = gameBoard;
  }

  setStrategy(strategy) {
    // Set the strategy
    this.strategy = strategy;
  }

  performStrategy(details) {
    if (!this.strategy) {
      throw new Error("Strategy is not set");
    }

    this.strategy.performStrategy(this, details);
  }

  getBoard() {
    return this.board;
  }
}

//A strategy for the RenderManager class and renders the Status
export class StatusRenderer {
  constructor() {
    this.boardReference = [];
    this.gridContainer = 0;
  }
  // Method to perform the strategy
  performStrategy(renderer, details) {
    this.boardReference = renderer.getBoard();
    this.renderStatus(this.boardReference, details);
  }

  renderStatus(board, details) {
    // Update turn indicator
    const turnIndicator = document.getElementById("turn-indicator");
    turnIndicator.textContent = `${details.currentTurn + 1}`;

    // Update phase indicator
    const phaseIndicator = document.getElementById("game-phase");
    phaseIndicator.textContent = `${details.gamePhase}`;

    // Update current player indicator
    const currentPlayerIndicator = document.getElementById("current-player");
    if (details.currentPlayer === PLAYER_1) {
      currentPlayerIndicator.textContent = "Black";
    } else if (details.currentPlayer === PLAYER_2) {
      currentPlayerIndicator.textContent = "White";
    }
    // Update player city counts in the UI
    let player1CityCount = 0;
    let player2CityCount = 0;
    const cities = details.currentCityState;
    if (cities !== null) {
      player1CityCount = cities[PLAYER_1].count;

      player2CityCount = cities[PLAYER_2].count;
    }

    const player1CitiesElement = document.getElementById("player1-cities");

    const player2CitiesElement = document.getElementById("player2-cities");

    player1CitiesElement.textContent = `${player1CityCount}`;
    player2CitiesElement.textContent = `${player2CityCount}`;

    // Update player Resource counts in the UI
    let player1ResourceCount = 0;
    let player2ResourceCount = 0;
    const resources = details.currentResourceState;
    if (cities !== null) {
      player1ResourceCount = resources[PLAYER_1].count;

      player2ResourceCount = resources[PLAYER_2].count;
    }

    const player1ResourceElement = document.getElementById("player1-resources");

    const player2ResourceElement = document.getElementById("player2-resources");

    player1ResourceElement.textContent = `${player1ResourceCount}`;
    player2ResourceElement.textContent = `${player2ResourceCount}`;

    // Update player Trade Route counts in the UI
    let player1TradeRoutesCount = 0;
    let player2TradeRoutesCount = 0;

    let player1TradeRoutesLength = 0;
    let player2TradeRoutesLength = 0;

    const tradeRoutes = details.currentTradeRouteState;
    if (tradeRoutes !== null) {
      player1TradeRoutesCount = tradeRoutes[PLAYER_1].count;
      player2TradeRoutesCount = tradeRoutes[PLAYER_2].count;

      player1TradeRoutesLength = tradeRoutes[PLAYER_1].totalLength;
      player2TradeRoutesLength = tradeRoutes[PLAYER_2].totalLength;
    }

    const player1TradeRoutesElement = document.getElementById(
      "player1-trade-routes"
    );
    const player2TradeRoutesElement = document.getElementById(
      "player2-trade-routes"
    );

    player1TradeRoutesElement.textContent = `Count: ${player1TradeRoutesCount}, Length: ${player1TradeRoutesLength}`;
    player2TradeRoutesElement.textContent = `Count: ${player2TradeRoutesCount}, Length: ${player2TradeRoutesLength}`;

    // Update player emperor counts in the UI
    const emperors = details.currentEmperorState;
    let player1EmperorCount = 0;
    let player2EmperorCount = 0;
    for (const key in emperors) {
      if (Object.prototype.hasOwnProperty.call(emperors, key)) {
        if (emperors[key].emperor === PLAYER_1) {
          player1EmperorCount++;
        } else if (emperors[key].emperor === PLAYER_2) {
          player2EmperorCount++;
        }
      }
    }

    const player1EmperorCountElement =
      document.getElementById("player1-emperor");

    const player2EmperorCountElement =
      document.getElementById("player2-emperor");

    player2EmperorCountElement.textContent = `${player2EmperorCount}`;
    player1EmperorCountElement.textContent = `${player1EmperorCount}`;

    // Update player population counts in the UI
    const populations = details.currentPopulationState;
    let player1Population = 0;
    let player2Population = 0;
    if (populations !== null) {
      player1Population = populations[PLAYER_1];
      player2Population = populations[PLAYER_2];
    }
    const player1PopulationElement =
      document.getElementById("player1-population");
    const player2PopulationElement =
      document.getElementById("player2-population");

    player1PopulationElement.textContent = `${player1Population}`;
    player2PopulationElement.textContent = `${player2Population}`;
  }
}

//A strategy for the RenderManager class and renders the board
export class BoardRenderer {
  constructor() {
    this.boardReference = [];
    this.gridContainer = 0;
  }
  // Method to perform the strategy
  performStrategy(renderer) {
    this.boardReference = renderer.getBoard();
    this.gridContainer = renderer.gridContainer;
    this.renderBoard(this.boardReference);
  }
  // Method to render the board
  renderBoard() {
    if (!this.boardReference) {
      return;
    }
    this.gridContainer.innerHTML = "";
    this.boardReference.getGrid().forEach((row, rowIndex) => {
      const rowElement = document.createElement("div");
      rowElement.classList.add("row");
      row.forEach((cell, cellIndex) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        cellElement.dataset.row = rowIndex;
        cellElement.dataset.col = cellIndex;
        if (cell && cell.type === "mapPiece") {
          const mapPieceColorClass = `map-piece-${cell.color}`;
          cellElement.classList.add("map-piece");
          cellElement.classList.add(mapPieceColorClass);
          cellElement.dataset.id = cell.id;
          const squareElement = document.createElement("div");
          squareElement.classList.add("square");
          squareElement.dataset.row = cell.cellSquareLocation.y;
          squareElement.dataset.col = cell.cellSquareLocation.x;
          cellElement.appendChild(squareElement);
          for (let i = 0; i < cell.stoneCount; i++) {
            const permanentStone = document.createElement("div");
            permanentStone.classList.add("stone-permanent");
            permanentStone.classList.add("stone");
            if (cell.lastPlayed) {
              permanentStone.classList.add("lastPlayed");
            }
            if (cell.isPartOfTradeRoute) {
              permanentStone.classList.add("is-part-of-route");
            }
            if (cell.isPartOfCity) {
              permanentStone.classList.add("is-part-of-city");
            }
            if (cell.stoneOwner === PLAYER_1) {
              permanentStone.classList.add("stone-player1");
            } else if (cell.stoneOwner === PLAYER_2) {
              permanentStone.classList.add("stone-player2");
            }
            cellElement.appendChild(permanentStone);
          }
        } else if (cell && cell.type === "naturalResource") {
          cellElement.classList.add("resource");
        }

        rowElement.appendChild(cellElement);
      });
      this.gridContainer.appendChild(rowElement);
    });
  }
}

//A strategy for the RenderManager class and renders the Move Previews
export class MovePreviewRenderer {
  constructor() {
    this.boardReference = [];
    this.gridContainer = 0;
  }
  performStrategy(renderer, details) {
    this.cellElement = details.cellElement;
    this.piece = details.piece;
    this.preview = details.toggleFlag;
    this.gamePhase = details.gamePhase;
    this.boardReference = renderer.getBoard();
    // Get the grid from the board reference
    this.gridCOPY = this.boardReference.getGrid();

    // Get the grid container from the renderer
    this.gridContainer = renderer.gridContainer;
    // Render the map preview or stone preview based on the game phase
    if (this.gamePhase === MAP_PHASE) {
      this.renderMapPreview(this.cellElement, this.piece, this.preview);
    } else if (this.gamePhase === STONE_PHASE) {
      this.renderStonePreview(this.cellElement, this.preview);
    }
  }

  // Render the map preview
  renderMapPreview(cellElement, piece, preview) {
    if (this.gamePhase === MAP_PHASE) {
      // Calculate the starting position of the piece
      const x =
        parseInt(cellElement.dataset.col) - Math.floor(PIECE_SHAPE_SIZE / 2);
      const y =
        parseInt(cellElement.dataset.row) - Math.floor(PIECE_SHAPE_SIZE / 2);

      // Get the width and height of the piece
      const pieceWidth = this.piece.shape[0].length;
      const pieceHeight = this.piece.shape.length;

      // Loop through each cell in the piece
      for (let i = 0; i < pieceHeight; i++) {
        for (let j = 0; j < pieceWidth; j++) {
          if (this.piece.shape[i][j] === 1) {
            // Get the row and cell of the current cell in the piece
            const row = this.gridContainer.children[y + i];
            if (row) {
              const cell = row.children[x + j];
              if (cell) {
                // Add or remove the preview class based on the preview flag
                if (preview) {
                  cell.classList.add("preview");
                } else {
                  cell.classList.remove("preview");
                }
              }
            }
          }
        }
      }
    }
  }

  // Render the stone preview
  renderStonePreview(cellElement, preview) {
    if (typeof cellElement.stonePreviewActive === "undefined") {
      cellElement.stonePreviewActive = false;
    }
    if (this.gamePhase === STONE_PHASE) {
      // Get the existing stone preview element
      const existingStonePreview = cellElement.querySelector(".stone-preview");

      // Get the square from the grid
      const square =
        this.gridCOPY[cellElement.dataset.row][cellElement.dataset.col];

      // Add or remove the stone preview based on the preview flag and the square's state
      if (
        preview &&
        !cellElement.stonePreviewActive &&
        square &&
        square.stoneCount === 0
      ) {
        // Only add the stone preview if it's not already active and the square is not occupied
        const stonePreview = document.createElement("div");
        stonePreview.classList.add("stone-preview");
        stonePreview.classList.add("stone");
        cellElement.appendChild(stonePreview);
        cellElement.stonePreviewActive = true;
      } else if (!preview && cellElement.stonePreviewActive) {
        // Only remove the stone preview if it's currently active
        if (existingStonePreview) {
          cellElement.removeChild(existingStonePreview);
        }
        cellElement.stonePreviewActive = false;
      }
    }
  }
}

// EventListener class
export class EventListener {
  constructor(game, gameBoard) {
    // Store the game and game board instances
    this.game = game;
    this.gameBoard = gameBoard;
    this.rotateButton = document.getElementById("rotate-button");
    // Get the grid container element
    this.gridContainer = document.getElementById("game-board");

    // Attach event listeners to the grid container and undo button
    this.attachEventListeners();
  }

  // Attach event listeners to the grid container and undo button
  attachEventListeners() {
    // Handle mouseover event
    this.gridContainer.addEventListener("mouseover", (event) => {
      const cellElement = event.target.closest(".cell");
      if (cellElement) {
        this.handleHoverEnter(cellElement);
      }
    });

    // Handle mouseout event
    this.gridContainer.addEventListener("mouseout", (event) => {
      const cellElement = event.target.closest(".cell");
      if (cellElement) {
        this.handleHoverLeave(cellElement);
      }
    });

    // Handle click event
    this.gridContainer.addEventListener("click", (event) => {
      const cellElement = event.target.closest(".cell");
      if (cellElement) {
        this.handleClick(cellElement);
        console.log(cellElement);
      }
    });

    this.rotateButton.addEventListener("click", () => {
      console.log("rotate");
      this.handleRotate();
    });
  }

  handleRotate() {
    // Create a new StrategyDetails object with the necessary information
    const piece = this.game.gameBoard.getSingleMapPiece(
      this.game.currentMapPieceIndex
    );
    let details = new StrategyDetails()
      .setPiece(piece)
      .setGamePhase(this.game.turnManager.gamePhase)
      .setCurrentMapPieceIndex(this.game.currentMapPieceIndex)
      .build();

    this.game.executeStrategy("rotate", details);
  }

  // Handle mouseover event
  handleHoverEnter(cellElement) {
    // Add the hovered class to the cell element
    cellElement.classList.add("hovered");

    // Get the row and column of the cell element
    const row = parseInt(cellElement.dataset.row);
    const col = parseInt(cellElement.dataset.col);

    // Create a new StrategyDetails object with the necessary information
    const piece = this.game.gameBoard.getSingleMapPiece(
      this.game.currentMapPieceIndex
    );
    let details = new StrategyDetails()
      .setPiece(piece)
      .setCellElement(cellElement)
      .setGamePhase(this.game.turnManager.gamePhase)
      .setX(col)
      .setY(row)
      .setToggleFlag(true)
      .setCurrentMapPieceIndex(this.game.currentMapPieceIndex)
      .build();

    // Execute the renderMovePreview strategy with the details object
    this.game.executeStrategy("renderMovePreview", details);
  }

  // Handle mouseout event
  handleHoverLeave(cellElement) {
    // Remove the hovered class from the cell element
    cellElement.classList.remove("hovered");

    // Create a new StrategyDetails object with the necessary information
    const piece = this.game.gameBoard.getSingleMapPiece(
      this.game.currentMapPieceIndex
    );
    const row = parseInt(cellElement.dataset.row);
    const col = parseInt(cellElement.dataset.col);
    let details = new StrategyDetails()
      .setCellElement(cellElement)
      .setCurrentMapPieceIndex(this.game.currentMapPieceIndex)
      .setGamePhase(this.game.turnManager.gamePhase)
      .setPiece(piece)
      .setX(col)
      .setY(row)
      .setToggleFlag(false)
      .build();

    // Execute the renderMovePreview strategy with the details object
    this.game.executeStrategy("renderMovePreview", details);
  }

  // Handle click event
  handleClick(cellElement) {
    // Get the row and column of the cell element
    const row = parseInt(cellElement.dataset.row);
    const col = parseInt(cellElement.dataset.col);

    // Create a new StrategyDetails object with the necessary information
    const piece = this.game.gameBoard.getSingleMapPiece(
      this.game.currentMapPieceIndex
    );
    let details = new StrategyDetails()
      .setPiece(piece)
      .setX(col)
      .setY(row)
      .setCurrentMapPieceIndex(this.game.currentMapPieceIndex)
      .setCellElement(cellElement)
      .setGamePhase(this.game.turnManager.gamePhase)
      .setTurn(this.game.turnManager.currentTurn)
      .setCurrentPlayer(this.game.currentPlayer)
      .build();

    // Execute the placeMapPiece or placeStone strategy based on the game phase
    if (this.game.turnManager.gamePhase === MAP_PHASE) {
      this.game.executeStrategy("placeMapPiece", details);
    } else if (this.game.turnManager.gamePhase === STONE_PHASE) {
      this.game.executeStrategy("placeStone", details);
    }
  }
}
