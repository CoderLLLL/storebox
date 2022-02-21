import {IStoreOptions,IkeyType,IEventFn,IResultObj} from '../../types/index'
import HREventBus from './eventBus'

class HREventStore<T extends IkeyType> {
    public state
    public actions
    private event
    public modules

    /* 
        构造器：创建actions、event、state，然后判断用户有没有写modules，有的话直接在state中创建modules对象，里面再实例一个store
        这样是为了取出modules里面的actins时可以直接dispatch派发事件到对应的store，onState也是可以监听到对应的state的值

        其中会给state做一次代理，返回代理对象，代理是深层监听的，所以state的值是对象或者数组，都能够监听到内部数据的变化
        然后执行对应的emit的函数
    */

    constructor(optinos:IStoreOptions<T>){
        this.actions = optinos.actions
        this.event = new HREventBus()
        this.state = this._observe(optinos.state)
        
        if(Object.keys(optinos.modules ?? []).length === 0) return
        this.modules = optinos.modules

        for(const item of Object.keys(this.state)){
            if(item === 'modules') throw new Error('你已经在store中使用了modules,state的key:modules被占用')
        }        
        // this.modules = this._deepAgent(this.modules)
        if(!this.modules) return
        for(const module of Object.keys(this.modules)){
            this.modules[module] = new HREventStore(this.modules[module])
        }
        this.state.modules = this.modules
        
        
    }

    /* 
        _observe方法：给state做代理，最后返回一个代理对象，实现的原理是使用递归，使用深度优先算法实现每一层的监听

        设置get属性，就直接将对应的值返回给用户即可
        设置set属性，如果要设置的值和之前的一样，那么就没有必要再去修改和触发对应的emit函数，
        如果不一样，那么就需要修改，然后将state值传入到emit，然后emit方法会取出对应的value
    */
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

        //调用深层代理方法，做深层代理
        proxyObj = this._deepAgent(proxyObj)

