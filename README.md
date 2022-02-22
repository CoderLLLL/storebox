# storebox

## 功能简介

```
此项目正在开发中，主要用于状态管理，已经实现了基本的数据响应式、事件派发、state深层代理、modules模块化等
```

# 安装使用

```js
npm install storebox
```



# 基本用法

### 编写store.js

store的基本格式参照了vuex的写法，目前只有三个核心：state、actions、modules



其中actions的方法会接收到两个参数  ：state,payload

state : 当前store的存储的state（如果使用了modules，那么store就是当前模块的state，后面会讲）

payload : 外部调用actions方法时，传入的参数，payload以数组的形式接收



store.js 事例如下:

```js
import Storebox from 'storebox'
import store2 from './store2'
import store3 from './store2'

const store = {
    state:{
        name:'LLL',
        age:18,
        obj:{
            friend:'Code',
            obj2:{
                data:111
            },
        },
        
    },
    actions:{
        change(state){
            state.name = "coderLLLL"
            console.log('change');
        },
        change2(state,payload){
            console.log(state.obj);
            state.obj.obj2.data = payload[0]
            state.obj.friend = "play game"
        }
    },
    modules:{
        store2,
        store3
    }
}

export default new Storebox(store)
```

store2.js 事例如下：

``` js
const store = {
    state:{
        name:'store2',
        age:1,
        obj:{
            friend:{
                name:'code',
                obj2:{
                    aaa:'aaa'
                }
            }
        }
    },
    actions:{
        storeChange(state){
            state.age = 10
        },
        storeChange2(state){
            state.obj.friend.obj2.aaa = 'aaac' 
        },
        storeChange3(state){
            state.obj.friend.name = 'aaacode' 
        }
    }
}

export default store
```

store3.js 事例如下:

``` js
const store3 = {
    state:{
        name:'state3'
    }
}

export default store3
```

### 方法

#### onState

从store中获取值，并且监听变化

onState("key",({key:value})=>{...})

从store获取一个想要获取并且监听变化的值,然后写入一个回调函数，回调函数会传入你想要的值，以一个对象包裹起来，以key:avlue的形式存在,然后在回调函数中进行你对数据的操作

或

onState(["key1","key2","key3",...],({key1:value1,key2:value2,key3:value3,...})=>{...})

如果想监听多个值，那么就传入一个数组，,然后回调函数也是会接收一个对象，以key:value的形式存在，顺序以传入的数组为准，一一对应

监听单个值如下：

``` js
import store from "../store";

const resultCallBack = ({ name }) => {
	console.log(name)  //'LLL'
}

store.onState("name", resultCallBack);
```

监听多个值如下：

``` js
import store from "../store";

const resultCallBack = ({ name,age }) => {
	console.log(name)  //'LLL'
    console.log(age)   //18
}

store.onState(["name","age"], resultCallBack);
```

如果要修改值，我们可以直接在回调函数中修改，这个函数将会重新执行一次，并且会传入新的值，从而达到响应式的效果

``` js
import store from "../store";

const resultCallBack = ({ name,age }) => {
	console.log(name)  //'LLL'
    console.log(age)   //18
    
    name = "CoderLLLL" 
}

store.onState(["name","age"], resultCallBack);

// 'LLL'
// 18 
// 'CoderLLLL'
// 18
```



#### setState

setState("key",newValue)

如果我们不想监听，直接修改值即可，那么直接调用setState修改state里面key对应的value

``` js
import store from "../store";

setState("name","CoderLLLL")
```

如果上面有onState监听了name，无论是单个监听还是以数组的形式监听，对应的回调函数都会执行



#### offState

取消监听，一般作用于组件销毁、离开的时候，这个监听函数其实是不需要执行的，那么就意味着当监听的key发生变化的时候，这个组件页面其实已经不需要监听了，但是函数依旧执行，这样会造成一些不必要的性能浪费，那么建议在每次组件销毁时，取消监听

offState("key",({key:value})=>{...})

单个值的取消，传入key，再传入对应的回调函数，当传入的key再次发生变化时，函数不会再执行

或

offState(["key1","key2","key3",...],({key1:value1,key2:value2,key3:value3,...})=>{...})

多个值的取消，主要是取消前面onState以数组的形式监听，传入一个数组，再传入对应的回调函数，当传入的key再次发生变化时，函数不会再执行



单个取消监听事例如下：

``` js
import store from "../store";

const resultCallBack = ({ name }) => {
	console.log(name)
}

store.offState("name", resultCallBack);
```

多个取消监听事例如下：

``` js
import store from "../store";

const resultCallBack = ({ name,age }) => {
	console.log(name)  //'LLL'
    console.log(age)   //18
    
    name = "CoderLLLL" 
}

store.onState(["name","age"], resultCallBack);
```



#### dispatch

dispatch("action",payload)

事件派发，用来执行actions里面的函数，里面的函数都会接收到两个值，一个是当前store的state，一个是调用dispatch时，传入的额外参数，函数将会接到，并以数组的形式存储

``` js
import store from "../store";

store.dispatch("change2",100)
```



回顾前面的state和actions

``` js
state:{
        name:'LLL',
        age:18,
        obj:{
            friend:'Code',
            obj2:{
                data:111
            },
        },
        
    },
actions:{
        change(state){
            state.name = "coderLLLL"
            console.log('change');
        },
        change2(state,payload){
            console.log(state.obj);
            state.obj.obj2.data = payload[0]
            state.obj.friend = "play game"
        }
    },
```

那么change2这个函数能够接收到当前store的state，payload是一个数组，里面存储着一个数字类型的100,最后state.obj.obj2.data被改为100，state.obj.friend改为"play game"，其中，有监听key为obj的所有回调函数都会被执行



### 模块化modules

模块化借鉴了单一状态树的结构，当我们导入了模块并且写入到modules的时候，将会占用根store的state的一个key，key名为modules，modules存放着一个个已经经过storebox实例化的store，如果用户占用了modules字段，那么将会报错

实例化后根store的state中的modules的格式

``` js
state:{
	...,
    modules:{
        [modulesName]:EventStore,
        [modulesName]:EventStore,
        ...
	}
}
```

所以监听到的modules取出来之后，可以直接onState模块里面的state数据，或者直接dispatch派发事件到当前modules的actions里面的函数，也可以再添加modules



#### 导入模块

回顾前面的store2.js和store3.js文件，这里将写好的store导入到根store的modules中

``` js
import Storebox from 'storebox'
import store2 from './store2'
import store3 from './store2'

const store = {
	state:{},
    actions:{},
    modules:{
        store2,
        store3
	}
}

export default new Storebox(store)
```

注意：导出根store的时候不要忘记new Storebox(store)实例化store，不然拿到只是一个普通的对象



那么在组件中要获取模块，直接在onState中监听模块即可获得,也是通过key:value的形式获得，有多少个模块，那么就会有多少个键值对，其中key就是写在state中modules里面的key

``` js
import store from "../store";

const MyModules = ''

store.onState('modules',(modules)=>{
	MyModules = modules
})

MyModules.store2.onState('name',({name})=>{
    console.log(name)  //store2
})
MyModules.store2.dispatch('storeChange')	//store2的age被改为10,依赖于store2的age所有函数将会被重新执行

MyModules.store3.onState('name',({name})=>{
    console.log(name)  //state3
})
```



--------欢迎大家遇到bug提交到lssues，文档持续更新

