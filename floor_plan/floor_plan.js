/**
 * Useful links:
 * https://usefulangle.com/post/17/html5-canvas-drawing-1px-crisp-straight-lines
 * https://stackoverflow.com/questions/49758261/draw-rectangle-with-mouse-and-fill-with-color-on-mouseup
 */

import 'regenerator-runtime/runtime';
import StageRenderer from "./StageRenderer";
import { createHallObject } from "./createObject";
import config from "./config";

let hallObjects     = [];
let unlinkedObjects = [];
let tableData       = {
    linked: {
        slots:          [],
        roulettes:      [],
        cashdesks:      [],
        videoservers:   [],
    },
    unlinked: {
        slots:          [],
        roulettes:      [],
        cashdesks:      [],
        videoservers:   [],
    }
};

let address = new URL(window.location);
let hallID  = address.searchParams.get('hall_id');
let action  = address.searchParams.get('action');
let GHID    = address.searchParams.get('gh_id');

let saveButton = document.getElementById('save');

window.onload = function () {
    window.Stage = new StageRenderer().stage;

    getObjects()
        .then(data => {
            data.object_list.forEach((item, index) => {
                if (item.ObjectID != null) {
                    let object;
                    object = createHallObject(item);
                    hallObjects.push(object);
                } else {
                    unlinkedObjects.push(item);
                }
            })
        })
        .then(() => {
            prepareTablesData();
            fillTables();
            addTablesClickHandler();
        })
        .then(() => saveButton.onclick = saveObjects)
        .then(() => {
            if(action === 'view') {
                setInterval(updateObjectsProperties, config.updateIntervalMs);
            }
        });

    fetchHalls(GHID)
        .then(response => response.json())
        .then(data => fillHallsSelect(data));

    if (action === "edit") {
        saveButton.removeAttribute("hidden");
    }
}

async function getObjects() {
    let payload = {
        'HallID': hallID,
    }

    let response = await WebLogic.main.WebLogicAPI.fetch('hall', 'getHallObjects', payload);

    if (response.processed)
        return;

    if (response.ok) {
        const API_STATUS_INVALID_HALLID       = 1001;
        const API_STATUS_CANT_GET_HALL_OBJECTS= 1002;
        switch (response.json.status) {
            case WebLogic.main.WebLogicAPI.Status.API_STATUS_SUCCESS:
                return response.json;
            case API_STATUS_INVALID_ENTITYID:
            case API_STATUS_INVALID_OBJECTTYPE:
                toastr.error('{t}Internal server error{/t}');
                break;
            default:
                toastr.error('{t}Invalid response from server{/t}');
                break;
        }
    } else {
        toastr.error('{t}Invalid response from server{/t}');
    }
}

function prepareTablesData() {
    hallObjects.forEach((item, index) => {
        item.index  = index;
        switch (item.source.ObjectType) {
            case 'Slot':
                tableData.linked.slots.push(item);
                break;
            case 'Roulette':
                tableData.linked.roulettes.push(item);
                break;
            case 'Cashdesk':
                tableData.linked.cashdesks.push(item);
                break;
            case 'Videoserver':
                tableData.linked.videoservers.push(item);
                break;
        }
    });

    unlinkedObjects.forEach((item, index) => {
        item.index = index;
        switch (item.ObjectType) {
            case 'Slot':
                tableData.unlinked.slots.push(item);
                break;
            case 'Roulette':
                tableData.unlinked.roulettes.push(item);
                break;
            case 'Cashdesk':
                tableData.unlinked.cashdesks.push(item);
                break;
            case 'Videoserver':
                tableData.unlinked.videoservers.push(item);
                break;
        }
    });
}

function fillTables() {
    $('#tableSlotsOnPlan').bootstrapTable({
        data: tableData.linked.slots
    });

    $('#tableFreeSlots').bootstrapTable({
        data: tableData.unlinked.slots
    });

    $('#tableRoulettesOnPlan').bootstrapTable({
        data: tableData.linked.roulettes
    });

    $('#tableFreeRoulettes').bootstrapTable({
        data: tableData.unlinked.roulettes
    });

    $('#tableCashdesksOnPlan').bootstrapTable({
        data: tableData.linked.cashdesks
    });

    $('#tableFreeCashdesks').bootstrapTable({
        data: tableData.unlinked.cashdesks
    });

    $('#tableVideoServersOnPlan').bootstrapTable({
        data: tableData.linked.videoservers
    });

    $('#tableFreeVideoServers').bootstrapTable({
        data: tableData.unlinked.videoservers
    });
}

