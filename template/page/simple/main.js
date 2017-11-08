require('./style.scss');
var View = require('./view');
// var Model = require('path/to/model');

function Main(params) {

}

Main.prototype = {
    // model: Model,
    view: View,
    init: Init
}

window._main = Main;

function Init(params){
    
}