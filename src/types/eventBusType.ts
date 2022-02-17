export interface IEventObj {
    [propname:string]:IEventArr,
}

export type IEventFn = (...payload:any[]) => void

type IEventArr = {
    handles:[IEventHandle?]
    keys:string[]
}

interface IEventHandle {
    eventCallback: IEventFn
    thisArgs?: any
}


