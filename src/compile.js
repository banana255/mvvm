/**
 * Created by bigbananas on 2017/11/21.
 */
import { log, fragmentByNode } from './utils'

class Directives {
    constructor(data) {
        this.directives = ['g-bind', 'g-on', 'g-text', 'g-model']
        this.data = data
    }
    'g-bind'({node, key, value}) {
        Dep.target = (v) => {
            node.setAttribute(key, v)
        }
        const v = this.data[value]
        node.setAttribute(key, v)
    }
    'g-on'({node, key, value}) {
        // TODO: 待调试
        node.addEventListener(key, (event) => {
        
        })
    }
    'g-text'({node, value}) {
        const keys = []
        let i = 0
        while(i < value.length) {
            const item = value.slice(i, i+2)
            if(item === '{{') {
                const {token, offset} = this.tokenEnd(value.slice(i+2))
                keys.push({token, begin:i, offset: offset+2})
                i += offset + 2
            } else {
                i++
            }
        }
        // log('text', text)
        let text = ''
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i]
            Dep.target = (v) => {
                const text = value.slice(0, k.begin) + v + value.slice(k.begin + k.offset)
                node.nodeValue = text
            }
            text += value.slice(0, k.begin) + this.data[k.token] + value.slice(k.begin + k.offset)
        }
        node.nodeValue = text
    }
    'g-model'({node, value}) {
        Dep.target = (v) => {
            node.value = v
        }
        const v = this.data[value]
        node.value = v
        node.addEventListener('input', (event) => {
            const v = event.target.value
            this.data[value] = v
        })
    }
    'g-for'({node, key, value}) {
    
    }
    tokenEnd(str) {
        let i = 0
        while(i < str.length) {
            const item = str.slice(i, i+2)
            if(item === '}}') {
                const token = str.slice(0, i).trim()
                return {token, offset: i+2}
            }
            i++
        }
        console.error('tokenEnd: unfind }} flag')
    }
}

class Compiler extends Directives{
    constructor(element, data) {
        super(data)
        this.element = element
        this.fragment = fragmentByNode(element)
        this.compilerElement(this.fragment)
        this.element.appendChild(this.fragment)
    }
    compilerElement(fragment) {
        const childNodes = fragment.childNodes
        for (let i = 0; i < childNodes.length; i++) {
            const node = childNodes[i]
            // 解析 指令
            this.handleOrder(node)
            
            // 递归寻找 指令
            if(node.childNodes.length > 0) {
                this.compilerElement(node)
            }
        }
    }
    handleOrder(node) {
        if(node.nodeType === Node.TEXT_NODE) {
            // text node
            const value = node.nodeValue.trim()
            // 判断 {{ }}
            if(value.includes('{{')) {
                const index = value.indexOf('{{')
                if(value.slice(index).includes('}}')) {
                    this['g-text']({node, value})
                }
            }
            
        } else if(node.nodeType === Node.ELEMENT_NODE) {
            const attrs = node.attributes
            for (let i = 0; i < attrs.length; i++) {
                const attr = attrs[i]
                const [order, key] = attr.name.split(':')
                if(this.directives.includes(order)) {
                    const value = attr.value
                    this[order]({node, key, value})
                    node.removeAttribute(attr.name)
                }
            }
        }
    }
}

export default Compiler

if(module === require.main) {
    const o = new Directives({a:122})
    o['gua-text']({value: 'aaaa{{a }}ddd'})
}

