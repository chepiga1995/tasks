//Import global variables
let jquery = require('jquery');
let underscore = require('underscore');
let backbone = require('backbone');
global.$ = jquery;
global.jQuery = jquery;
global._ = underscore;
global.Backbone = backbone;
require('./lib/bootstrap-datetimepicker');
$('#date').datetimepicker({
    format: "MM/DD/YYYY HH:mm"
});

