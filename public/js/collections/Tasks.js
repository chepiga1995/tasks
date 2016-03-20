let Task = require('../models/Task');

let Tasks = Backbone.Collection.extend({
    model: Task,
    localStorage: new Backbone.LocalStorage("tasks")
});

module.exports = Tasks;