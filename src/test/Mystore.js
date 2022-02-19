import HREventStore from '../event/eventStore';
import Mystore2 from './Mystore2';
var store = {
    state: {
        name: 'LLL',
        age: 18,
        address: '深圳市',
        obj: {
            hobby: 'coding',
            phone: 11122223333,
            friend: {
                aaa: 'aaa',
                bbb: 'bbb'
            }
        },
        obj2: {
            aaa: 'aaa'
        }
    },
    actions: {
        add: function (state, payload) {
            console.log(state);
            console.log(payload);
            console.log('-------');
            state.age = 18;
            state.address = '深圳市';
        },
        ddd: function (state, payload) {
            console.log(state.obj.hobby, payload);
        },
        change: function (state) {
            console.log(12345);
            state.obj.hobby = 'sleep';
            state.obj.phone = 11111111111;
        },
        change2: function (state, payload) {
            state.obj2.aaa = (payload === null || payload === void 0 ? void 0 : payload.length) ? payload[0] : 'root';
        }
    },
    modules: {
        Mystore2: Mystore2
    }
};
export default new HREventStore(store);
