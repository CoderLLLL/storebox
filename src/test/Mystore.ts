import HREventStore from '../event/eventStore'
import Mystore2 from './Mystore2'

import {IStoreOptions} from '../../types/index'
import {IMyStore} from './types/storeType'

const store:IStoreOptions<IMyStore> = {
    state:{
        name:'LLL',
        age:18,
        address:'深圳市',
        obj:{
            hobby:'coding',
            phone:11122223333,
            friend:{
                aaa:'aaa',
                bbb:'bbb'
            }
        },
        obj2:{
            aaa:'aaa',
        }
    },
    actions:{
        add(state,payload){
            console.log(state);
            console.log(payload);
            console.log('-------');
            state.age = 20
            state.address = '珠海市'
        },
        ddd(state,payload){
            console.log(state.obj.hobby,payload);
        },
        change(state){
            console.log(12345);
            
            // state.obj.hobby = 'sleep'
            // state.obj.phone = 11111111111
            state.obj.friend.aaa = 'aaac'
            
        },
        change2(state,payload){
            state.obj2.aaa = payload?.length ? payload[0] : 'root'
        }
    },
    modules:{
        Mystore2
    }
}

export default new HREventStore(store)