import {IEventObj,IEventFn} from '../types/index'
import deRepeat from '../utils/deRepeat';

export default class HREventBus {
    private eventBus : IEventObj

    constructor(){
        this.eventBus = {}
    }

    public on(eventName:string | string[],eventCallback:IEventFn,thisArgs:any = window){
        const execFn = (eventName:string,keys:string[] = []) =>{
            let bucket = this.eventBus[eventName as string]
            let newArr = deRepeat(bucket?.keys ?? [],keys)
            if(!bucket){
                bucket = {
                    handles:[],
                    keys:newArr
                }
                this.eventBus[eventName as string] = bucket
            }
            bucket.handles.push({
                eventCallback,
                thisArgs
            })            
        }
        
        if(typeof eventName === 'string'){
            execFn(eventName)
        } else{
            let newEventName = eventName
            for(const item of newEventName){                     
                const index = eventName.indexOf(item)
                const [nextItem] = newEventName.splice(index,1)
                execFn(item,newEventName)
                newEventName.splice(index,0,nextItem)                             
            }   
        }        
    }

    public emit<T>(eventName:string,target:T,isdeep:boolean = false){            
        let resArr:any[] = []            
        const bucket = this.eventBus[eventName]
        if(!bucket) return false
        
        resArr.push(target[eventName as keyof T])        
        if(bucket.keys.length !== 0 && isdeep){
            resArr = []
            resArr.push({[eventName]:target[eventName as keyof T]})
            for(const item of bucket.keys){
                resArr[0][item] = target[item as keyof T]
            }
        } else{                        
            resArr = [target]
        }     
        for(const item of bucket.handles){
            item?.eventCallback.apply(item.thisArgs,resArr)
        }
    }

    public off(eventName:string,eventCallback:IEventFn){
        const bucket = this.eventBus[eventName]

        if(!bucket) return false
        const newHandles = [...bucket.handles]
        for(let i = 0;i < newHandles.length;i++){
            const handle = newHandles[i]
            if(handle?.eventCallback === eventCallback){
                const index = bucket.handles.indexOf(handle)                
                bucket.handles.splice(index,1)
            }
        }

        if(bucket.handles.length === 0){
            delete this.eventBus[eventName]
        }
    }
}


