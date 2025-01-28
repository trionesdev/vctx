import "./index.less"
import {defineComponent} from "vue";

export const Button = defineComponent({
    name: 'Button',
    props: {
        title: {
            type: String,
            required: false,
        },
        text:{
            type: String,
            required: false
        }
    },
    setup(_, { slots }: { slots: Readonly<any> }) {
        return () => <button>
            {slots.default?.()}
        </button>;
    },
});