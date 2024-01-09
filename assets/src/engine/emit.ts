class Emitter {
    constructor() {
        this._callbacks = {};
    }

    on(event, callback) {
        this._callbacks[event] = this._callbacks[event] || [];
        this._callbacks[event].push(callback);
        return this;
    }

    once(event, callback) {
        const self = this;

        function onceCallback() {
            self.off(event, onceCallback);
            callback.apply(this, arguments);
        }

        onceCallback.fn = callback;
        this.on(event, onceCallback);
        return this;
    }

    off(event, callback) {
        this._callbacks = this._callbacks || {};

        if (arguments.length === 0) {
            this._callbacks = {};
            return this;
        }

        const callbacks = this._callbacks[event];
        if (!callbacks) return this;

        if (arguments.length === 1) {
            delete this._callbacks[event];
            return this;
        }

        let cb;
        for (let i = 0; i < callbacks.length; i++) {
            cb = callbacks[i];
            if (cb === callback || cb.fn === callback) {
                callbacks.splice(i, 1);
                break;
            }
        }

        if (callbacks.length === 0) {
            delete this._callbacks[event];
        }

        return this;
    }

    emit(event, ...args) {
        this._callbacks = this._callbacks || {};
        const callbacks = this._callbacks[event];

        if (callbacks) {
            for (let i = 0, len = callbacks.length; i < len; ++i) {
                callbacks[i].apply(this, args);
            }
        }

        return this;
    }

    listeners(event) {
        this._callbacks = this._callbacks || {};
        return this._callbacks[event] || [];
    }

    hasListeners(event) {
        return !!this.listeners(event).length;
    }
}

export default Emitter;
