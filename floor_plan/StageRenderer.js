/**
 * Renders stage with its background, grid, and working layout
 */
import config from "./config";
import Konva from "konva";
import {addNewWall, hideAllModals} from "./floor_plan";

const SCALE_STEP = 0.99;
const SCALE_MIN = 0.5;
const SCALE_MAX = 2;

export default class StageRenderer {
    constructor() {
        const container         = config.stage.container;
        const gridStroke        = config.stage.grid.gridStroke;

        this.stage = new Konva.Stage({
            container: container,
            width: 	   container.offsetWidth,
            height:    container.offsetHeight,
            draggable: true
        });

        this.layer  = new Konva.Layer({
            x: gridStroke / 2,
            y: gridStroke / 2
        });

        this.grid = new Konva.Group({
            id: `grid`,
            cursor: `pointer`,
        });

        this.layout = new Konva.Group({
            id: `layout`
        });

        this.layer.add(this.grid);
        this.layer.add(this.layout);
        this.stage.add(this.layer);

        this.drawGrid();

        //Add context menu
        this.isEditMode     = true;
        this.isMenuHidden   = true;
        this.menuWindow = new Konva.Group({
            name: `menuWidow`,
        });
        this.menuBox = new Konva.Rect({
            height: 25,
            x: 0,
            y: 3,
            stroke: '#04a9f3',
            strokeWidth: 1,
            fill: '#f2f2f2',
            width: 120,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffsetX: 5,
            shadowOffsetY: 5,
            shadowOpacity: 0.2,
            cornerRadius: 2,
        });
        this.menuAddWall = new Konva.Text({
            y: 0,
            text: 'Add wall',
            x: 0,
            width: 120,
            padding: 10,
            align: 'left',
            fontSize: 13,
            fill: 'black',
        });
        this.menuAddWall.on('click', () => {
            addNewWall(this.menuWindow.x(), this.menuWindow.y());
            this.menuWindow.remove();
            this.isMenuHidden = true;
        });
        this.menuWindow.add(this.menuBox );
        this.menuWindow.add(this.menuAddWall);

        //Bind events
        this.stage.on(`dragmove`, this.onMove);
        this.stage.on(`wheel`, this.onZoom);
        this.stage.on('contextmenu', this.onContextMenu);

        addEventListener('resize', this.onWindowResize);
    }

    drawGrid = () => {
        const gridColor         = config.stage.grid.gridColor;
        const gridStroke        = config.stage.grid.gridStroke;
        const backgroundColor   = config.stage.grid.backgroundColor;
        const cellSize          = config.stage.grid.cellSize;
        const stageWidth        = this.stage.width();
        const stageHeight       = this.stage.height();
        const stageMaxWidth     = stageWidth * SCALE_MAX;
        const stageMaxHeight    = stageHeight * SCALE_MAX;

        // Reset grid
        this.grid.destroyChildren();

        // Draw background
        this.grid.add(
            new Konva.Rect({
                x:      0,
                y:      0,
                width:  stageMaxWidth + cellSize,
                height: stageMaxHeight + cellSize,
                fill:   backgroundColor,
            })
        );

        // Draw vertical grid lines
        for (let i = 0; i < stageMaxWidth / cellSize + 1; i++) {
            let x = i * cellSize;
            this.grid.add(
                new Konva.Line({
                    points:         [x, 0, x, stageMaxHeight + cellSize],
                    stroke:         gridColor,
                    strokeWidth:    gridStroke,
                })
            );
        }

        // Draw horizontal grid lines
        for (let i = 0; i < stageMaxHeight / cellSize + 1; i++) {
            let y = i * cellSize;
            this.grid.add(
                new Konva.Line({
                    points:         [0, y, stageMaxWidth + cellSize, y],
                    stroke:         gridColor,
                    strokeWidth:    gridStroke,
                })
            );
        }

        this.grid.on('mouseover', () => {
            document.body.style.cursor = 'move';
        });

        this.grid.on('mouseout', () => {
            document.body.style.cursor = 'default';
        });

        this.grid.on('click', hideAllModals);

        this.grid.draw();
    }

    onMove = () => {
        const cellSize  = config.stage.grid.cellSize;
        const offset    = dragMove => Math.floor(dragMove / cellSize) * cellSize;

        this.grid.x(-cellSize - offset(this.stage.x() / this.stage.scaleX()));
        this.grid.y(-cellSize - offset(this.stage.y() / this.stage.scaleY()));
    }

    onZoom = e => {
        e.evt.preventDefault();

        let oldScale    = this.stage.scaleX();
        let pointer     = this.stage.getPointerPosition();

        let mousePointTo = {
            x: (pointer.x - this.stage.x()) / oldScale,
            y: (pointer.y - this.stage.y()) / oldScale,
        };

        let direction = e.evt.deltaY > 0 ? 1 : -1;

        // when we zoom on trackpad, e.evt.ctrlKey is true
        // in that case lets revert direction
        if (e.evt.ctrlKey) {
            direction = -direction;
        }

        let newScale = direction > 0 ? oldScale * SCALE_STEP : oldScale / SCALE_STEP;

        if (newScale > SCALE_MIN && newScale < SCALE_MAX) {
            this.stage.scale({x: newScale, y: newScale});

            let newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };

            this.stage.position(newPos);
            this.onMove();
        }
    };

    onContextMenu = e => {
        e.evt.preventDefault();
        if (e.target.parent.attrs.id === 'grid') {
            this.menuWindow.x(this.stage.getRelativePointerPosition().x + 4);
            this.menuWindow.y(this.stage.getRelativePointerPosition().y + 4);
            if (this.isEditMode) {
                if (this.isMenuHidden) {
                    this.layer.add(this.menuWindow);
                    this.isMenuHidden = false;
                } else {
                    this.menuWindow.remove();
                    this.isMenuHidden = true;
                }
            }
        }
    }

    onWindowResize = () => {
        // Set to 0 in order to make #stage block smaller
        this.stage.width(0);
        this.stage.height(0);

        const stage       = document.getElementById(`stage`);
        const stageWidth  = stage.offsetWidth;
        const stageHeight = stage.offsetHeight;

        this.stage.width(stageWidth);
        this.stage.height(stageHeight);
    }
}
