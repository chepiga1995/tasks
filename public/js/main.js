//Import global variables
let jquery = require('jquery');
let underscore = require('underscore');
let backbone = require('backbone');
let validation = require('backbone-validation');
global.$ = jquery;
global.jQuery = jquery;
global._ = underscore;
global.Backbone = backbone;
global.Backbone.LocalStorage = require("backbone.localstorage");
global.Backbone.Validation = validation;
Object.assign(global.Backbone.Model.prototype, validation.mixin);
require('./libs/bootstrap');
require('./libs/bootstrap-datetimepicker');
let app = require('./controllers/appController');
global.App = new app;

//Start app

App.start();



