/**
 * Created by bigbananas on 2017/11/21.
 */
const vm = new Mvvm({
    element: '#id-mvvm-template',
    data: {
        word: '666666',
        list: [
            {a: 1},
            {b: 2},
        ]
    }
})