        return proxyObj
    }


    /* 
        _deepAgent方法：深层代理方法，调用这个方之后，为了防止传入为空，所以为空会抛出一个异常，然后调用内部递归深度监听方法_nextAgent

        state里面的对象值被修改的时候，最终事件都会发送到state的这个对象中，因为这里是不知道用监听这个对象究竟是哪个函数
        对这个对象做了修改，所以只能直接执行这个对象的所有函数依赖

        所有要传入这个对象的key，后面子元素被修改后就会通过emit来执行这个对象的所有依赖函数
    */
    private _deepAgent(proxyObj:IResultObj){  
        const proxyKey = Object.keys(proxyObj)
        if(proxyKey.length === 0) throw new Error('传入需要代理的对象为空')
        
        for(const item of Object.keys(proxyObj)){            
            if(typeof proxyObj[item] === 'object') this._nextAgent(proxyObj,item,proxyObj)
        }

        // let rootKey = ''
        // this._nextAgent(proxyObj,rootKey)
        return proxyObj
    }

    /* 
        _nextAgent方法：内部深度监听方法，遍历传入的对象中的每一个元素，是对象的话，那么就会将这个对象做一次代理，并且将这个对象换成代理对象
        这样做的目的是---当我们的对象里面的某个值修改之后，我们能够监听到这个对象的值被改变，然后就可以触发事件了

        最终触发的事件就是就是传入对象的key

        这里采用了深度优先算法，先对对每一层的第一个元素做代理，代理完成之后直接递归到下一层去代理
    */
    private _nextAgent(proxyObj:IResultObj,rootKey:string,rootObj:IResultObj){
        const proxyKey = Object.keys(proxyObj)
        if(proxyKey.length === 0) return
        for(const item of proxyKey){
            if(typeof proxyObj[item] === 'object'){
                this._nextAgent(proxyObj[item],rootKey,rootObj)  
                proxyObj[item] = this._proxy(proxyObj,item,rootKey,rootObj)
            }
        }
    }

    /* 
        _proxy方法：内部代理方法，在内部递归方法中会调用这个方法，这里的实现思路和前面的代理方法是一样的，只不过这里
        是做深度监听的
    */
    private _proxy(proxyObj:IResultObj,key:string,rootKey:string,rootObj:IResultObj){
        const _this = this
        
        return new Proxy(proxyObj[key],{
            get:(target,key)=>{                
                return target[key as string]
            },
            set:(target,key,newValue)=>{     
                if(target[key as string] === newValue) return true                
                target[key as string] = newValue    
                _this.event.emit<T['state']>(rootKey as string,rootObj[rootKey],true)
                return true
            }
        })
    }

    /* 
        onState方法，监听方法，这里会接收两个个值，
        第一个值是要监听的值，其中这个值是在state里面的，也可以接收一个数组，因为我们想要监听的值可能不止一个
        第二个值就是回调函数，用户通过这个函数能够拿到对应的监听值，然后就可以通过函数来使用这些值

        当调用这个监听方法的时候，会立即执行一次，并且将对应的的值从state取出，然后返回给传入的函数，并且做on监听
        当值被修改的时候，这个函数会被重新执行，所以用户拿到的值也是新的，而且用户那边使用这些是会被重新赋值，这是这个库
        响应式的核心原理

        但是这里要做情况判断，当传入的是一个普通值的字符串类型，也就是一个state的一个key的时候，这里立即执行函数并且直接返回对应的值
            如果是一个数组，那么就遍历数组的每一个key，将每一个key的value取出按照顺序保存到数组，最后再去执行这个函数，并且将前面的数组传入
        到函数里面去，这样函数就能拿到前面传入数组中每个key的value了
            最后一个情况，就是监听到modules，这里会将这个取出对应的store，然后将store回传给我们的传入的函数，然后再去再去onState就可以拿到里面的
        值和actions
        ------------------------------------注意：这里会形成回调地狱，在后续版本中要优先解决这个问题
    */

    public onState(stateKey:keyof T['state'] | 'modules' | string[],stateCallBack:IEventFn){                    
        if(typeof stateKey === 'string' && stateKey !== ''){            
            if(stateKey === 'modules' && this.state.modules){
                const res:IResultObj = {modules:{}}
                for(const itemKey of Object.keys(this.state.modules)){
                    res.modules[itemKey] = this.state.modules[itemKey]
                    this.modules![itemKey].event.on(itemKey,stateCallBack)                
                }
                stateCallBack.apply(this.state,[res])

            } else if(Object.keys(this.state).indexOf(stateKey as string) === -1) throw new Error('输入的key不在state中')
            this.event.on(stateKey as string,stateCallBack)            
            const value = this.state[stateKey as keyof T['state']]                    
            stateCallBack.apply(this.state,[{[stateKey]:value}]) 
             
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

    /* 
        setState方法：修改state方法，修改对应store里面state的key
    */
    public setState(stateKey:keyof T['state'],newValue:any){
        this.state[stateKey] = newValue
    }

    /* 
        offState方法：取消监听方法，因为是要取消state对应key监听，所以要先判断key是否在state中
        然后再去判断是否是数组，如果是数组，那么久一个个的去取消监听
    */

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

    /* 
        dispatch方法：事件派发方法，我们也要先确定用户传入的事件是否在actions对象里面
        然后拿到对应的actions，再去执行，并且再将用户传入的额外参数传入到事件函数中即可
        ---------------------------------注意：这里是模块的时候，还没有将根的state传入到函数中，后期要实现
    */
    public dispatch(actionName:string,...arg:any[]){
        if(!this.actions) return
        if(Object.keys(this.actions).indexOf(actionName) === -1) throw new Error('输入的方法不在actions中')
        const actionFn = this.actions[actionName]
    
        actionFn.apply(this,[this.state,arg])
    }
}

export default HREventStore