import {IStoreOptions,IkeyType,IEventFn,IResultObj} from '../types/index'
import HREventBus from './eventBus'

class HREventStore<T extends IkeyType> {
    public state
    public actions
    private event

    constructor(optinos:IStoreOptions<T>){
        this.actions = optinos.actions
        this.event = new HREventBus()
        this.state = this._observe(optinos.state)
    }

    private _observe(state:T['state']){
        const _this = this
        const obj = JSON.parse(JSON.stringify(state))
        let proxyObj = new Proxy(obj,{
            get:(target,key)=>{                
                return target[key as string]
            },
            set:(target,key,newValue)=>{            
                if(target[key as string] === newValue) return true                
                target[key as keyof T['state']] = newValue                               
                _this.event.emit<T['state']>(key as string,target)
                return true
            }
        })

        proxyObj = this._deepAgent(proxyObj)

        return proxyObj
    }

    private _deepAgent(proxyObj:IResultObj){  
        const proxyKey = Object.keys(proxyObj)
        if(proxyKey.length === 0) throw new Error('传入的代理对象为空')
        let rootKey = ''
        this._nextAgent(proxyObj,rootKey)

        return proxyObj
    }

    private _nextAgent(proxyObj:IResultObj,rootKey:string){
        const proxyKey = Object.keys(proxyObj)
        if(proxyKey.length === 0) return
        for(const item of proxyKey){
            if(typeof proxyObj[item] === 'object'){
                rootKey = item
                proxyObj[item] = this._proxy(proxyObj[item],rootKey)
                this._nextAgent(proxyObj[item],rootKey)
            }
        }
    }

    private _proxy(proxyObj:IResultObj,rootKey:string){
        const _this = this
        return new Proxy(proxyObj,{
            get:(target,key)=>{                
                return target[key as string]
            },
            set:(target,key,newValue)=>{                 
                if(target[key as string] === newValue) return true                
                target[key as string] = newValue                             
                _this.event.emit<T['state']>(rootKey as string,target)
                return true
            }
        })
    }

    public onState(stateKey:keyof T['state'] | string[],stateCallBack:IEventFn){                    
        if(typeof stateKey === 'string' && stateKey !== ''){
            if(Object.keys(this.state).indexOf(stateKey as string) === -1) throw new Error('输入的key不在state中')
            this.event.on(stateKey as string,stateCallBack)
            const value = this.state[stateKey as keyof T['state']]        
            stateCallBack.apply(this.state,[value])  
        } else if(typeof stateKey === 'object' && stateKey.length > 0){
            const theKey = Object.keys(this.state)
            const res:IResultObj = {}
            for(const itemKey of stateKey){
                if(theKey.indexOf(itemKey) === -1) throw new Error(`输入的key为 ${itemKey} 不在state中`)
                res[itemKey] = this.state[itemKey]
            }
            this.event.on(stateKey,stateCallBack)
            stateCallBack.apply(this.state,[res])
        } else{
            throw new Error('这里的key只能传入一个字符串或者是一个字符串数组,且不能为空')
        }
    }

    public setState(stateKey:keyof T['state'],newValue:any){
        this.state[stateKey] = newValue
    }

    public offState(stateKey:keyof T['state'] | string[],stateCallBack:IEventFn){
        if(typeof stateKey === 'string' && stateKey !== ''){
            if(Object.keys(this.state).indexOf(stateKey) === -1) throw new Error('输入的key不在state中')
            this.event.off(stateKey,stateCallBack)
        } else if(typeof stateKey === 'object' && stateKey.length > 0){
            const theKey = Object.keys(this.state)
            for(const itemKey of stateKey){
                if(theKey.indexOf(itemKey) === -1) throw new Error(`输入的key为 ${itemKey} 不在state中`)
                this.event.off(itemKey,stateCallBack)
            }
        }else{
            throw new Error('这里的key只能传入一个字符串或者是一个字符串数组,且不能为空')
        }
    }

    public dispatch(actionName:string,...arg:any[]){
        if(!this.actions) return
        if(Object.keys(this.actions).indexOf(actionName) === -1) throw new Error('输入的方法不在actions中')
        const actionFn = this.actions[actionName]

        actionFn.apply(this,[this.state,arg])
    }
}

export default HREventStore