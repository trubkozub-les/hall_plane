import Konva from "konva";

export class ContextMenu {
    constructor(menuItemsArr = null) {
        this.contextMenu = new Konva.Group({
            name: `contextMenu`,
        });
        if (menuItemsArr) {
            const menuBox = new Konva.Rect({
                height: menuItemsArr.length * 25,
                x: 0,
                y: 0,
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
            this.contextMenu.add(menuBox);

            menuItemsArr.forEach((item, index) => {
                const menuItem = new Konva.Text({
                    y: index * 25 - 3,
                    text: item.text,
                    x: 0,
                    width: 120,
                    padding: 10,
                    align: 'left',
                    fontSize: 13,
                    fill: 'black',
                });
                menuItem.on('click', item.onClick);
                this.contextMenu.add(menuItem);
            });
        }
    }

    getContextMenu() {
        return this.contextMenu;
    }

    setCoordinates(x, y) {
        this.contextMenu.x(x);
        this.contextMenu.y(y);
    }

    updateItems(menuItemsArr) {
        this.contextMenu.destroyChildren();
        const menuBox = new Konva.Rect({
            height: menuItemsArr.length * 25,
            x: 0,
            y: 0,
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
        this.contextMenu.add(menuBox);

        menuItemsArr.forEach((item, index) => {
            const menuItem = new Konva.Text({
                y: index * 25 - 3,
                text: item.text,
                x: 0,
                width: 120,
                padding: 10,
                align: 'left',
                fontSize: 13,
                fill: 'black',
            });
            menuItem.on('click', item.onClick);
            this.contextMenu.add(menuItem);
        });
    }

    toggle() {
        if(this.contextMenu.isVisible()) {
            this.contextMenu.hide();
        } else {
            this.contextMenu.show();
        }
    }

    show() {
        this.contextMenu.show();
    }

    hide() {
        this.contextMenu.hide();
    }
}