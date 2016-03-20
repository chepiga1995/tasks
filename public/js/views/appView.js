let template  = _.template(require('../../templates/content.html'));
let blank_template = _.template(require('../../templates/task/no-task.html'));
let Task = require('../models/Task');
let EditingTask = require('./editing-task');
let appView = Backbone.View.extend({
    el: '#content',
    events: {
        'click #create': 'createTask'
    },
    initialize({collection}) {
        this.collection = collection;
        this.collection.fetch();
        this.render();
    },
    render(){
        this.$el.html(template());
    },
    refresh(){
        if(!this.collection.length){
            this.addBlank();
        }
    },
    addBlank(){
        this.$el.find('#tasks').append(blank_template());
    },
    createTask(){
        this.stopListening(this.editingModel);
        this.editingModel =  new Task;
        new EditingTask({action: 'create', model: this.editingModel});
        this.listenTo(this.editingModel, 'localSave', this.saveChanges.bind(this));
    },
    saveChanges(model){
        this.stopListening(this.editingModel);
        this.collection.set(model);
        model.save();
    }
});

module.exports = appView;