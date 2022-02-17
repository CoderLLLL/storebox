import Mystore from "./Mystore"

const bb = () =>{
    Mystore.onState('age',(payload)=>{
        console.log('bb:',payload);
    })
    Mystore.onState('obj',(payload)=>{
        console.log('bb:',payload);
    })
    Mystore.onState('obj2',(payload)=>{
        console.log('bb:',payload);
    })

    Mystore.dispatch('change2','bbb')
}

export default bb