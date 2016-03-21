let template = _.template(require('../../templates/task/editing-task.html'));
let moment = require('moment');
_.extend(Backbone.Validation.callbacks, {
    valid: function (view, attr) {
        var $el = view.$('[name=' + attr + ']'),
            $group = $el.closest('.form-group');

        $group.removeClass('has-error');
        $group.find('.help-block').html('').addClass('hidden');
    },
    invalid: function (view, attr, error) {
        var $el = view.$('[name=' + attr + ']'),
            $group = $el.closest('.form-group');

        $group.addClass('has-error');
        $group.find('.help-block').html(error).removeClass('hidden');
    }
});

let EditingTask = Backbone.View.extend({
    el: '#modal',
    events: {
        'click #save': 'validate'
    },
    actions: {
        'edit': 'change',
        'create': 'in'
    },
    initialize({action, model}){
        this.action = action;
        Backbone.Validation.bind(this, {model});
        this.listenTo(model ,'validated:valid', (model) => {
            model.trigger('localSave', model);
            this.modal.modal('hide');
        });
        this.render();
    },
    render(){
        this.$el.html(template({
            action: this.action,
            task: this.model.toJSON()
        }));
        this.modal = this.$el.find('> .modal');
        this.modal.modal('show');
        this.modal.on('hidden.bs.modal', this.remove.bind(this));
        $('#date').datetimepicker({
            format: "MM/DD/YYYY HH:mm"
        });
    },
    validate(){
        var data = this.getData();
        this.model.set(data);
        this.model.validate();
    },
    getData(){
        var data = {};
        data.animation = this.actions[this.action];
        data.created = moment().format("MM/DD/YYYY HH:mm");
        $.each(this.$el.find('input, select, textarea'), (i, el) => {
            var name = $(el).attr('name');
            data[name] = $(el).val();
        });
        return data;
    },
    remove(){
        $('#date').data("DateTimePicker").destroy();
        this.stopListening(this.model);
        Backbone.View.prototype.remove.apply(this);
    }
});

module.exports = EditingTask;