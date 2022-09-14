<template>
  <div
    v-if="editor"
    @click="editor.chain().focus().setTextAlign(value).run()"
    class="menu-item"
    :class="{ 'is-active': editor.isActive('textAlign', value) }"
  >
    {{ name }}
  </div>
</template>

<script>
export default {
    name:'TextAlignItem',
    props:{
        editor:Object,
        name:String,
        value:String
    }

};
</script>

<style></style>
