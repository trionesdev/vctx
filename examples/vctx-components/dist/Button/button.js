import "./index.less";
import * as Vue, { defineComponent } from "vue";
export const Button = defineComponent({
    name: 'Button',
    props: {
        title: {
            type: String,
            required: false
        }
    },
    setup (_, { slots }) {
        return ()=>/*#__PURE__*/ Vue.h("button", null, slots.default?.());
    }
});
