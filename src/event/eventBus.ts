import {IEventObj,IEventFn} from '../../types/index'
import deRepeat from '../utils/deRepeat';

export default class HREventBus {
    private eventBus : IEventObj

    constructor(){
        this.eventBus = {}
    }
    /* 
        on方法：这里会接收三个值，一个是事件名，事件名就是和我们要监听的数据名或者key是一样的，因为我们可能监听多个值，
                所以支持传入多个值-数组，然后是外部依赖的函数，这个会接收一个函数，然后当我们要监听这个值的时候，我们
                就会将这个函数放入到对应的依赖数组里面去，最后接收的值就是this指向

                当我们会将这些依赖函数放到一个数组里面去，还有对应其它依赖于这个值的函数也会放入到这个里面去，然后会创建
                一个新的数组去保存这些依赖这个值的key，到时候监听到一个数组的某个值被改变了，那么除了监听本事的值之外，我
                们还要拿到数组的其它值，这时候就直接遍历刚刚保存的key的数组即可拿到对应的值，最后会创建一个对象，这里称之为桶
                将依赖函数的数组和依赖的key装入这个桶中，最后key为事件名，value就是这个桶，存入到eventBus中

                其中还包括是否是深层监听，如果是深层监听的值，那么会将这个值以及这个值的所有子元素都返回给用户中
    */

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

    /* 
        emit方法：这里会接收三个值：事件名、整个state（代理的state）、是否深层监听，然后执行了emit方法之后，如果事件名是一个字符串
                 那么我们直接在state中取到对应的key即可，如果是一个数组，那么就要将这个数组的每一个key对应的值取到，
                 如果是只有一个值，但是这个值是一个对象，所以这里应该是要深层监听的，所以我们要将这个state都返回给它，因为这里的深层
                 监听是每一层都做了代理，所以这里接收到的target是这个事件名对应的对象和所有的子元素
    */

    public emit<T>(eventName:string,target:T,isdeep:boolean = false){            
        let resArr:any = {}           
        const bucket = this.eventBus[eventName]
        if(!bucket) return false
        
        
        if(bucket.keys.length !== 0 && !isdeep){ 
            resArr[eventName] = target[eventName as keyof T]
            for(const item of bucket.keys){
                resArr[item] = target[item as keyof T]
            }
        } else if(bucket.keys.length === 0 && isdeep){   
            // resArr = [target]            
            // resArr = target
            resArr = {[eventName]:target}
        } else if(bucket.keys.length === 0 && !isdeep){
            const type = typeof target[eventName as keyof T]
            if(type === 'object'){
                resArr[eventName] = target
            } else if(type === 'string'){
                resArr = {[eventName]:target[eventName as keyof T]}
            }
        }
        
        
        for(const item of bucket.handles){
            item?.eventCallback.apply(item.thisArgs,[resArr])
        }
    }

    /* 
        off方法：这里我们要接收到两个值，一个是事件名，一个是我们要取消监听的值
                因为我们在开发时，销毁（离开这个组件）的时候，这些监听的值可能被别的组件触发，但是这个组件已经用不上
                之前监听的值了，所以要将对应的依赖函数及时清理，先取到对应的事件桶，然后取出函数依赖数组，然后找到对应
                的函数，最后删除掉，然后如果这个桶是空的，那么就将这个桶删除掉
    */

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


