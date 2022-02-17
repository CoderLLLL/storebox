export interface IStoreOptions<T extends IkeyType> {
    state:T['state']
    actions?:actionsTree<T['state']>
}

export interface actionsTree<T> {
    [propName:string]: actionFn<T>
}

export interface IkeyType {
    state:{
        [propName:string]:any
    },
    actions?:actionsTree<IkeyType['state']>
}

export type actionFn<T> = (state:T,payload?:any[]) => void

export type IResultObj = {[propName:string]:any}
