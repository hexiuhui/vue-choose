<template>
  <div id="Dimension" v-if="myshow">
      <div>
            <ul>
                <li 
                    @click="selectedFirst(item,index) "
                    :class='{
                            "isinit":item.myClass.isinit,
                            "isopen":item.myClass.isopen,
                            "chooseself":item.myClass.chooseself,
                            "choosechild":item.myClass.choosechild
                            }'
                    v-for="(item, index) in addClassData" :key="index"
                    >
                    {{item.firstName}}
                    <div v-show="item.myClass.chooseself" class="isself"><a></a></div>
                </li>
            </ul>
      </div>
    
    <div>
        <ul class="ulML50" v-show="show2">
            <li 
                @click="selectedSecond(item,index)"
                :class='{
                        "isinit":item.myClass.isinit,
                        "isopen":item.myClass.isopen,
                        "chooseself":item.myClass.chooseself,
                        "choosechild":item.myClass.choosechild
                        }'
                v-for="(item, index) in myChip" :key="index"
                >
                {{item.secondName}}
                <div v-show="item.myClass.chooseself"  class="isself"><a></a></div>
            </li>
        </ul>
    </div>

    <div>
        <ul class="ulML50" v-show="show3">
            <li 
                @click="selectedThird(item,index)"
                :class='{
                        "isinit":item.myClass.isinit,
                        "isopen":item.myClass.isopen,
                        "chooseself":item.myClass.chooseself,
                        "choosechild":item.myClass.choosechild
                        }'
                v-for="(item, index) in myModel" :key="index"
                >
                {{item.thirdName}}
                <div v-show="item.myClass.chooseself"  class="isself"><a></a></div>
            </li>
        </ul>
    </div>
    <div class="choosediv">
        <span>已选择：</span>
        <span 
            v-for = '(item,index) in choosemsg' :key="index" 
            class="chooselist"
            @click='cancelThis(item,index)'
            >
              {{item.name}} 
        </span>
    </div>
  </div>
</template>

<script>

