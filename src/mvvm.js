/**
 * Created by bigbananas on 2017/11/21.
 */
import Observer from './observer'
import Compiler from './compile'
class Mvvm {
    constructor(options={}) {
        this.options = options
        this.element = document.querySelector(options.element)
        this.observer = new Observer(this.options.data)
        this.compiler = new Compiler(this.element, this.observer.data)
    }
}

export default Mvvm