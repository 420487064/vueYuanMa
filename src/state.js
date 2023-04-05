import { obeserve } from "./obeserve/index.js";

export function initState(vm) {
    const opts = vm.$options;
    if (!opts.render) {
        
            initData(vm)     
       
    }
}

function proxy(vm,target,key) {
    Object.defineProperty(vm,key,{
        get(){
            return vm[target][key];
        },
        set(newvalue){
            if(vm[target][key] === newvalue) return;
            vm[target][key] = newvalue;
        }
    })
}

function initData(vm) {
    let data = vm.$options.data

    data = typeof data === 'function' ? data.call(vm) : data;
    
    vm._data = data

    // 数据劫持
    obeserve(data)
    
    for(let key in data){
        proxy(vm,"_data",key);
    }
}