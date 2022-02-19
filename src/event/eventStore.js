import HREventBus from './eventBus';
var HREventStore = /** @class */ (function () {
    function HREventStore(optinos) {
        var _a;
        this.actions = optinos.actions;
        this.event = new HREventBus();
        this.state = this._observe(optinos.state);
        if (Object.keys((_a = optinos.modules) !== null && _a !== void 0 ? _a : []).length === 0)
            return;
        this.modules = optinos.modules;
        for (var _i = 0, _b = Object.keys(this.state); _i < _b.length; _i++) {
            var item = _b[_i];
            if (item === 'modules')
                throw new Error('你已经在store中使用了modules,state的key:modules被占用');
        }
        // this.modules = this._deepAgent(this.modules)
        if (!this.modules)
            return;
        for (var _c = 0, _d = Object.keys(this.modules); _c < _d.length; _c++) {
            var module_1 = _d[_c];
            this.modules[module_1] = new HREventStore(this.modules[module_1]);
        }
        this.state.modules = this.modules;
        console.log(this);
    }
    HREventStore.prototype._observe = function (state) {
        var _this = this;
        var obj = JSON.parse(JSON.stringify(state));
        var proxyObj = new Proxy(obj, {
            get: function (target, key) {
                return target[key];
            },
            set: function (target, key, newValue) {
                if (target[key] === newValue)
                    return true;
                target[key] = newValue;
                _this.event.emit(key, target);
                return true;
            }
        });
        proxyObj = this._deepAgent(proxyObj);
        return proxyObj;
    };
    HREventStore.prototype._deepAgent = function (proxyObj) {
        var proxyKey = Object.keys(proxyObj);
        if (proxyKey.length === 0)
            throw new Error('传入需要代理的对象为空');
        var rootKey = '';
        this._nextAgent(proxyObj, rootKey);
        return proxyObj;
    };
    HREventStore.prototype._nextAgent = function (proxyObj, rootKey) {
        var proxyKey = Object.keys(proxyObj);
        if (proxyKey.length === 0)
            return;
        for (var _i = 0, proxyKey_1 = proxyKey; _i < proxyKey_1.length; _i++) {
            var item = proxyKey_1[_i];
            if (typeof proxyObj[item] === 'object') {
                rootKey = item;
                proxyObj[item] = this._proxy(proxyObj[item], rootKey);
                this._nextAgent(proxyObj[item], rootKey);
            }
        }
    };
    HREventStore.prototype._proxy = function (proxyObj, rootKey) {
        var _this = this;
        return new Proxy(proxyObj, {
            get: function (target, key) {
                return target[key];
            },
            set: function (target, key, newValue) {
                if (target[key] === newValue)
                    return true;
                target[key] = newValue;
                _this.event.emit(rootKey, target, true);
                return true;
            }
        });
    };
    HREventStore.prototype.onState = function (stateKey, stateCallBack) {
        if (typeof stateKey === 'string' && stateKey !== '') {
            if (stateKey === 'modules' && this.state.modules) {
                var res = {};
                for (var _i = 0, _a = Object.keys(this.state.modules); _i < _a.length; _i++) {
                    var itemKey = _a[_i];
                    res[itemKey] = this.state.modules[itemKey];
                    this.modules[itemKey].event.on(itemKey, stateCallBack);
                }
                stateCallBack.apply(this.state, [res]);
            }
            else if (Object.keys(this.state).indexOf(stateKey) === -1)
                throw new Error('输入的key不在state中');
            this.event.on(stateKey, stateCallBack);
            var value = this.state[stateKey];
            stateCallBack.apply(this.state, [value]);
        }
        else if (typeof stateKey === 'object' && stateKey.length > 0) {
            var theKey = Object.keys(this.state);
            var res = {};
            for (var _b = 0, stateKey_1 = stateKey; _b < stateKey_1.length; _b++) {
                var itemKey = stateKey_1[_b];
                if (theKey.indexOf(itemKey) === -1)
                    throw new Error("\u8F93\u5165\u7684key\u4E3A ".concat(itemKey, " \u4E0D\u5728state\u4E2D"));
                res[itemKey] = this.state[itemKey];
            }
            this.event.on(stateKey, stateCallBack);
            stateCallBack.apply(this.state, [res]);
        }
        else {
            throw new Error('这里的key只能传入一个字符串或者是一个字符串数组,且不能为空');
        }
    };
    HREventStore.prototype.setState = function (stateKey, newValue) {
        this.state[stateKey] = newValue;
    };
    HREventStore.prototype.offState = function (stateKey, stateCallBack) {
        if (typeof stateKey === 'string' && stateKey !== '') {
            if (Object.keys(this.state).indexOf(stateKey) === -1)
                throw new Error('输入的key不在state中');
            this.event.off(stateKey, stateCallBack);
        }
        else if (typeof stateKey === 'object' && stateKey.length > 0) {
            var theKey = Object.keys(this.state);
            for (var _i = 0, stateKey_2 = stateKey; _i < stateKey_2.length; _i++) {
                var itemKey = stateKey_2[_i];
                if (theKey.indexOf(itemKey) === -1)
                    throw new Error("\u8F93\u5165\u7684key\u4E3A ".concat(itemKey, " \u4E0D\u5728state\u4E2D"));
                this.event.off(itemKey, stateCallBack);
            }
        }
        else {
            throw new Error('这里的key只能传入一个字符串或者是一个字符串数组,且不能为空');
        }
    };
    HREventStore.prototype.dispatch = function (actionName) {
        var arg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arg[_i - 1] = arguments[_i];
        }
        if (!this.actions)
            return;
        if (Object.keys(this.actions).indexOf(actionName) === -1)
            throw new Error('输入的方法不在actions中');
        var actionFn = this.actions[actionName];
        actionFn.apply(this, [this.state, arg]);
    };
    return HREventStore;
}());
export default HREventStore;
