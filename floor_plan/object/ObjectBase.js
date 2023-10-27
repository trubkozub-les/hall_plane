import Konva from "konva";

export class ObjectBase {
    constructor(object) {
        this.source = object;
        this.x      = object.x;
        this.y      = object.y;
        this.id     = object.ObjectID;

        let address = new URL(window.location);
        let isDraggable = address.searchParams.get('action') === 'edit';
        this.sprite = new Konva.Group({
            x:          this.x,
            y:          this.y,
            draggable:  isDraggable,
            fill:       '#ccc',
            name:       'object',
        });

        this.layout = window.Stage.findOne('#layout');
    }

    render(spriteChild) {
        this.sprite.add(spriteChild);
        this.layout.add(this.sprite);
    }

    moveToTop() {
        this.sprite.moveToTop();
    }

    hasChanges() {
        let position = this.sprite.getAbsolutePosition(this.layout);
        return position.x !== this.x || position.y !== this.y;
    }

    async save(data = null) {
        let position = this.sprite.getAbsolutePosition(this.layout);

        let params = {
            ...position
        };

        if(this.id) {
            let payload = {
                'ObjectID':     this.id,
                'ObjectParam':  JSON.stringify(params),
                'CustomData':   JSON.stringify(data),
            };

            let response = await WebLogic.main.WebLogicAPI.fetch('hall', 'updateHallObject', payload);

            if (response.processed)
                return;

            if (response.ok) {
                const API_STATUS_INVALID_OBJECTID           = 1001;
                const API_STATUS_INVALID_OBJECTPARAM        = 1002;
                const API_STATUS_CANT_UPDATE_HALL_OBJECT    = 1003;
                switch (response.json.status) {
                    case WebLogic.main.WebLogicAPI.Status.API_STATUS_SUCCESS:
                        toastr.success('{t}Object saved{/t}');
                        break;
                    case API_STATUS_INVALID_OBJECTID:
                    case API_STATUS_INVALID_OBJECTPARAM:
                    case API_STATUS_CANT_UPDATE_HALL_OBJECT:
                        toastr.error('{t}Internal server error{/t}');
                        return;
                    default:
                        toastr.error('{t}Invalid response from server{/t}');
                        return;
                }
            } else {
                toastr.error('{t}Invalid response from server{/t}');
            }
        } else  {
            let address = new URL(window.location);
            let payload = {
                'HallID':       address.searchParams.get('hall_id'),
                'ObjectType':   this.source.ObjectType,
                'EntityID':     this.source.EntityID,
                'ObjectParam':  JSON.stringify(params),
                'CustomData':   JSON.stringify(data),
            };

            let response = await WebLogic.main.WebLogicAPI.fetch('hall', 'createHallObject', payload);

            if (response.processed)
                return;

            if (response.ok) {
                const API_STATUS_INVALID_HALLID         = 1001;
                const API_STATUS_INVALID_OBJECTTYPE     = 1002;
                const API_STATUS_INVALID_OBJECTPARAM    = 1003;
                const API_STATUS_CANT_CREATE_HALL_OBJECT= 1004;
                switch (response.json.status) {
                    case WebLogic.main.WebLogicAPI.Status.API_STATUS_SUCCESS:
                        toastr.success('{t}Object created{/t}');
                        break;
                    case API_STATUS_INVALID_HALLID:
                    case API_STATUS_INVALID_OBJECTTYPE:
                    case API_STATUS_INVALID_OBJECTPARAM:
                    case API_STATUS_CANT_CREATE_HALL_OBJECT:
                        toastr.error('{t}Internal server error{/t}');
                        return;
                    default:
                        toastr.error('{t}Invalid response from server{/t}');
                        return;
                }
            }
        }
    }

    async getOptions() {
        let payload = {
            'EntityID':     this.source.EntityID,
            'ObjectType':   this.source.ObjectType,
        };

        let response = await WebLogic.main.WebLogicAPI.fetch('hall', 'getHallObjectOptions', payload);

        if (response.processed)
            return;

        if (response.ok) {
            const API_STATUS_INVALID_ENTITYID           = 1001;
            const API_STATUS_INVALID_OBJECTTYPE         = 1002;
            const API_STATUS_CANT_GET_OBJECT_OPTIONS    = 1003;
            switch (response.json.status) {
                case WebLogic.main.WebLogicAPI.Status.API_STATUS_SUCCESS:
                    return response.json;
                case API_STATUS_INVALID_ENTITYID:
                case API_STATUS_INVALID_OBJECTTYPE:
                case API_STATUS_CANT_GET_OBJECT_OPTIONS:
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

    async delete() {
        let payload = {
            'ObjectID':     this.source.ObjectID,
            'RemoveChild':  0,
        };

        let response = await WebLogic.main.WebLogicAPI.fetch('hall', 'deleteHallObject', payload);

        if (response.processed)
            return;

        if (response.ok) {
            const API_STATUS_INVALID_OBJECTID           = 1001;
            const API_STATUS_INVALID_REMOVECHILD        = 1002;
            const API_STATUS_CANT_DELETE_HALL_OBJECT    = 1003;
            switch (response.json.status) {
                case WebLogic.main.WebLogicAPI.Status.API_STATUS_SUCCESS:
                    toastr.success('{t}Object deleted{/t}');
                    break;
                case API_STATUS_INVALID_OBJECTID:
                case API_STATUS_INVALID_REMOVECHILD:
                case API_STATUS_CANT_DELETE_HALL_OBJECT:
                    toastr.error('{t}Internal server error{/t}');
                    return;
                default:
                    toastr.error('{t}Invalid response from server{/t}');
                    return;
            }
        } else {
            toastr.error('{t}Invalid response from server{/t}');
        }
    }

    hideModalWindow() {

    }

    showModalWindow() {

    }
}