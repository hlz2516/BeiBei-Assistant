<template>
  <div class="unit-chart-container" ref="container">
    <div class="units-layout">
        <unit v-for="(item,index) in datas" :key="item.id" 
        v-on:unitclick="UnitOnClick(index)" 
        :question="item.question"
        :tags="item.tags"
        :importance="item.importance"
        :level="item.level"
        :color="handleColor(item.level)"
        />
    </div>
  </div>
</template>

<script>
import Unit from './Unit.vue';

export default {
    name:'UnitChart',
    components:{Unit},
    data() {
        return {
            
        }
    },
    props:{
        datas:{
            type:Array,
            default:[]
        },
        width:{
            type:String
        },
        height:{
            type:String
        },
        UnitOnClick:{
            type:Function
        }
    },
    mounted() {
        // this.UnitOnClick();
        if (this.width) {
            this.$refs.container.style.setProperty('--width',this.width);
        }
        if (this.height) {
            this.$refs.container.style.setProperty('--height',this.height);
        }
    },
    methods: {
        handleColor(level){
            let color = '#fff';
            switch (level) {
                case '已熟悉':
                    color = '#7CFC00'
                    break;
                case '已理解':
                    color = '#FFD700'
                    break;
                case '不理解':
                    color = '#FF0000'
                    break;
                default:
                    break;
            }
            return color;
        }
    },
};
</script>

<style>
.unit-chart-container {
  --width: 200px;
  --height: 150px;
  display: inline-block;
  width: var(--width);
  height: var(--height);
  padding: 8px;
  border: 1px solid black;
  overflow-x: auto;
  overflow-y: hidden;
}

.units-layout {
  height: 100%;
  box-sizing: border-box;
  min-width: 60px;
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: repeat(auto-fit, 20px);
  grid-template-rows: repeat(auto-fit, 20px);
  grid-auto-rows: 20px;
  grid-auto-columns: 20px;
  column-gap: 4px;
  row-gap: 4px;
  align-content: center;
}
</style>