export default {
    name: 'vue-choose-plug',
    props: {
        myshow: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            myData : [],
            choosemsg:[],
            myChip : 0,
            myModel : 0,
            test:0,
            show2 : false,
            show3 : false,
            // url:"@/../static/data/dimensionNew.json"
            url : 'https://dev-web-services.tvflnet.com/dimension/0403000'
        }
    },
    mounted () {
    /**读取json */
        this.$http.get (this.url)
        .then ( ( res ) => {
            console.log(res.data.data.content)
            this.myData = res.data.data.content;
        })
        .catch ( function ( error ) {
            console.log ( error );
        })
    },
    methods:{
    //选择第一层
        selectedFirst(item,index){
            let status = item.myClass
            this.myChip = item.content;
            if(status.chooseself===false){
                if(status.isopen===true&&this.show2===true&&status.choosechild===false){
                    this.changeStyle4(item,1);
                }else if(status.isopen===false&&status.choosechild===true){
                    this.changeStyle6(item,1);
                }else if(status.isopen===true&&this.show2===true&&status.choosechild===true){
                    this.changeStyle7(item,1);
                }
                else{
                    this.changeStyle3(item,1);
                }
            }else{
                if(status.choosechild===true){
                    this.changeStyle5(item,1);
                }else{
                this.changeStyle2(item,1);
                }
            }
            //(循环，只允许展开一个)
            for(let i =0,length=this.myData.length;i<length;i++){
                if(i!=index){
                    this.myData[i].myClass.isopen=false;
                    this.show3=false;
                }else{
                    this.myChip.forEach(pro=>{
                        if(pro.myClass.isopen===true){
                            pro.myClass.isopen=false;
                            this.show3=false;
                        }else{
                            // this.show3=false;
                        }
                    })
                }
            }
        },
    //选择第二层
        selectedSecond(item,index){
            let status = item.myClass;
            this.myModel = item.content;
            //isopen只能是一个为true(循环，只允许展开一个)
            for(let i =0,length=this.myChip.length;i<length;i++){
                if(i!=index){
                    this.myChip[i].myClass.isopen=false;
                }
            }
            if (status.chooseself === false) {
                //选中子节点时，父节点取消选中父节点本身
                this.myData.forEach(pro => {
                  if (pro.firstId == item.firstId) {
                    pro.myClass.chooseself = false;
                    this.deletemsg(pro)
                  }
                })
                if (status.isopen===true&&this.show3===true && status.choosechild === false) {
                    this.changeStyle4(item,0);
                    console.log(44)
                }else if (status.isopen===false&&this.show3===false && status.choosechild === true) {
                    this.changeStyle6(item,0);
                    console.log(66)
                }else if (status.isopen === true && this.show3 === true && status.choosechild === true) {
                    this.changeStyle7(item,0);
                }else{
                    if(status.choosechild==true&&status.isopen===false){
                        this.changeStyle6(item,0);
                    }else{
                        this.changeStyle3(item,0);
                        console.log(33)
                    }
                //如果没有子节点，则不展开
                    if (!this.myModel) {
                        item.myClass.isopen=false;
                    }
                    
                }
            } else {
                if (status.choosechild===true){
                    this.changeStyle5(item,0);
                }else{
                    this.changeStyle2(item,0); 
                }
            }
            this.noChooseCities(item);

        },
        //选择第三层
        selectedThird(item,index){
            let status = item.myClass;
            if(status.chooseself===false&&status.choosechild===false){
                this.changeStyle1(item);
            }else{
                this.changeStyle2(item);
                status.isopen=!status.isopen;
            }
            this.noChooseBlocks(item);
        },
    //cities子节点都没用选中时，myProvinces父节点的choosechild要变成false
        noChooseCities(item){
            let choosechildFalse = this.myChip.every(pro=>{
                return ( pro.myClass.chooseself == false && pro.myClass.choosechild == false )
            })
            if(choosechildFalse==true){
                this.myData.forEach(pro=>{
                    if(pro.firstId == item.firstId){
                        pro.myClass.choosechild=false;
                    }
            })
            }else{
                //选中子节点时，父节点取消选中父节点本身
                this.myData.forEach(pro=>{
                    if(pro.firstId == item.firstId){
                        pro.myClass.chooseself = false;
                        pro.myClass.choosechild = true;
                    }
                })
            }
        },
    noChooseBlocks(item){
        //blocks节点都没用选中时，cities节点choosechild要变成false
        let choosechildFalse = this.myModel.every(pro=>{
          return pro.myClass.chooseself == false
        })
        if(choosechildFalse==true){
            this.myChip.forEach(pro=>{
                if(pro.firstId == item.firstId && pro.secondId == item.secondId){
                    pro.myClass.choosechild = false;
                    pro.myClass.isopen = false;
                    this.show3 = false;
                }
            })
            //city节点都没用选中时，sheng节点choosechild也要变成false
            let choosechildFalse1 = this.myChip.every(pro=>{
                return ( pro.myClass.chooseself == false && pro.myClass.choosechild == false )
            })
            console.log(choosechildFalse1)
            if(choosechildFalse1==true){
                this.myData.forEach(pro=>{
                    if(pro.firstId == item.firstId){
                        pro.myClass.choosechild=false;
                    }
                })
            }
        }else{
          //选中blocks节点时，cities节点取消选中父节点本身
            this.myChip.forEach(pro=>{
                if(pro.firstId == item.firstId && pro.secondId == item.secondId){
                    pro.myClass.chooseself = false;
                    pro.myClass.choosechild = true;
                    this.deletemsg(pro)
                }

                this.noChooseCities(item);
            })
        }
    },
    
//初始状态---->>选中不展开
    changeStyle1(item){
        let status = item.myClass;
        status.chooseself=!status.chooseself;
        status.choosechild=!status.choosechild;
        this.ischoosemsg(item);
    },
//初始状态---->>选中且展开
    changeStyle2(item,whoShow){
        let status = item.myClass;
        status.chooseself=!status.chooseself;
        status.choosechild=!status.choosechild;
        status.isopen=!status.isopen;
        if(whoShow==1){
          this.show2=false;
        }else if(whoShow==0){
          this.show3=false;
        }
        this.deletemsg(item);
    },
//初始状态---->>选中且展开
    changeStyle3(item,whoShow){
        let status = item.myClass;
        status.chooseself=!status.chooseself;
        status.choosechild=!status.choosechild;
        status.isopen=true;
        if(whoShow==1){
          this.show2=true;
        }else{
          this.show3=true;
        }
        this.ischoosemsg(item);
    },
//展开且无选中---->>收起
    changeStyle4(item,whoShow){
        let status = item.myClass;
        status.isopen=false;
        let that = this;
        if(whoShow==1){
          this.show2=false;
        }else{
          this.show3=false;
        }
        this.deletemsg(item);
    },
//选中且展开---->>初始
    changeStyle5(item,whoShow){
        let status = item.myClass;
        status.isopen=false;
        status.chooseself=false;
        status.choosechild=false;
        if(whoShow==1){
          this.show2=false;
        }else{
          this.show3=false;
        }
        this.deletemsg(item);
    },
//选中子节点且收起子节点---->>展开
    changeStyle6(item,whoShow){
        let status = item.myClass;
        status.isopen=true;
        if(whoShow==1){
          this.show2=true;
        }else{
          this.show3=true;
        }
    },
//选中子节点且展开子节点---->>收起
    changeStyle7(item,whoShow){
        let status = item.myClass;
        status.isopen=false;
        if(whoShow==1){
          this.show2=false;
        }else{
          this.show3=false;
        }
    },
    /**已选择 */
    ischoosemsg:function(item){
        let newDate = Object.assign({},item)
        if ( newDate.level === 1 ) {
            let proName = this.myData.filter ( pro => {
                return newDate.firstId === pro.firstId
            })
            newDate.name = `${proName[0].firstName}`;
        } else if ( newDate.level === 2 ) {
            let proName = this.myData.filter ( pro => {
                return newDate.firstId === pro.firstId
            })
            newDate.name = `${proName[0].firstName}_${newDate.secondName}`;
        }else{
            let proName = this.myChip.filter( pro => {
                return ( newDate.firstId == pro.firstId && newDate.secondId == pro.secondId)
            })
            newDate.name = `${proName[0].secondName}_${newDate.thirdName}`;
        }
        this.choosemsg.push(newDate);
    },
    /**删除已选择 */
    deletemsg:function(item){
        this.choosemsg.forEach((value, index, array) => {
            if((value.level === 1 && value.firstId ===item.firstId)||
                (value.level === 2 && value.secondId ===item.secondId)||
                (value.level === 3 && value.thirdId ===item.thirdId)
                ){
                this.choosemsg.splice(index,1)
                // console.log(`${value.name}---${value.firstId}---${value.secondId}---${value.thirdId}---${value.level}`)
            }else{
                
            }
        });
    },/**点击自身，删除自身 */
    cancelThis(item,index){
        //第一层
        if(item.level === 1){
            console.log('第一层')
            // this.selectedFirst(item,index);
            if( this.myChip.length && this.myChip.length > 0){
                this.changeStyle2(item,0);
                for(let i =0,length=this.myData.length;i<length;i++){
                this.myData[i].myClass.isopen=false;
                }
                this.show2 = false;
            }else{
                this.changeStyle2(item,1);
            }
        //第二层
        }else if(item.level == 2){
            console.log('第二层')
            if( this.myModel.length && this.myModel.length > 0){
                    this.changeStyle2(item,0);
                    for(let i =0,length=this.myChip.length;i<length;i++){
                        this.myChip[i].myClass.isopen=false;
                    }
                    this.show3 = false;
                }else{
                    this.changeStyle2(item,1);
                }
    //查询第二层是否都没选中
                let arr = this.myData.filter((item1)=> {
                    return (item1.firstId === item.firstId && item1.content)
                })
                let arr2 = arr[0].content;
                let choosechildFalse = arr2.every(pro=>{
                    return ( pro.myClass.chooseself == false && pro.myClass.choosechild == false )
                })
                if(choosechildFalse==true){
                    this.myData.forEach(pro=>{
                        if(pro.firstId == item.firstId){
                            pro.myClass.choosechild=false;
                            console.log('2层都没选中')
                        }
                    })
                }
            item.myClass.isopen = false;
        //第三层
        }else{
            this.changeStyle2(item);
            item.myClass.isopen = false;
            //是否还有相同芯片下的Model
            let noChooseThird = this.choosemsg.some(pro=>{
                return (pro.firstId == item.firstId && pro.secondId == item.secondId)
            })
            if(!noChooseThird){
                this.recursion(this.myData,item)
                //是否还有相同Brand下的Model
                let noChooseSecond = this.choosemsg.some(pro=>{
                    return (pro.firstId == item.firstId)
                })
                if(!noChooseSecond){
                    this.recursion3(this.myData,item)
                }
            }
            
        }
    },
    recursion(arr,item){
        let that = this;
        let addClass = function( arr ){
                arr.map( ( pro ) => {
                    if(pro.level == 2){
                        if(pro.myClass.isopen == true){
                            pro.myClass.isopen = false;
                        }
                        if( pro.firstId == item.firstId && pro.secondId == item.secondId){
                            pro.myClass.choosechild=false;
                            pro.myClass.chooseself=false;
                            pro.myClass.isopen = false;
                            that.show3 = false;
                        }
                    }

                    if( pro.content && pro.content.length > 0 ){
                        addClass ( pro.content )
                    } else {
                        return pro
                    }
                })
                return arr;
        }
        let newData = addClass(arr);
        return newData;
    },
    recursion3(arr,item){
        let addClass = function( arr ){
                arr.map( ( pro ) => {
                    if(pro.firstId == item.firstId && pro.level == 1){
                        pro.myClass.choosechild=false;
                        pro.myClass.chooseself=false;
                    }
                    if( pro.content && pro.content.length > 0 ){
                        addClass ( pro.content )
                    } else {
                        return pro
                    }
                })
                return arr;
        }
        let newData = addClass(arr);
        return newData;
    }
},

    computed: {
        //给json数据添加class
        addClassData(){
            let addClass = function( arr ){
                arr.map( ( item ) => {
                    item.myClass = {
                        isinit:true,
                        isopen:false,
                        chooseself:false,
                        choosechild:false
                    }
                    if( item.content && item.content.length > 0 ){
                        addClass ( item.content )
                    } else {
                        return item
                    }
                })
                return arr;
            }
            let newData = addClass(this.myData);
            return newData;
        }
        
    }
}
</script>

