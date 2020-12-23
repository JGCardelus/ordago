class Block {
    constructor(id) {
        // Events
        this.events = new Events();
        this.memoryEvents = new Memory_Events();

        // Reference
        this.name = null;
        this.id = id;

        // Relations
        this.parent = null;
        this.primitive = null;
        this.flavour = null;
        this.flavours = [];
        this.children = [];
    }

    apply(flavour) {
        // Remove last flavour
        this.primitive.remove_class(this.flavour.id);
        this.flavour.remove();
        flavour.create();
        this.primitive.add_class(flavour.id);
        this.flavour = flavour;
    }

    init() {
        if (this.primitive != null) {
            this.primitive.init();
        }

        if (this.flavour == null) {
            this.create_flavour();
        }

        for (let child of this.children) {
            child.init();
        }
    }

    delete() {
        let parent = block.parent;
        parent.remove(this);
    }

    delete_wrapper() {
        for (let child of this.children) {
            child.delete_wrapper();
        }

        if (this.primitive != null) {
            this.primitive.delete_wrapper();
        }        
    }

    add(child) {
        child.parent = this;
        this.children.push(child);
        child.init();
    }

    remove(child) {
        child.delete_wrapper();
        remove(child, this.children);
    }

    create_flavour() {
        // Create default flavour
        let flavour_id = create_id("Flavour-", manager.flavour_ids);
        manager.flavour_ids.push(flavour_id);
        let flavour = new Flavour(flavour_id);
        this.flavours.push(flavour);
        // So that they are accessible by other blocks
        manager.flavours.push(flavour);

        if (this.flavour == null) {
            this.flavour = flavour;
            this.flavour.create();
            this.apply(this.flavour);
        }
    }

    remove_flavour(flavour) {
        remove(flavour, this.flavours);

        if (flavour == this.flavour) {
            if (this.flavours.length > 0) {
                this.flavour = this.flavours[0];
            } else {
                this.flavour = null;
                this.create_flavour();
            }
        }
    }
}