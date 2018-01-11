/**
 * Created by bigbananas on 2017/11/21.
 */
class Observer {
    constructor(data={}) {
        this.data = data
        this.observeProperties(data)
    }
    
    rewriteArrayMethods(array) {
        if(this.rewriteArrayMethodsStatus === true) {
            return
        } else {
            this.rewriteArrayMethodsStatus = true
        }
        const proto = Array.prototype
        const arrayMethods = Object.create(proto)
        const methods = ['push','pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']
        methods.forEach(method => {
            Object.defineProperty(arrayMethods, method, {
                value(...args) {
                    this.triggerChange({newValue: args, method})
                    return proto[method](...args)
                }
            })
        })
        array.__proto__ = arrayMethods
    }
    
    triggerChange({method, oldValue, newValue}) {
    
    }
    
    observeProperties(data) {
        if(data instanceof Object) {
            Object.keys(data).forEach((item) => {
                const value = data[item]
                this.observeProperty(data, item)
                this.observeProperties(value)
            })
        }
        if(Array.isArray(data)) {
            this.rewriteArrayMethods(data)
        }
    }
    
    observeProperty(data, key) {
        const cls = this
        const dep = new Dep()
        let value = data[key]
        // Watcher.add(key)
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: false,
            get() {
                if(Dep.target !== null) {
                    dep.addSub(Dep.target)
                    Dep.target = null
                }
                return value
            },
            set(newValue) {
                const oldValue = value
                value = newValue
                // log('监听到变化了', key, oldValue, '==>', newValue)
                dep.notify(newValue, oldValue)
                this.observeProperties(newValue)
            }
        })
    }
}

// 消息订阅器
class Dep {
    constructor() {
        this.subs = []
    }
    
    addSub(sub) {
        this.subs.push(sub)
    }
    
    notify(newValue, oldValue) {
        this.subs.forEach(sub => {
            sub(newValue, oldValue)
        })
    }
}