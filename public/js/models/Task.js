var uuid = require('uuid');

let Task = Backbone.Model.extend({
    validation: {
        'title': [{
            required: true,
            msg: 'Title is required'
        },{
            pattern: /.{1,255}/,
            msg: 'Title must be shorter then 255 symbols'
        }],
        'description':[{
            required: true,
            msg: 'Description is required'
        },{
            pattern: /.{1,1000}/,
            msg: 'Description must be shorter then 255 symbols'
        }],
        'status': {
            pattern: /(Opened|Pending|Completed)/,
            msg: 'Invalid status'
        }
    },
    defaults() {
        return {
            id: uuid.v4(),
            status: 'Opened'
        };
    }
});

module.exports = Task;