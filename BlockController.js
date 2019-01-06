const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const BlockchainClass = require('./Blockchain.js');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} server 
     */
    constructor(server) {
        this.server = server;
        //this.blocks = [];
        // Creating the levelSandbox class object
        this.blockChain = new BlockchainClass.Blockchain();

        //this.initializeMockData();
        this.getBlockByIndex();
        this.postNewBlock();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.server.route({
            method: 'GET',
            path: '/api/block/{index}',
            handler: (request, h) => {
                
                let blockHeight = request.params.index;

                return this.blockChain.getBlock(blockHeight).then(function(value){
                    console.log("block chain get block + " + value);
                    if( value === undefined) {
                        return `Invalid block  ${encodeURIComponent(blockHeight)}`;
                    }
                    else {
                        return value;
                    }
                });
                   
            }
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.server.route({
            method: 'POST',
            path: '/api/block',
            handler: (request, h) => {
                var payload = request.payload   
                if(payload == null){ return "Please include block data"};
                if(payload.data !== ""){
                    let newBlock = new BlockClass.Block(payload.data)
                    return this.blockChain.addBlock(newBlock).then(function(value){
                        console.log("add block + " + payload.data);
                        if( value !== null) {
                            //let blockValue = JSON.stringify(value);
                            return value;
                        }
                        else {
                            return 'Block was not successfully added';
                        }
                    });
                }
                else{
                    return 'Please include block data';
                }



            }
        });
    }

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */
    // initializeMockData() {
    //     if(this.blocks.length === 0){
    //         for (let index = 0; index < 10; index++) {
    //             let blockAux = new BlockClass.Block(`Test Data #${index}`);
    //             blockAux.height = index;
    //             blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
    //             this.blocks.push(blockAux);
    //         }
    //     }
    // }


}

/**
 * Exporting the BlockController class
 * @param {*} server 
 */
module.exports = (server) => { return new BlockController(server);}