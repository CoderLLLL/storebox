import { IMyStore2 } from "./storeType2";

export interface IMyStore {
    state:{
        name:string,
        age:number,
        address:string,
        obj:{
            hobby:string,
            phone:number,
            friend:{
                aaa:string
                bbb:string
            }
        },
        obj2:{
            aaa:string
        }
    },
    modules:{
        [key:string]:IMyStore2
    }
}

