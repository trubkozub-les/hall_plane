import {ObjectGM, ObjectCashbox, ObjectVideo, ObjectWall} from "./object";

export const createHallObject = data => {
    let object;
    switch (data.ObjectType) {
        case "Slot":
            object = new ObjectGM(data);
            break;
        case "Roulette":
            object = new ObjectGM(data);
            break;
        case "Cashdesk":
            object = new ObjectCashbox(data);
            break;
        case "Videoserver":
            object = new ObjectVideo(data);
            break;
        case "Wall":
            object = new ObjectWall(data);
            break;
        default:
            console.error(`Unknown object type ${item.ObjectType}`);
            break;
    }
    return object;
};