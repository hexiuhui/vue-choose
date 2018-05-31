import vueChoosePlug from './vue-choose-plug.vue'
const chooseplug = {
    install (Vue, option){
        Vue.component(vueChoosePlug.name,vueChoosePlug)
    }
}

export default chooseplug