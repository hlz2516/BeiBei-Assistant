<template>
  <div v-if="editor"
    class="menu-item"
    @click="editor.chain().focus().setFontSize(value).run()"
  >
    {{name}}
  </div>
</template>

<script>
export default {
    name:'HeadingItem',
    props:{
        editor:Object,
        name:String,
        value:String
    }
};
</script>

<style>

</style>
