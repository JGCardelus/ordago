let aBlock = new Block("a");

let aDiv = new __div(aBlock);
aBlock.primitive = aDiv;

manager.add_block(aBlock);


let bBlock = new Block("b");

let bDiv = new __div(bBlock);
bBlock.primitive = bDiv;

manager.add_block(bBlock, aBlock);

let cBlock = new Block("c");

let cDiv = new __div(cBlock);
cBlock.primitive = cDiv;

manager.add_block(cBlock);


function addBlockDiv(id, parent_id) {
    let block = new Block(id);
    let primitive = new __div(block);
    block.primitive = primitive;

    let parent = manager.find_block(parent_id);
    manager.add_block(block, parent);

}

