import Mystore from "./Mystore";
var bb = function () {
    Mystore.onState('age', function (payload) {
        console.log('bb:', payload);
    });
    Mystore.onState('obj', function (payload) {
        console.log('bb:', payload);
    });
    Mystore.onState('obj2', function (payload) {
        console.log('bb:', payload);
    });
    Mystore.dispatch('change2', 'bbb');
};
export default bb;
