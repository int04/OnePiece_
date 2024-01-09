
import  Emitter  from "db://assets/src/engine/emit";
class Encoder {
    /**
     * Encode a packet into a list of strings/buffers
     */
    encode(packet) {
        return [JSON.stringify(packet)];
    }
}

class Decoder extends Emitter {
    /**
     * Receive a chunk (string or buffer) and optionally emit a "decoded" event with the reconstructed packet
     */
    add(chunk) {
        const packet = JSON.parse(chunk);
        if (this.isPacketValid(packet)) {
            this.emit("decoded", packet);
        } else {
            throw new Error("invalid format");
        }
    }
    isPacketValid({ type, data, nsp, id }) {
        const isNamespaceValid = typeof nsp === "string";
        const isAckIdValid = id === undefined || Number.isInteger(id);
        if (!isNamespaceValid || !isAckIdValid) {
            return false;
        }
        switch (type) {
            case 0: // CONNECT
                return data === undefined || typeof data === "object";
            case 1: // DISCONNECT
                return data === undefined;
            case 2: // EVENT
                return Array.isArray(data) && data.length > 0;
            case 3: // ACK
                return Array.isArray(data);
            case 4: // CONNECT_ERROR
                return typeof data === "object";
            default:
                return false;
        }
    }
    /**
     * Clean up internal buffers
     */
    destroy() {}
}


let cover = (namedataaaa, data) => {
    return '4{"type":2,"data":["'+namedataaaa+'","'+data+'"],"options":{"compress":true},"nsp":"/"}';
}

let connect = () => {
    return '4{"type":0,"data":{"sid":"X8afkNsXRxKm8C-VAAAL"},"nsp":"/"}';
}



export  { Encoder, Decoder };