<style>
/*初始状态*/
ul{
    background-color: #F8F8F8;
    padding: 0 5px;
    margin:5px 0;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    border-radius: 5px;
}
ul,li{list-style: none}
/*左移20像素*/
.ulML20{
  margin-left: 20px;
}
.ulML50{
  margin-left: 50px;
}
.ulML80{
  margin-left: 80px;
}
li{
    /* flex-grow: 1; */
    /* flex-basis: 8%; */
    box-sizing: border-box;
    list-style: none;
    font-size: 14px;
    line-height: 10px;
    border-radius: 5px;
    border: 2px #ccc dashed;
    margin: 10px 0 10px 10px;
    padding: 11px;
    position: relative;
    text-align: center;
    cursor:pointer;
}
.isinit{border-style: dashed;}
.isopen{background-color: #E0E0E0}
.choosechild{border-style: solid;}
/*选中确认的样式*/
a{margin-left: -20px;margin-bottom: -22px; display: inline-block; width: 6px;height:2px; background: #fff;line-height: 0;font-size:0;vertical-align: middle;-webkit-transform: rotate(45deg);}
a:after{content:'/';display:block;width: 12px;height:2px; background: #fff;-webkit-transform: rotate(-90deg) translateY(-50%) translateX(50%);}
.isself{
    width: 0;
    height: 0;
    border-bottom: 21px solid #666;
    border-left: 21px solid transparent;
    position: absolute;
    bottom: 0;
    right: 0;
}
.isself{zoom:1}
/*已选择的列表*/
.choosediv{
    width: 100%;
    margin: 15px 20px;
}
.chooselist{
    display: inline-block;
    background-color: #E4E4E4;
    padding: 5px;
    border-radius: 5px;
    margin: 2px;
    cursor: pointer;
}
</style>
