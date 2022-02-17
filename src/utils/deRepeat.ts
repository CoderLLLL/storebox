const deRepeat = (arr1:string[],arr2:string[]) =>{
    const newArr = new Set()
    if(arr1.length !== 0){
        for(const item of arr1){
            newArr.add(item)
        }
    }
    
    for(const item of arr2){
        newArr.add(item)
    }

    return Array.from(newArr) as string[]
}

export default deRepeat