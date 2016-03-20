let appView = require('../views/appView');
let taskCollection = require('../collections/Tasks');
class App {
    constructor(){
        this.collection = new taskCollection();
        this.view = new appView({collection: this.collection});
    }
    start(){
        this.view.refresh();
    }
}

module.exports = App;