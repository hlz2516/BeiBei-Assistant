import FontFamily from "@tiptap/extension-font-family";
/**
 * references:
 * 1. https://gist.github.com/gregveres/64ec1d8a733feb735b7dd4c46331abae
 * 2. https://tiptap.dev/guide/custom-extensions#introduction
 */
export default FontFamily.extend({
    name: "fontSize",
    addGlobalAttributes() {
      return [
        {
          types: this.options.types,
          attributes: {
            fontSize: {
              default: null,
              parseHTML: (element) =>
                element.style.fontSize.replace(/['"]+/g, ""),
              renderHTML: (attributes) => {
                if (!attributes.fontSize) {
                  return {};
                }
  
                return {
                  style: `font-size: ${attributes.fontSize}`,
                };
              },
            },
          },
        },
      ];
    },
  
    addCommands() {
      return {
        setFontSize:
          (fontSize) =>
          ({ chain }) => {
            return chain().setMark("textStyle", { fontSize }).run();
          },
        unsetFontSize:
          () =>
          ({ chain }) => {
            return chain()
              .setMark("textStyle", { fontSize: null })
              .removeEmptyTextStyle()
              .run();
          },
      };
    },
  });
