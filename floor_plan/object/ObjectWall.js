import shapes from "../shapes.json";
import Konva from "konva";
import config from "../config";
import {ModalWindow, roundBalance} from "../functions";
import {ObjectBase} from "./ObjectBase";
import {ContextMenu} from "./ContextMenu";

const DEFAULT_FILL_COLOR = '#fe4a35';
const MENU_APPEARANCE_COORDINATE_SHIFT = 4;

export default class ObjectWall extends ObjectBase {
    constructor(object) {
        super(object);

        this.props = {};
        for (let key in object) {
            this.props[key] = object[key];
        }

        const cellSize = config.stage.grid.cellSize;
        this.isEditMode     = false;

        this.view = {
            spriteChild : new Konva.Group({
                x: cellSize,
                y: cellSize,
                offset: {
                    x: cellSize,
                    y: cellSize,
                },
                name: `sprite-child`,
            }),
            shape : new Konva.Line({
                points: object.CustomData.Points,
                stroke: 'grey',
                strokeWidth: 15,
                lineCap: 'square',
                id: 'line',
            }),
            menuWindow : new ContextMenu(),
            anchors         : [],
            isMenuHidden    : true,
        };

        this.view.spriteChild.add(this.view.shape);
        this.view.spriteChild.add(this.view.menuWindow.getContextMenu());

        this.view.shape.on('contextmenu', (e) => {
            e.evt.preventDefault();
            if (this.isEditMode) {
                if (this.view.isMenuHidden) {
                    let menuItemArr = [
                        {
                            text : 'Add point',
                            onClick : () => {
                                this.addNewPoint();
                                this.updateWall();
                                this.view.isMenuHidden = true;
                                this.view.menuWindow.hide();
                            }
                        },
                        {
                            text : 'Remove wall',
                            onClick : () => {
                                super.delete().then(response => response.ok ? document.location.reload() : null);
                                this.view.isMenuHidden = true;
                                this.view.menuWindow.hide();
                            }
                        },
                    ];
                    this.view.menuWindow.updateItems(menuItemArr);
                    this.view.menuWindow.setCoordinates(
                        this.view.spriteChild.getRelativePointerPosition().x + MENU_APPEARANCE_COORDINATE_SHIFT,
                        this.view.spriteChild.getRelativePointerPosition().y + MENU_APPEARANCE_COORDINATE_SHIFT
                    );
                    this.view.menuWindow.show();
                    this.view.isMenuHidden = false;
                } else {
                    this.view.menuWindow.hide();
                    this.view.isMenuHidden = true;
                }
            }
        });

        this.view.spriteChild.on('dblclick', () => {
            if (!this.isEditMode) {
                this.buildExistingPoints();
                this.isEditMode = true;
            } else {
                this.deleteAllPoints();
                this.hideModalWindow();
                this.isEditMode = false;
            }
        });

        super.render(this.view.spriteChild);
    }

    buildAnchor(x, y) {
        const anchor = new Konva.Circle({
            x: x,
            y: y,
            radius: 10,
            stroke: '#666',
            fill: '#ddd',
            strokeWidth: 2,
            draggable: true,
        });

        anchor.on('mouseover', function () {
            document.body.style.cursor = 'pointer';
            this.strokeWidth(4);
        });
        anchor.on('mouseout', function () {
            document.body.style.cursor = 'default';
            this.strokeWidth(2);
        });

        anchor.on('dragmove', () => {
           this.updateWall();
        });

        anchor.on('contextmenu', (e) => {
            e.evt.preventDefault();
            this.view.menuWindow.hide();
            this.showRemovePointMenu(e.target._id);
        });

        return anchor;
    }

    updateWall() {
        let points = [];
        this.view.anchors.forEach(function(item) {
            points.push(item.attrs.x);
            points.push(item.attrs.y);
        });
        this.view.shape.attrs.points = points;
    }

    buildExistingPoints() {
        let i = 0;
        let x = 0;
        let y = 0;
        let anchor;
        while (i < this.view.shape.attrs.points.length) {
            x = this.view.shape.attrs.points[i];
            i++;
            y = this.view.shape.attrs.points[i];
            i++;
            anchor = this.buildAnchor(x, y);
            this.view.spriteChild.add(anchor);
            this.view.anchors.push(anchor);
        }
    }

    addNewPoint() {
        let x = this.view.anchors.at(-1).attrs.x + 50;
        let y = this.view.anchors.at(-1).attrs.y + 50;
        let anchor = this.buildAnchor(x, y);
        this.view.spriteChild.add(anchor);
        this.view.anchors.push(anchor);
    }

    deleteAllPoints() {
        this.view.anchors.forEach(function(item) {
            item.destroy();
        });
        this.view.anchors = [];
    }

    deleteLastPoint() {
        this.view.anchors.at(-1).destroy();
        this.view.anchors.splice(-1, 1);
    }

    deletePointByID(id) {
        let pointIndex = null;
        this.view.anchors.forEach(function(item, index) {
            if (item._id === id) {
                item.destroy();
                pointIndex = index;
            }
        });
        this.view.anchors.splice(pointIndex, 1);
    }

    showRemovePointMenu(id) {
        let menuItemArr = [
            {
                text : 'Remove point',
                onClick : () => {
                this.deletePointByID(id);
                    this.updateWall();
                    this.view.menuWindow.hide();
                }
            },
        ];
        this.view.menuWindow.updateItems(menuItemArr);
        this.view.menuWindow.setCoordinates(
            this.view.spriteChild.getRelativePointerPosition().x + MENU_APPEARANCE_COORDINATE_SHIFT,
            this.view.spriteChild.getRelativePointerPosition().y + MENU_APPEARANCE_COORDINATE_SHIFT
            );
        this.view.menuWindow.show();
    }

    save(data = null) {
        let customData = {
            Points: this.view.shape.attrs.points,
        };
        super.save(customData);
    }

    hasChanges() {
        return super.hasChanges() || (JSON.stringify(this.view.shape.attrs.points) !== JSON.stringify(this.source.CustomData.Points));
    }

    async getOptions() {

    }

    hideModalWindow() {
        this.view.menuWindow.hide();
    }
}