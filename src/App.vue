<template>
  <div id="app">
    <button @click="Show()">点击显示（隐藏）</button>
    <choose :myshow='myshow'>

    </choose>
  </div>
</template>

<script>
import choose from './lib/choose'
export default {
  name: 'app',
  data () {
    return {
      myshow : false,
    }
  },
  methods:{
    Show(){
      this.myshow = !this.myshow
    }
  },
  components:{
    choose
  }
}
</script>

<style>

</style>
