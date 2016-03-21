let template  = _.template(require('../../templates/content.html'));
let blank_template = _.template(require('../../templates/task/no-task.html'));
let Task = require('../models/Task');
let EditingTask = require('./editing-task');
let ShowTask = require('./show-task');
let appView = Backbone.View.extend({
    el: '#content',
    events: {
        'click #create': 'createTask',
        'change .checkbox input': 'refresh'
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
        this.eventsControl.trigger('delete');
        if(!this.collection.length){
            return this.addBlank();
        }
        this.arr_of_el = [];
        this.$el.find('#tasks').html('');

        let collection = this.collection;
        collection = this.filter(collection);
        collection = this.sort(collection);
        collection.forEach(this.initTaskView.bind(this));
        this.$el.find('#tasks').append(this.arr_of_el);
    },
    initTaskView: function(model){
        let eventsControl = this.eventsControl;
        let el = $(`<div class="task" data-id="${model.id}"></div>`);
        this.listenTo(model, 'destroy', this.refresh.bind(this));
        this.listenTo(model, 'reload', this.refresh.bind(this));
        new ShowTask({model, el, eventsControl});
        this.arr_of_el.push(el);
    },
    filter(collection){
        var showCompleted = $('.checkbox input').prop('checked');
        return collection.filter((model) => {
            return showCompleted || model.get('status') != 'Completed';
        });
    },
    sort(collection){
        return collection;
    },
    addBlank(){
        this.$el.find('#tasks').html(blank_template());
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