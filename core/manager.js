class Manager {
    constructor() {
        this.primitive = new __body(this);

        this.parent = null;

        // IDS
        this.children_ids = [];
        this.flavour_ids = [];
        // OBJECTS
        this.children = [];
        this.flavours = [];
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

    add_block(block, parent) {
        if (this.children_ids.includes(block.id)) return;
        this.children_ids.push(block.id);

        if (parent == undefined) {
            this.add(block);
            
        } else {
            parent.add(block);
        }
    }
    
    remove_flavour(flavour, search_space) {
        search_space = (search_space == undefined) ? this.children : search_space;

        for (let block of search_space) {
            if (block.flavours.includes(flavour)) {
                block.remove_flavour(flavour);
            }
            this.remove_flavour(flavour, block.children);
        }
        
        remove(flavour, this.flavours);
    }

    // Awesome recursive algorithm to find a block by its id
    find_block(id, search_space) {
        search_space = (search_space == undefined) ? this.children : search_space;
        for (let test_block of search_space) {
            if (test_block.id == id) {
                return test_block;
            } else {
                let block = this.find_block(id, test_block.children);
                if (block != null) {
                    return block;
                }
            }
        }

        return null;
    }

    move(block, new_parent) {
        new_parent = (new_parent == undefined) ? this : new_parent;
        let old_parent = block.parent;

        // Check if by moving we would leave orphans
        let new_parent_dist_to_source = this.distance_to_source(new_parent);
        let block_dist_to_source = this.distance_to_source(block);
        if (new_parent_dist_to_source >= block_dist_to_source) {
            for (let child of block.children) {
                // Give orphans the block's parent
                block.remove(child);
                old_parent.add(child);
            }
        }
        // Remove from last parent
        old_parent.remove(block);
        // Add to new parent
        new_parent.add(block);
    }


    // "Source" is the manager
    distance_to_source(block) {
        let distance = 0;
        let current_node = block;
        while (current_node.parent != null) {
            current_node = current_node.parent;
            distance += 1;
        }
        return distance;
    }
}

let manager = new Manager();