import Mystore from './Mystore'

export default function aa(){
    let _name = '000'
    let _age = 0
    let _address = ''

    // Mystore.onState('name',(payload:any)=>{
    //     console.log('监听执行1');
    //     console.log(typeof payload);
    //     _name = payload    
    //     console.log(_name);  
    // })

    function fn2(payload:any){
        console.log('监听执行2');
        console.log('payload:',payload,payload);
        _age = payload.age
        _address = payload.address 
        console.log(_age); 
        console.log(_address);  
    }

    function fn3(payload:any){
        console.log('fn3:',payload);  
    }

    function fn4(payload:any){
        console.log('fn4:',payload);  
    }

    function fn5(modules:any){
        console.log('fn5:');
        console.log(modules);

        modules.modules.Mystore2.onState('type',(state:any)=>{
            console.log('onState123',state);
            
        })

        modules.modules.Mystore2.dispatch('getState')
        
        
        // payload.Mystore2?.dispatch('getState')  
    }

    // Mystore.onState(['age','address'],fn2)
    // Mystore.setState('name','CoderLLL')
    // Mystore.setState('age',20)
    // Mystore.setState('address','珠海市')
    // Mystore.offState('age',fn2)
    // Mystore.setState('age',19)
    // Mystore.setState('address','广州市')
    // Mystore.onState('obj',fn3)
    // Mystore.dispatch('add',123456,789)
    // Mystore.dispatch('ddd','LLL')

    
    // Mystore.dispatch('change')

    // Mystore.onState('obj2',fn4)
    // Mystore.dispatch('change2','aaac')

    Mystore.onState('modules',fn5)
}