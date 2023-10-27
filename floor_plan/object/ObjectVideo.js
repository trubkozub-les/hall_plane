import shapes from "../shapes.json";
import Konva from "konva";
import config from "../config";
import {ModalWindow, roundBalance} from "../functions";
import {ObjectBase} from "./ObjectBase";
import {hideAllModals} from "../floor_plan";

const DEFAULT_FILL_COLOR = '#fe4a35';

export default class ObjectVideo extends ObjectBase {
    constructor(object) {
        super(object);

        this.props = {};
        for (let key in object) {
            this.props[key] = object[key];
        }

        this.view = {
            modalWindow : new ModalWindow(object),
            number : new Konva.Text({
                x: 1,
                y: 19,
                text: object.Number ?? '-',
                width: 30,
                align: 'center',
                fontSize: 13,
                fontStyle: 'bold',
                fill: 'black',
            }),
            shape : new Konva.Path({
                data: shapes[object.ObjectType].data,
                fill: object.active ? shapes[object.ObjectType].fill : DEFAULT_FILL_COLOR,
                name: `fill-shape`,
            }),
        };

        const cellSize = config.stage.grid.cellSize;

        const spriteChild = new Konva.Group({
            x: cellSize,
            y: cellSize,
            offset: {
                x: cellSize,
                y: cellSize,
            },
            name: `sprite-child`,
        });

        spriteChild.add(this.view.shape);
        spriteChild.add(this.view.number);
        spriteChild.add(this.view.modalWindow.window);
        spriteChild.on('click', (e) => {
            e.evt.preventDefault();
            super.moveToTop();
            hideAllModals(this);
            this.view.modalWindow.toggle();
        });

        super.render(spriteChild);
    }

    getOptions() {
        super.getOptions()
            .then(data => {
                this.view.number.text(data.options.Number ?? '-');
                let values = [
                    data.options.Name             ?? '-',
                    data.options.IP               ?? '-',
                    data.options.AnimationPeriod  ?? '-',
                ];
                let valuesString   = values.map(value => value).join("\n\n");
                this.view.modalWindow.modalTexts.text(valuesString);
            });
    }

    hideModalWindow() {
        this.view.modalWindow.hide();
    }

    showModalWindow() {
        this.view.modalWindow.show();
    }
}