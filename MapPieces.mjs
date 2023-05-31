import {
    GRID_SIZE,
    GRID_OFFSET,
    TOTAL_RESOURCES,
    STARTING_PHASE,
    PIECE_SHAPE_SIZE,
    PIECE_COUNT,
    INITIAL_SHAPE_VALUE,
    FORCED_PIECE_SHAPE_THRESHOLD,
    ADJACENT_OFFSETS
} from './Constants.mjs';

import { TurnManager, HistoryManager, HistoryTracker, ScoreTracker, Player, GlobalWarming, Logger, InfoAlert, StrategyDetails } from './GameManagement.mjs';
import { BoardState, BoardStateSearcher, BoardStateEditor, MoveValidator, ValidateMapPiecePlacementStrategy, AddStoneStrategy, AddMapPieceStrategy, AddNaturalResourceStrategy } from './BoardManagement.mjs';

import { RenderManager, StatusRenderer, BoardRenderer, MovePreviewRenderer, EventListener } from './UIManagement.mjs';

//A class that generates map pieces of different shapes and color as per specific rules
export class MapPieceGenerator {
    constructor(PIECE_SHAPE_SIZE, PIECE_COUNT) {
        this.PIECE_SHAPE_SIZE = PIECE_SHAPE_SIZE;
        this.PIECE_COUNT = PIECE_COUNT;
        this.mapPieces = new Array(this.PIECE_COUNT);
        this.generatedPieceCount = 0;
        this.uniqueColorIndices = [...Array(this.PIECE_COUNT).keys()];
    }

    initializeMapPieces() {
        for (let i = 0; i < this.PIECE_COUNT; i++) {
            const shape = this.createPieceShape();
            const shapeRelativeSquareLocations =
                this.getshapeRelativeSquareLocations(shape);
            this.mapPieces[i] = new MapPiece(
                i,
                shape,
                MapPieceGenerator.generateRandomColor(this.uniqueColorIndices),
                shapeRelativeSquareLocations
            );
        }
        return this.mapPieces;
    }

    getshapeRelativeSquareLocations(shape) {
        const shapeRelativeSquareLocations = [];
        let index = 0;
        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                if (shape[i][j] === 1) {
                    shapeRelativeSquareLocations.push({
                        x: j,
                        y: i,
                        index: index++,
                    });
                }
            }
        }
        return shapeRelativeSquareLocations;
    }
    recreateShapefromRelativeLocations() { }

    static generateRandomColor(colorIndices) {
        const colors = [
            "red",
            "blue",
            "green",
            "yellow",
            "purple",
            "orange",
            "cyan",
            "magenta",
            "brown",
            "lime",
        ];
        return colors[colorIndices.pop()];
    }

    createPieceShape() {
        let shape = Array.from(
            {
                length: this.PIECE_SHAPE_SIZE,
            },
            () => new Array(this.PIECE_SHAPE_SIZE).fill(0)
        );
        const directions = [
            {
                dx: -1,
                dy: 0,
            },
            {
                dx: 1,
                dy: 0,
            },
            {
                dx: 0,
                dy: -1,
            },
            {
                dx: 0,
                dy: 1,
            },
        ];
        const center = Math.floor(this.PIECE_SHAPE_SIZE / 2);
        shape[center][center] = INITIAL_SHAPE_VALUE;
        let x = center;
        let y = center;
        // Determine the number of remaining cells based on the generatedPieceCount
        let remaining =
            this.generatedPieceCount < FORCED_PIECE_SHAPE_THRESHOLD
                ? FORCED_PIECE_SHAPE_THRESHOLD
                : Math.floor(Math.random() * 5) + 2;
        while (remaining > 0) {
            const { dx, dy } =
                directions[Math.floor(Math.random() * directions.length)];
            x += dx;
            y += dy;
            if (
                x >= 0 &&
                y >= 0 &&
                x < this.PIECE_SHAPE_SIZE &&
                y < this.PIECE_SHAPE_SIZE &&
                shape[y][x] === 0
            ) {
                shape[y][x] = INITIAL_SHAPE_VALUE;
                remaining--;
            } else {
                x -= dx;
                y -= dy;
            }
        }
        this.generatedPieceCount++; // Increment the counter after generating a piece
        return shape;
    }
}

//A map piece object that can be placed on the board, generated by the the MapPieceGenerator

export class MapPiece {
    constructor(id, shape, color, shapeRelativeSquareLocations) {
        this.id = id;
        this.shape = shape;
        this.emperor = null;
        this.stoneCount = 0;
        this.color = color;
        this.shapeRelativeSquareLocations = shapeRelativeSquareLocations;
        (this.shapeRelativeStoneFlags = new Array(
            this.shapeRelativeSquareLocations.length
        ).fill(false)),
            (this.boardRelativeSquareLocations = new Array(
                this.shapeRelativeSquareLocations.length
            ).fill({
                x: null,
                y: null,
            }));
    }
}