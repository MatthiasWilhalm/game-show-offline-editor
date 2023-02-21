class DataPackage {

    constructor(type, playerId, payload) {
        this.type = type;
        this.playerId = playerId;
        this.payload = payload;
    }

    toString() {
        return JSON.stringify({
            type: this.type,
            playerId: this.playerId,
            payload: this.payload
        });
    }

    parse(s) {
        try {
            let e = JSON.parse(s);
            if(e.type) {
                this.type = e.type;
                this.playerId = e.playerId;
                this.payload = e.payload;
            } else {
                throw "undefined object";
            }
        } catch(ex) {
            return false;
        }
        return true;
    }
}

export default DataPackage;