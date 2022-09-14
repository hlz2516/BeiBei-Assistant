<template>
  <div
    id="tiptap-container"
    @click.capture="menuShow = false"
    ref="tiptap-container"
  >
    <div class="wrapper">
      <div
        class="menu"
        ref="menu"
        v-show="menuShow"
        @click.stop="menuShow = true"
      >
        <component
          :is="itemComponent"
          v-for="(param, index) in itemParams"
          :key="index"
          :editor="editor"
          :name="param.name"
          :value="param.value"
        />
      </div>
      <div class="func-part" @mousewheel.stop="scrollX($event)" ref="funcbox">
        <template v-if="editor">
          <div class="inner">
            <button
              @click="editor.chain().focus().unsetAllMarks().run()"
              class="func-btn"
              style="width: 80px"
            >
              清除样式
            </button>
            <button
              @click="editor.chain().focus().clearNodes().run()"
              class="func-btn"
              style="width: 80px"
            >
              清除节点
            </button>
            <button @click="openSubMenu($event, 'heading')" class="func-btn">
              标题
            </button>

            <button @click="openSubMenu($event, 'text-align')" class="func-btn">
              对齐
            </button>
            <button
              @click="openSubMenu($event, 'font-size')"
              class="func-btn"
              style="width: 90px"
            >
              字体大小
            </button>
            <button
              @click="editor.chain().focus().toggleBulletList().run()"
              class="func-btn"
              style="width: 80px"
              :class="{ 'is-active': editor.isActive('bulletList') }"
            >
              无序列表
            </button>
            <button
              @click="editor.chain().focus().toggleOrderedList().run()"
              class="func-btn"
              style="width: 80px"
              :class="{ 'is-active': editor.isActive('orderedList') }"
            >
              有序列表
            </button>
            <button
              @click="editor.chain().focus().toggleCodeBlock().run()"
              class="func-btn"
              :class="{ 'is-active': editor.isActive('codeBlock') }"
            >
              代码块
            </button>
            <button
              @click="editor.chain().focus().toggleBlockquote().run()"
              class="func-btn"
              style="width: 80px"
              :class="{ 'is-active': editor.isActive('blockquote') }"
            >
              blockquote
            </button>
            <button @click="setImage" class="func-btn">图片</button>

            <button
              @click="editor.chain().focus().toggleBold().run()"
              class="func-btn"
              :class="{ 'is-active': editor.isActive('bold') }"
            >
              加粗
            </button>

            <button
              @click="editor.chain().focus().toggleItalic().run()"
              class="func-btn"
              :class="{ 'is-active': editor.isActive('italic') }"
            >
              倾斜
            </button>

            <button
              @click="editor.chain().focus().toggleStrike().run()"
              class="func-btn"
              :class="{ 'is-active': editor.isActive('strike') }"
            >
              中划线
            </button>

            <button
              @click="editor.chain().focus().toggleUnderline().run()"
              class="func-btn"
              :class="{ 'is-active': editor.isActive('underline') }"
            >
              下划线
            </button>
            <button
              @click="editor.chain().focus().setHorizontalRule().run()"
              class="func-btn"
            >
              水平线
            </button>
            <button
              @click="editor.chain().focus().setHardBreak().run()"
              class="func-btn"
              style="width: 80px"
            >
              强制换行
            </button>
            <button
              @click="editor.chain().focus().undo().run()"
              class="func-btn"
            >
              撤销
            </button>
            <button
              @click="editor.chain().focus().redo().run()"
              class="func-btn"
            >
              恢复
            </button>
          </div>
        </template>
      </div>
    </div>
    <hr>
    <div class="input-part" @click.self="editor.commands.focus('end')">
      <bubble-menu
        :editor="editor"
        :tippy-options="{ duration: 100, placement: 'bottom-start' }"
        v-if="editor"
      >
        <button
          @click="editor.chain().focus().toggleBold().run()"
          class="bubble-btn"
          :class="{ 'is-active': editor.isActive('bold') }"
        >
          bold
        </button>
        <button
          @click="editor.chain().focus().toggleItalic().run()"
          class="bubble-btn"
          :class="{ 'is-active': editor.isActive('italic') }"
        >
          italic
        </button>
        <button
          @click="editor.chain().focus().toggleStrike().run()"
          class="bubble-btn"
          :class="{ 'is-active': editor.isActive('strike') }"
        >
          strike
        </button>
        <button
          @click="editor.chain().focus().toggleUnderline().run()"
          class="bubble-btn"
          :class="{ 'is-active': editor.isActive('underline') }"
        >
          underline
        </button>
      </bubble-menu>
      <editor-content :editor="editor" />
    </div>
  </div>
</template>

<script>
import { Editor, EditorContent, BubbleMenu } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import FontSize from "../extensions/font-size";
import Image from "@tiptap/extension-image";
import HeadingItem from "./HeadingItem.vue";
import FontSizeItem from "./FontSizeItem.vue";
import TextAlignItem from "./TextAlignItem.vue";

