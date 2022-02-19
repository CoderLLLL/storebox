import Mystore from './Mystore';
export default function aa() {
    var _name = '000';
    var _age = 0;
    var _address = '';
    Mystore.onState('name', function (payload) {
        console.log('监听执行1');
        console.log(typeof payload);
        _name = payload;
        console.log(_name);
    });
    function fn2(payload) {
        console.log('监听执行2');
        console.log('payload:', payload.age, payload.address);
        _age = payload.age;
        _address = payload.address;
        console.log(_age);
        console.log(_address);
    }
    function fn3(payload) {
        console.log('fn3:', payload);
    }
    function fn4(payload) {
        console.log('fn4:', payload);
    }
    function fn5(payload) {
        var _a;
        console.log('fn5:');
        payload.Mystore2.onState('type', function (state) {
            console.log('onState123', state);
        });
        (_a = payload.Mystore2) === null || _a === void 0 ? void 0 : _a.dispatch('getState');
    }
    Mystore.onState(['age', 'address'], fn2);
    Mystore.setState('name', 'CoderLLL');
    Mystore.setState('age', 20);
    Mystore.setState('address', '珠海市');
    // Mystore.offState('age',fn2)
    Mystore.setState('age', 19);
    Mystore.setState('address', '广州市');
    Mystore.dispatch('add', 123456, 789);
    Mystore.dispatch('ddd', 'LLL');
    Mystore.onState('obj', fn3);
    Mystore.dispatch('change');
    Mystore.onState('obj2', fn4);
    Mystore.dispatch('change2', 'aaa');
    Mystore.onState('modules', fn5);
}
