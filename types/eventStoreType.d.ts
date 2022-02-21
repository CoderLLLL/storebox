import HREventStore from '../src/index';

export interface IStoreOptions<T extends IkeyType> {
    state:T['state']
    actions?:actionsTree<T['state']>,
    modules?:T['modules'],
}

export interface IkeyType {
    state:{
        [propName:string]:any
    },
    actions?:actionsTree<IkeyType['state']>,
    modules?:{ [propName:string]:any }
    // modules?:modulesTree<HREventStore<IkeyType>>
}

export interface actionsTree<T> {
    [propName:string]: actionFn<T>
}

export interface modulesTree<T> {
    [propName:string]:module<T>
}

export type actionFn<T> = (state:T,payload?:any[]) => void

export type module<T> = T

export type IResultObj = {[propName:string]:any}
