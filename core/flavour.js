class Flavour {
    constructor(id) {
        // Reference
        this.id = id;
        this.name = null;
        this.classes = [];
        // Properties
        this.styles = {
            width: "100px",
            height: "100px",
            background: "red"
        };

        this.primitive = new __style(this);
    }

    create() {
        if (this.primitive.wrapper != null) return;
        this.primitive.init();
        let formatted_styles = styles_formatter.format_class(this.id, this.styles);
        this.primitive.set(formatted_styles);
    }

    remove() {
        this.primitive.delete_wrapper();
    }
}
