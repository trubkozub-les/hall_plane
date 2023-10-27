import config from "./config";
import Konva from "konva";

export
    const
        findStageDataIndexById = id => {
            return window.StageData.findIndex(item => parseFloat(item.id) === parseFloat(id));
        },
        roundCellSize = axe => {
            return Math.round(axe / config.stage.grid.cellSize) * config.stage.grid.cellSize;
        },
        intersection = (r1, r2) => {
            return !(
                r2.x >= r1.x + r1.width  ||
                r2.x + r2.width <= r1.x  ||
                r2.y >= r1.y + r1.height ||
                r2.y + r2.height <= r1.y
            );
        },
        roundBalance = (balance) => {
    if (balance > 9999 && balance < 1000000) {
        return Math.round(balance / 1000) + 'k';
    } else if(balance > 999999) {
        return Math.round(balance / 1000000) + 'm';
    } else {
        return balance;
    }
        };

export class ModalWindow {

    constructor(object) {
        this.modalWindow = new Konva.Group({
            name: `modalWidow`,
        });
        switch (object.ObjectType) {
            case `Slot`:
            case `Roulette`:
                this.headers        = ['Active', 'SMIB', 'ID', 'Name', 'Denom', 'Balance'];
                this.headersString  = this.headers.map(header => header + ":").join("\n\n");
                this.values         = [
                    object.SMIB         ?? '-',
                    object.EntityID     ?? '-',
                    object.Name         ?? '-',
                    object.Denomination ?? '-',
                    object.Balance      ?? '-'
                ];
                this.valuesString   = this.values.map(value => value).join("\n\n");
                break;
            case `Cashdesk`:
                this.headers        = ['Active', 'ID', 'Name', 'Time', 'Employee', 'Balance'];
                this.headersString  = this.headers.map(header => header + ":").join("\n\n");
                this.values         = [
                    object.EntityID      ?? '-',
                    object.Name          ?? '-',
                    object.Time           ? msToTime(object.Time * 1000, true) : '-',
                    object.EmployeeName  ?? '-',
                    object.Balance       ?? '-'
                ];
                this.valuesString   = this.values.map(value => value).join("\n\n");
                break;
            case `Videoserver`:
                this.headers        = ['Active', 'Name', 'IP', 'Animation'];
                this.headersString  = this.headers.map(header => header + ":").join("\n\n");
                this.values         = [
                    object.Name             ?? '-',
                    object.IP               ?? '-',
                    object.AnimationPeriod  ?? '-'
                ];
                this.valuesString   = this.values.map(value => value).join("\n\n");
                break;
            default:
                break;
        }

        this.number = new Konva.Text({
            text: 'Terminal #' + (object.Number ?? '-'),
            ...ModalWindowDefault.Number,
        });
        this.checkMark = new Konva.Text({
            height: this.number.height(),
            ...ModalWindowDefault.CheckMark,
        });
        this.blueRect = new Konva.Rect({
            height: this.number.height(),
            ...ModalWindowDefault.BlueRect,
        });
        this.YesNo = new Konva.Text({
            y: 50 + this.number.height(),
            text: (object.active ? 'Yes' : 'No'),
            fill: (object.active ? '#5cb85c' : '#fe4a35'),
            ...ModalWindowDefault.YesNo,
        });
        this.modalHeaders = new Konva.Text({
            y: 50 + this.number.height(),
            text: this.headersString,
            ...ModalWindowDefault.ModalHeaders,
        });
        this.modalTexts = new Konva.Text({
            y: 50 + this.number.height() + this.YesNo.height(),
            text: this.valuesString,
            ...ModalWindowDefault.ModalTexts,
        });
        this.modalBox = new Konva.Rect({
            height: this.modalHeaders.height() + this.number.height(),
            ...ModalWindowDefault.ModalBox,
        });

        this.modalWindow.add(this.modalBox);
        this.modalWindow.add(this.blueRect);
        this.modalWindow.add(this.number);
        this.modalWindow.add(this.checkMark);
        this.modalWindow.add(this.YesNo);
        this.modalWindow.add(this.modalHeaders);
        this.modalWindow.add(this.modalTexts);

        this.modalWindow.hide();
    }

    get window() {
        return this.modalWindow;
    }

    toggle() {
        if(this.modalWindow.isVisible()) {
            this.modalWindow.hide();
        } else {
            this.modalWindow.show();
        }
    }

    show() {
        this.modalWindow.show();
    }

    hide() {
        this.modalWindow.hide();
    }

}


const ModalWindowDefault = {
    Number: {
        x: 0,
        y: 50,
        width: 120,
        padding: 10,
        align: 'left',
        fontSize: 14,
        fontStyle: 'bold',
        fill: 'white',
    },
    CheckMark: {
        x: 120,
        y: 50,
        text: '✓',
        width: 70,
        padding: 10,
        align: 'right',
        verticalAlign: 'top',
        fontSize: 18,
        fontStyle: 'bold',
        fill: 'white',
    },
    BlueRect: {
        x: 0,
        y: 50,
        fill: '#04a9f3',
        width: 190,
        cornerRadius: 2,
    },
    YesNo: {
        x: 70,
        width: 120,
        height: 26,
        padding: 10,
        align: 'left',
        fontSize: 13,
        fontStyle: 'bold',
    },
    ModalHeaders: {
        x: 0,
        width: 90,
        padding: 10,
        align: 'left',
        fontSize: 13,
        fill: 'black',
    },
    ModalTexts: {
        x: 70,
        width: 120,
        padding: 10,
        align: 'left',
        fontSize: 13,
        fontStyle: 'bold',
        fill: 'black',
        wrap: 'none',
        ellipsis: true,
    },
    ModalBox: {
        x: 0,
        y: 50,
        stroke: '#04a9f3',
        strokeWidth: 1,
        fill: '#f2f2f2',
        width: 190,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffsetX: 5,
        shadowOffsetY: 5,
        shadowOpacity: 0.2,
        cornerRadius: 2,
    },

};