import vueChoosePlug from './vue-choose-plug.vue'
const chooseplug = {
    install (Vue, option){
        Vue.component(vueChoosePlug.name,vueChoosePlug)
    }
}
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(chooseplug);
}
export default chooseplug