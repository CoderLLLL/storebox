import Mystore from "./Mystore"

const bb = () =>{
    Mystore.onState('age',(payload)=>{
        console.log('bb:',payload);
        
    })
}

export default bb