export default {
  name: "Tiptap",
  components: {
    EditorContent,
    BubbleMenu,
    TextAlign,
    HeadingItem,
    FontSizeItem,
    TextAlignItem,
  },

  data() {
    return {
      editor: null,
      menuShow: false,
      itemComponent: "",
      itemParams: [],
    };
  },
  methods: {
    scrollX(event) {
      this.$refs.funcbox.scrollLeft += event.deltaY;
    },
    setImage() {
      const url = window.prompt("URL");

      if (url) {
        this.editor.chain().focus().setImage({ src: url }).run();
      }
    },
    openSubMenu(event, type) {
      console.dir(this.$refs["tiptap-container"]);
      this.$refs.menu.style.setProperty(
        "left",
        event.target.offsetLeft -
          this.$refs.funcbox.scrollLeft +
          this.$refs["tiptap-container"].offsetLeft +
          10 +
          "px"
      );
      this.$refs.menu.style.setProperty(
        "top",
        event.target.offsetTop +
          event.target.offsetHeight +
          this.$refs["tiptap-container"].offsetTop +
          "px"
      );

      if (type === "heading") {
        this.itemComponent = "HeadingItem";
        this.itemParams = [
          {
            name: "h1",
            value: "1",
          },
          {
            name: "h2",
            value: "2",
          },
          {
            name: "h3",
            value: "3",
          },
        ];
      } else if (type === "font-size") {
        this.itemComponent = "FontSizeItem";
        this.itemParams = [
          {
            name: "12px",
            value: "12px",
          },
          {
            name: "14px",
            value: "14px",
          },
          {
            name: "16px",
            value: "16px",
          },
          {
            name: "18px",
            value: "18px",
          },
          {
            name: "20px",
            value: "20px",
          },
          {
            name: "24px",
            value: "24px",
          },
          {
            name: "32px",
            value: "32px",
          },
          {
            name: "48px",
            value: "48px",
          },
        ];
      } else if (type === "text-align") {
        this.itemComponent = "TextAlignItem";
        this.itemParams = [
          {
            name: "左对齐",
            value: "left",
          },
          {
            name: "居中对齐",
            value: "center",
          },
          {
            name: "右对齐",
            value: "right",
          },
        ];
      }

      this.$nextTick(() => {
        this.menuShow = true;
      });
    },
    test() {
      this.editor.commands.clearContent();
    },
  },
  mounted() {
    this.editor = new Editor({
      content: "<p>I’m running Tiptap with Vue.js. 🎉</p>",
      extensions: [
        StarterKit.configure({
          codeBlock: {
            HTMLAttributes: {
              class: "code-block",
            },
          },
        }),
        BubbleMenu,
        Underline,
        TextAlign.configure({
          types: ["heading", "paragraph"],
          alignments: ["left", "center", "right", "justify"],
          defaultAlignment: ["left"],
        }),
        TextStyle,
        FontSize,
        Image.configure({
          allowBase64: true,
          inline: true,
        }),
      ],
      editorProps: {
        attributes: {
          class: "prose",
        },
      },
      onUpdate:()=>{
        this.$emit('input',this.editor.getHTML())
      }
    });
  },
  watch: {
    value(value) {
      // HTML
      const isSame = this.editor.getHTML() === value
 
      // JSON
      // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)
 
      if (isSame) {
        return
      }
 
      this.editor.commands.setContent(value, false)
    },
  },
  props:{
    value:{
      type:String,
      default:''
    }
  },
  beforeDestroy() {
    this.editor.destroy();
  },
};
</script>

<style scoped>
#tiptap-container {
  --my-width: 100%;
  --my-height: 100%;
  width: var(--my-width);
  height: var(--my-height);
  /* border: 2px solid black; */
  /* border-radius: 4px; */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.func-part {
  height: 100%;
  /* border-bottom: 2px solid black; */
  box-sizing: border-box;
  overflow-x: auto;
  position: relative;
  overscroll-behavior: contain;
}

.wrapper {
  flex-basis: 60px;
  width: 100%;
  overflow: visible;
}

.menu {
  width: 100px;
  height: fit-content;
  border: 1px solid black;
  border-radius: 4px;
  position: absolute;
  z-index: 1;
  right: 0;
  background-color: #fff;
}

.menu-item {
  width: 100%;
  height: 30px;
  box-sizing: border-box;
  padding: 2px 8px;
  line-height: 28px;
  text-align: center;
  border-bottom: 1px solid #888;
}

.menu-item:hover {
  cursor: pointer;
  background-color: rgb(180, 180, 180);
}

.menu-item:last-child {
  border-bottom: 0;
}

.input-part {
  flex: 1;
  overflow-y: auto;
  cursor: text;
  padding: 4px;
}

.inner {
  width: 1350px;
  height: 100%;
  /* position: relative; */
  position: absolute;
  left: 0;
  margin: 0 4px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
/* >>>表示穿透，为了能修改tiptap的prose样式，在scoped的情况下需要穿透，下同 */
div >>> .prose {
  padding: 0 4px;
}

div >>> .prose > p {
  margin: 4px 0;
}

div >>> .prose:focus {
  outline: none;
}

.bubble-btn {
  background-color: rgb(250, 250, 250);
  border-radius: 4px;
  margin: 0 1px;
}

.func-btn {
  width: 60px;
  height: 30px;
  background-color: rgb(250, 250, 250);
  border-radius: 4px;
  margin: 6px 2px;
  font-size: 12px;
}

.is-active {
  background-color: rgb(151, 151, 151);
}

div >>> .code-block {
  background-color: #000;
  margin: 0;
  color: #fff;
  font-size: 14px;
  line-height: 18px;
}
</style>
