import shapes from "../shapes.json";
import Konva from "konva";
import {ModalWindow, roundBalance} from "../functions";
import {ObjectBase} from "./ObjectBase";
import {hideAllModals} from "../floor_plan";

const DEFAULT_FILL_COLOR = '#fe4a35';

export default class ObjectGM extends ObjectBase {
    constructor(object) {
        super(object);

        this.props = {};
        for (let key in object) {
            this.props[key] = object[key];
        }

        this.view = {
            modalWindow : new ModalWindow(object),
            number : new Konva.Text({
                x: 10,
                y: 19,
                text: object.Number ?? '-',
                width: 30,
                align: 'center',
                fontSize: 13,
                fontStyle: 'bold',
                fill: 'black',
            }),
            denomination : new Konva.Text({
                x: 10,
                y: 37,
                text: object.Denomination ?? '-',
                width: 30,
                align: 'center',
                fontSize: 13,
                fontStyle: 'bold',
                fill: 'white',
            }),
            balance : new Konva.Text({
                x: 10,
                y: 3,
                text: object.Balance ? roundBalance(object.Balance) : '-',
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

        const spriteChild = new Konva.Group({
            name: `sprite-child`,
        });

        spriteChild.add(this.view.shape);
        spriteChild.add(this.view.number);
        spriteChild.add(this.view.denomination);
        spriteChild.add(this.view.balance);
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
                this.view.denomination.text(data.options.Denomination ?? '-');
                this.view.balance.text(data.options.Balance ? roundBalance(data.options.Balance) : '-');
                let values = [
                    data.options.SMIB         ?? '-',
                    data.options.ID           ?? '-',
                    data.options.Name         ?? '-',
                    data.options.Denomination ?? '-',
                    data.options.Balance      ?? '-'
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