var View = require('./view');

var EventListeners = {

}

module.exports = {
    start: function(o1, o2, o3){
        var n = typeof o1 == 'string' ? o1 : (o1.name || 'module_' + (new Date()).getTime());
        var m = typeof o1 == 'string' ? o2 : o1;
        var p = typeof o1 == 'string' ? o3 : o2;
        if(m){
            var newModule = this.init(m, p);
            newModule.name = n;
            return newModule;
        }else{
            return null;
        }
    },
    init: function(module, params){
        params = params || {};
        var that = this;

        // // 引用初始化
        var main = null;
        var model = null;
        var view = null;
        var controller = null;
        
        main = new module(params);
        main.params = params;

        if(main.model){
            model = new main.model(params);
            main.model = model;
        }

        if(main.controller){
            controller = new main.controller(params);
            controller.params = params;
            controller.model = model;
            controller.main = main;
        }
        if(main.view){
            view = new main.view(params);
            view.params = params;
            view.model = model;
            view.main = main;
        }

        if(controller){
            main.controller = controller;
            if(view){
                view.controller = controller;
            }
        }
        if(view){
            main.view = view;
            if(controller){
                controller.view = view;
            }
        }

        // 模块初始化
        main._type = 'module';
        if(view){
            View.render(view);
            view.init && view.init(params);
        }
        controller && controller.init && controller.init(params);
        main.init && main.init(params);
        return main;
    },
    listen: function(ctx, evt, handler){
        if(!EventListeners[ctx]){
            EventListeners[evt] = [];
        }
        EventListeners[evt].push({
            ctx: ctx,
            handler: handler
        });
    },
    trigger: function(){
        var evt = arguments[0];
        var params = [];
        for(var cnt = 1, len = arguments.length; cnt < len; cnt++){
            params.push(arguments[cnt]);
        }
        var listeners = EventListeners[evt] || [];
        for(var cnt = 0, len = listeners.length; cnt < len; cnt++){
            var listener = listeners[cnt];
            var ret = listener.handler.apply(listener.ctx, params);
            if(ret === false){
                return false;
            }
        }
        return true;
    }
};