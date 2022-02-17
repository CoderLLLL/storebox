import Mystore from './Mystore'

export default function aa(){
    let _name = '000'
    let _age = 0
    let _address = ''

    Mystore.onState('name',(payload:any)=>{
        console.log('监听执行1');
        console.log(typeof payload);
        _name = payload    
        console.log(_name);  
    })

    function fn2(payload:any){
        console.log('监听执行2');
        console.log('payload:',payload.age,payload.address);
        _age = payload.age
        _address = payload.address 
        console.log(_age); 
        console.log(_address);  
    }

    Mystore.onState(['age','address'],fn2)
    Mystore.setState('name','CoderLLL')
    Mystore.setState('age',20)
    Mystore.setState('address','珠海市')
    // Mystore.offState('age',fn2)
    Mystore.setState('age',19)
    Mystore.setState('address','广州市')
    
    Mystore.dispatch('add',123456,789)
}