function addTablesClickHandler() {
    $('.tableObjects').on('click-cell.bs.table', function (e, field, value, row) {
        if (field === 'source.Number') {
            hallObjects[row.index].sprite.moveToTop();
            hallObjects[row.index].modalWindow.toggle();
        } else if (field === 'Delete' && action === "edit") {
            hallObjects[row.index].delete();
        } else if (field === 'Add' && action === "edit") {
            addToPlaneObject(row.index);
        }
    });
}

function addToPlaneObject(index) {
    let object = createHallObject(unlinkedObjects[index]);
    hallObjects.push(object);
    unlinkedObjects.splice([index], 1);
    tableData       = {
        linked: {
            slots:          [],
            roulettes:      [],
            cashdesks:      [],
            videoservers:   [],
        },
        unlinked: {
            slots:          [],
            roulettes:      [],
            cashdesks:      [],
            videoservers:   [],
        }
    };
    prepareTablesData();
    $('#tableSlotsOnPlan').bootstrapTable('load', tableData.linked.slots);
    $('#tableFreeSlots').bootstrapTable('load', tableData.unlinked.slots);
    $('#tableRoulettesOnPlan').bootstrapTable('load', tableData.linked.roulettes);
    $('#tableFreeRoulettes').bootstrapTable('load', tableData.unlinked.roulettes);
    $('#tableCashdesksOnPlan').bootstrapTable('load', tableData.linked.cashdesks);
    $('#tableFreeCashdesks').bootstrapTable('load', tableData.unlinked.cashdesks);
    $('#tableVideoServersOnPlan').bootstrapTable('load', tableData.linked.videoservers);
    $('#tableFreeVideoServers').bootstrapTable('load', tableData.unlinked.videoservers);
}

function saveObjects() {
    hallObjects.forEach((object) => {
        if (object.hasChanges()) {
            object.save();
        }
    });
}

function updateObjectsProperties() {
    hallObjects.forEach((object) => {
        object.getOptions();
    });
}

function fetchHalls(GHID) {
    const formData   = new FormData();

    formData.append(`action`, `get`);
    formData.append(`GHID`, GHID);

    return fetch(`/admin/halls.php`, {
        method: `POST`,
        body: formData,
    });
}

export function addNewWall(x, y) {
    let newWallData = {
        ObjectID:   null,
        EntityID:   null,
        ObjectType: "Wall",
        ParentID:   null,
        CustomData: {Points:[0,0,100,100]},
        x:          x,
        y:          y,
    };
    let object = createHallObject(newWallData);
    hallObjects.push(object);
}

function fillHallsSelect(data) {
    data.halls.forEach(function(item) {
        let newOption = new Option(item.name, item.id);
        if (item.deleted === false) {
            selectRoom.append(newOption);
        }
        newOption.selected = (item.id === Number(hallID));
    });
    selectRoom.disabled = (action === 'edit');
    selectRoom.onchange = function() {
        let newHallID = selectRoom.value;
        address.searchParams.set('hall_id', String(newHallID));
        window.location = address;
    }
}

export function hideAllModals(params) {
    hallObjects.forEach((object) => {
        if (object.id !== params.id) {
            object.hideModalWindow();
        }
    });
}

window.deleteFormatter = function() {
    if (action === "edit") {
        return '<a href="" title="Remove"><i class="fa fa-trash"></i></a>';
    } else {
        return '';
    }
}

window.addFormatter = function() {
    if (action === "edit") {
        return '<i class="fa fa-map-marker"></i></a>';
    } else {
        return '';
    }
}

window.slotSMIBFormatter = function(value, row, index) {
    return `<a href="club.php?gh_id=${ GHID }" title="Edit">${ value } <i class="fa fa-edit"></i></a>`;
}

window.cashdeskIDFormatter = function(value, row, index) {
    return `<a href="cashdesk.php?gh_id=${ GHID }&cashdesk=${ hallObjects[row.index].source.EntityID }" title="Edit">${ value } <i class="fa fa-edit"></i></a>`;
}

window.videoserverIDFormatter = function(value, row, index) {
    return `<a href="videoservers.php?gh_id=${ GHID }" title="Edit">${ value } <i class="fa fa-edit"></i></a>`;
}