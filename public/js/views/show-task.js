let template = _.template(require('../../templates/task/show-task.html'));
let modal = _.template(require('../../templates/task/confirm-delete.html'));
let EditingTask = require('./editing-task');

let ShowTask = Backbone.View.extend({
    events: {
        'click .status-change': 'changeStatus',
        'click .edit': 'edit',
        'click .remove': 'ask'
    },
    status_move: {
        'Opened': 'Pending',
        'Pending': 'Completed',
        'Completed': 'Opened'
    },
    initialize({eventsControl}){
        this.listenTo(eventsControl, 'delete', this.remove.bind(this));
        this.render();
    },
    render(){
        this.$el.html(template({
            task: this.model.toJSON()
        }));
    },
    changeStatus(){
        let new_status = this.status_move[this.model.get('status')];
        this.model.set('status', new_status);
        this.saveChanges();
    },
    saveChanges(){
        this.stopListening(this.model, 'localSave');
        this.model.save();
        this.model.trigger('reload');
    },
    ask(){
        let modals = $('#modals');
        modals.find('.delete-task').off();
        modals.html(modal());
        modals.find('> .modal').modal('show');
        modals.find('.delete-task').on('click', this.clear.bind(this));
    },
    clear(){
        this.model.destroy();
        this.model.trigger('reload');
        Backbone.View.prototype.remove.apply(this);
    },
    edit(){
        $('body').append('<div id="modal"></div>');
        new EditingTask({action: 'create', model: this.model});
        this.listenTo(this.model, 'localSave', this.saveChanges.bind(this))
    }
});

module.exports = ShowTask;