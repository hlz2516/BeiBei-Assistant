<template>
  <div v-if="editor"
    class="menu-item"
    @click="editor.chain().focus().toggleHeading({ level: Number(value) }).run()"
    :class="{ 'is-active': editor.isActive('heading', { level: Number(value) }) }"
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
