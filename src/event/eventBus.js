var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import deRepeat from '../utils/deRepeat';
var HREventBus = /** @class */ (function () {
    function HREventBus() {
        this.eventBus = {};
    }
    HREventBus.prototype.on = function (eventName, eventCallback, thisArgs) {
        var _this = this;
        if (thisArgs === void 0) { thisArgs = window; }
        var execFn = function (eventName, keys) {
            var _a;
            if (keys === void 0) { keys = []; }
            var bucket = _this.eventBus[eventName];
            var newArr = deRepeat((_a = bucket === null || bucket === void 0 ? void 0 : bucket.keys) !== null && _a !== void 0 ? _a : [], keys);
            if (!bucket) {
                bucket = {
                    handles: [],
                    keys: newArr
                };
                _this.eventBus[eventName] = bucket;
            }
            bucket.handles.push({
                eventCallback: eventCallback,
                thisArgs: thisArgs
            });
        };
        if (typeof eventName === 'string') {
            execFn(eventName);
        }
        else {
            var newEventName = eventName;
            for (var _i = 0, newEventName_1 = newEventName; _i < newEventName_1.length; _i++) {
                var item = newEventName_1[_i];
                var index = eventName.indexOf(item);
                var nextItem = newEventName.splice(index, 1)[0];
                execFn(item, newEventName);
                newEventName.splice(index, 0, nextItem);
            }
        }
    };
    HREventBus.prototype.emit = function (eventName, target, isdeep) {
        var _a;
        if (isdeep === void 0) { isdeep = false; }
        var resArr = [];
        var bucket = this.eventBus[eventName];
        if (!bucket)
            return false;
        resArr.push(target[eventName]);
        if (bucket.keys.length !== 0 && !isdeep) {
            resArr = [];
            resArr.push((_a = {}, _a[eventName] = target[eventName], _a));
            for (var _i = 0, _b = bucket.keys; _i < _b.length; _i++) {
                var item = _b[_i];
                resArr[0][item] = target[item];
            }
        }
        else if (bucket.keys.length === 0 && isdeep) {
            resArr = [target];
        }
        for (var _c = 0, _d = bucket.handles; _c < _d.length; _c++) {
            var item = _d[_c];
            item === null || item === void 0 ? void 0 : item.eventCallback.apply(item.thisArgs, resArr);
        }
    };
    HREventBus.prototype.off = function (eventName, eventCallback) {
        var bucket = this.eventBus[eventName];
        if (!bucket)
            return false;
        var newHandles = __spreadArray([], bucket.handles, true);
        for (var i = 0; i < newHandles.length; i++) {
            var handle = newHandles[i];
            if ((handle === null || handle === void 0 ? void 0 : handle.eventCallback) === eventCallback) {
                var index = bucket.handles.indexOf(handle);
                bucket.handles.splice(index, 1);
            }
        }
        if (bucket.handles.length === 0) {
            delete this.eventBus[eventName];
        }
    };
    return HREventBus;
}());
export default HREventBus;
