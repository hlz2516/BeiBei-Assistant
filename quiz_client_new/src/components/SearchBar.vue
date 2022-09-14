<template>
  <div class="search-container" ref="search">
    <div class="icon-part">
      <Icon type="ios-search" ref="icon" />
    </div>
    <div class="input-part">
      <input
        type="text"
        class="input-search"
        :placeholder="placeholder"
        ref="input"
        :value="value"
        @input="$emit('input', $event.target.value)"
        @keyup.enter="$emit('handle')"
        @focus="$emit('focustodo')"
        @blur="$emit('blurtodo')"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchBar",
  props: {
    value: String,
    width: String,
    height: String,
    "flex-w": String,
    "flex-h": String,
    "half-radius": Boolean,
    placeholder: String,
    "font-size": String
  },
  emits:['input'],
  mounted() {
    const container = this.$refs.search;
    if (this.width) {
      container.style.setProperty("--con-width", this.width);
    }

    if (this.height) {
      container.style.setProperty("--con-height", this.height);
    }

    const icon = this.$refs.icon;
    const input = this.$refs.input;
    if (this.fontSize) {
      icon.style.setProperty("font-size", this.fontSize);
      input.style.setProperty("font-size", this.fontSize);
    }

    if (this.halfRadius) {
      container.classList.add('half-radius')
    }

    if (this.flexW) {
      container.style.setProperty("width", this.flexW);
      let w = window.getComputedStyle(container)["width"];
      container.style.setProperty("--con-width", w);
    }

    if (this.flexH) {
      container.style.setProperty("height", this.flexH);
      let h = window.getComputedStyle(container)["height"];
      container.style.setProperty("--con-height", h);
    }

  },
};
</script>

<style scoped>
.search-container {
  --con-width: 150px;
  --con-height: 30px;
  --flex-h: 0;
  --flex-w: 0;
  width: var(--con-width);
  height: var(--con-height);
  display: flex;
  justify-content: center;
  align-items: stretch;
  border: 1px solid black;
}

.icon-part {
  flex-basis: var(--con-height);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-part {
  flex: 1;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  background: rgba(255,255,255,0);
}

.input-search {
  padding: 2px 4px;
  width: calc(100% - var(--con-height) / 2);
  height: 100%;
  box-sizing: border-box;
  outline: none;
  border: 0;
  font-size: 14px;
  background-color:#F5F7F9;
}

.half-radius{
  border-radius: calc(var(--con-height) / 2);
}
</style>
