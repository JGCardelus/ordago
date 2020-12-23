class __body {
    constructor(manager) {
        this.classes = [];
        this.manager = manager;
        this.allow_children = true;
        this.wrapper = new Wrapper("body");
    }
}

class __style {
    constructor(flavour) {
        this.flavour = flavour;
        this.html = `<style id="${this.flavour.id}"></style>`;
        this.wrapper = null;
    }

    create() {
        let head_wrapper = new Wrapper("head");
        if (!head_wrapper.exists(`#${this.flavour.id}`)) {
            head_wrapper.append(this.html);
        }
    }

    init() {
        this.create();
        this.wrapper = new Wrapper(`#${this.flavour.id}`);
    }

    delete_wrapper() {
        this.wrapper.delete();
        this.wrapper = null;
    }

    set(styles) {
        this.wrapper.html(styles);
    }
}

class __div {
    constructor (block) {
        this.classes = [];
        this.block = block;
        this.allow_children = true;
        this.html = `<div id="${this.block.id}"></div>`;
        this.wrapper = null;
    }

    add_class(class_name) {
        this.classes.push(class_name);
        this.wrapper.add_class(class_name);
    }

    remove_class(class_name) {
        this.wrapper.remove_class(class_name);
        remove(class_name, this.classes);
    }

    create() {
        this.block.parent.primitive.wrapper.append(this.html);
    }

    init() {
        this.create();
        this.wrapper = new Wrapper(`#${this.block.id}`);
    }

    delete_wrapper() {
        this.wrapper.delete();
        this.wrapper = null;
    }
}