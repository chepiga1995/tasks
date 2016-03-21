let template = _.template(require('../../templates/task/recovery-task.html'));

let RecoveryTask = Backbone.View.extend({
    events: {
        'click .recovery': 'recovery'
    },
    initialize({time}){
        this.time = time;
        this.active = true;
        setTimeout(this.render.bind(this), 500);
        this.startTimer();
    },
    render(){
        this.$el.html(template({
            time: this.time
        }));
    },
    recovery(){
        this.active = false;
        this.remove();
        this.model.trigger('localSave', this.model);
    },
    startTimer(){
        if(!this.active) return;
        setTimeout(this.tick.bind(this), 1000);
    },
    tick(){
        this.time--;
        if(this.time >= 0 && this.active){
            this.$el.find('.time').text(`time left ${this.time}s`);
            this.startTimer();
        } else {
            this.remove();
        }
    }
});

module.exports = RecoveryTask;