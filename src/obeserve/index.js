import { newArrayProto } from "./array";

class Observer{
    constructor(data){
        //  data.__ob__ = this; 
        Object.defineProperty(data,'__ob__',{
            value: this,
            enumerable: false
        })
        if(Array.isArray(data)){
             data.__proto__ = newArrayProto;
            this.obeserveArray(data);
        }else{
            this.walk(data);     
        }
    }
    walk(data){
        Object.keys(data).forEach(key => defineReactive(data,key,data[key]))
    }
    obeserveArray(data){
        data.forEach(item => {
            obeserve(item)
        });
    }
}

export function defineReactive(target,key,value) {
    obeserve(value);
    Object.defineProperty(target,key,{
        get(){
            return value;
        },
        set(newvalue){
            if(newvalue === value) return ;
            value = newvalue;
        }
    })
}

export function obeserve(data) {
    if (typeof data !== 'object' || data == null) {
        return;
    }
    
    if (data.__ob__  instanceof Observer) {
        return data.__ob__;
    }
    return new Observer(data);
}