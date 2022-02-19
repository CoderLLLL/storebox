var Mystore2 = {
    state: {
        type: 'module',
        data: {
            a: 1111,
            b: 'hhhh'
        }
    },
    actions: {
        getState: function (state) {
            console.log('Mystore2', state);
            state.type = 'modules';
            console.log('Mystore2', state);
        }
    }
};
export default Mystore2;
