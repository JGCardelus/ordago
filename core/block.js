class Block {
    constructor() {
        // Reference
        this.id = null;
        this.name = null;
        // Relations
        this.parent = null;
        this.primitive = null;
        this.flavour = null;
        this.flavours = [];
        // Events
        this.events = new Events();
        this.memoryEvents = new MemoryEvents();
    }
}

class Flavour {
    constructor() {
        // Reference
        this.id = null;
        this.name = null;
        this.classes = [];
        // Properties
        this.styles = {};
        // Relations
        this.children = [];
    }
}
