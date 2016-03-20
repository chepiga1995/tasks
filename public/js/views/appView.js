let template  = _.template(require('../../templates/content.html'));
let blank_template = _.template(require('../../templates/task/no-task.html'));
let Task = require('../models/Task');
let EditingTask = require('./editing-task');
let ShowTask = require('./show-task');
let appView = Backbone.View.extend({
    el: '#content',
    events: {
        'click #create': 'createTask'
    },
    initialize({collection}) {
        this.collection = collection;
        this.eventsControl = _.extend({}, Backbone.Events);
        this.collection.fetch();
        this.render();
    },
    render(){
        this.$el.html(template());
    },
    refresh(){
        if(!this.collection.length){
            return this.addBlank();
        }
        let arr_of_el = [];
        let eventsControl = this.eventsControl;
        eventsControl.trigger('delete');
        this.collection.forEach((model) => {
            let el = $(`<div class="task" data-id="${model.id}"></div>`);
            this.listenTo(model, 'destroy', this.refresh.bind(this));
            this.listenTo(model, 'reload', this.refresh.bind(this));
            new ShowTask({model, el, eventsControl});
            arr_of_el.push(el);
        });
        this.$el.find('#tasks').html('');
        this.$el.find('#tasks').append(arr_of_el);
    },
    addBlank(){
        this.$el.find('#tasks').append(blank_template());
    },
    createTask(){
        this.editingModel =  new Task;
        $('body').append('<div id="modal"></div>');
        new EditingTask({action: 'create', model: this.editingModel});
        this.listenTo(this.editingModel, 'localSave', this.saveChanges.bind(this));
    },
    saveChanges(model){
        this.stopListening(model, 'localSave');
        this.collection.set(model);
        model.save();
        this.refresh();
    }
});

module.exports = appView;