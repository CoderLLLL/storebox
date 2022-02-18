import {IStoreOptions} from '../types/index'
import {IMyStore2} from './types/storeType2'

const Mystore2:IStoreOptions<IMyStore2>= {
    state:{
        type:'module',
        data:{
            a:1111,
            b:'hhhh'
        }
    },
    actions:{
        getState(state){
            console.log('Mystore2',state);
            state.type = 'modules'
            console.log('Mystore2',state);
            
        }
    }
}

export default Mystore2