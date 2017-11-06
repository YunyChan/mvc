var $ = require('jquery/src/core');
require('jquery/src/selector');
require('jquery/src/ajax');

module.exports = {
    // 框架级别默认配置参数
    root: '',
    paramType: '',
    contentType: '', // requeset content type
    dataType: 'json', // response content type

    request: function(o){
        var self = this;
        var api = this.parseApi(o.api);
        var url = this.formatUrl(api.url, o.root || this.root);
        this.setDefaultParams(o, api.method);
        var data = this.formatParams(o, api.method);

        var contentType = null;
        if(api.method == 'POST'){
            contentType = (o.contentType || this.contentType) == 'json' ? 'application/json; charset=UTF-8' : 'application/x-www-form-urlencoded; charset=UTF-8';
        }
        var conf = {
            url: api.method == 'GET' ? this.addUrlParams(url, o.params) : url,
            type: api.method,
            contentType: contentType,
            dataType: o.dataType || this.dataType,
            data: api.method == 'GET' ? undefined : data,
            success: function(res){
                self.onSuccess(res, o.success, o.error);
            },
            error: function(xhr){
                self.onError(xhr, o.error);
            }
        };

        $.ajax(conf);
    },
    requestUrl: function(o, params){
        var api = this.parseApi(o.api);
        var url = this.formatUrl(api.url, o.root || this.root);
        this.setDefaultParams(o, api.method);
        var data = this.formatParams(o, api.method);
        return api.method == 'GET' ? this.addUrlParams(url, o.params) : url;
    },
    parseApi: function(api){
        var apiSecs = api.split(':');
        return {
            method: /post/i.test(apiSecs[0]) ? 'POST' : 'GET',
            url: api.replace(/^(post|get):/, '')
        }
    },
    formatUrl: function(rawUrl, root){
        var url = '';
        if(/https?/.test(rawUrl)){
            // 绝对地址
            url = rawUrl;
        }else{
            root = root || app.getGlobal('api');
            url = root + (app.isMock() ? rawUrl + '.mo' : rawUrl);
        }
        return url;
    },
    setDefaultParams: function(o, method){
        var contentType = o.contentType || this.contentType;
        if(method == 'GET'){
            o.params = o.params || {};
            o.params['t'] = new Date().getTime();
        }else{
            if(contentType == 'json'){
                return ;
            }
        }
        // o.params['uid'] = '123456';
    },
    formatParams: function(o, method){
        var contentType = o.contentType || this.contentType;
        var paramType = o.paramType || this.paramType;
        var data = {};

        // For Java SpringMVC RequestParam array type
        for(var key in o.params){
            var value = o.params[key];
            if(Object.prototype.toString.call(value) == '[object Array]'){
                if(value.length > 0){
                    var list = '';
                    var separator = '';
                    for(var cnt = 0, len = value.length; cnt < len; cnt++){
                        var i = value[cnt];
                        list += separator + i;
                        separator = ',';
                    }
                    o.params[key] = list;
                }else{
                    o.params = null;
                }
            }
        }

        if(method == 'GET'){
            // if(paramType == 'json'){
            //     data['params'] = JSON.stringify(o.params);
            // }
            data = o.params;
        }else{
            if(contentType == 'json'){
                data = JSON.stringify(o.params)
            }else{
                data = o.params;
            }
        }
        return data;
    },
    addUrlParams: function(url, params){
        var separator = url.indexOf('?') > -1 ? '&' : '?';
        for(var key in params){
            if(params[key] !== null && params[key] !== undefined){
                url += (separator + key + '=' + encodeURIComponent(params[key]));
                separator = '&';
            }
        }
        return url;
    },
    onSuccess: function(o, success, error){
        success && success(o);
    },
    onError: function(xhr, error){
        error && error(xhr);
    },
    save: function(key, value){
        if(value){
            window.localStorage.setItem(key, JSON.stringify({
                data: value
            }));
        }else{
            window.localStorage.removeItem(key);
        }
    },
    load: function(key){
        var raw = window.localStorage.getItem(key);
        if(raw){
            return JSON.parse(raw)['data'];
        }else{
            return null;
        }
    }
};