import HREventStore from '../event/eventStore'

import {IStoreOptions} from '../types/index'
import {IMyStore} from './types/storeType'

const store:IStoreOptions<IMyStore> = {
    state:{
        name:'LLL',
        age:18,
        address:'深圳市',
    },
    actions:{
        add(state,payload){
            console.log(state);
            console.log(payload);
            console.log('-------');
            state.age = 18
            state.address = '深圳市'
        }
    }
}

export default new HREventStore(store)