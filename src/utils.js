/**
 * Created by bigbananas on 2017/11/21.
 */
const log = console.log.bind(console)

const fragmentByNode = (node) => {
    const fragment = document.createDocumentFragment()
    const nodes = node.childNodes
    const len = nodes.length
    for (let i = 0; i < len; i++) {
        const n = nodes[0]
        fragment.appendChild(n)
    }
    return fragment
}