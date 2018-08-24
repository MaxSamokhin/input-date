'use strict';

class EventEmitter {
    private listeners: {};

    constructor() {
        this.listeners = {};
    }

    public on(event, listener) {
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push(listener);
        return listener;
    }

    public off(event) {
        this.listeners[event] = this.listeners[event] || [];
        delete this.listeners[event];
    }

    public emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach((listener) => {
                listener(data);
            });
        }
    }
}

const eventEmitter = new EventEmitter();
export default eventEmitter;
