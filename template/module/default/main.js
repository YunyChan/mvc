require('./style.scss');
var View = require('./view');
var Controller = require('./controller');
// var Model = require('path/to/model');

function Main(params) {

}

Main.prototype = {
    // model: Model,
    view: View,
    controller: Controller,
    init: Init
}

module.exports = Main;

function Init(params){
    
}
