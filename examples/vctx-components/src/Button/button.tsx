import "./index.less"
import Vue,{defineComponent} from "vue";

export const Button = defineComponent({
    name: 'Button',
    props: {
        title: {
            type: String,
            required: false,
        },
    },
    setup(_, { slots }: { slots: Readonly<any> }) {
        return () => <button>
            {slots.default?.()}
        </button>;
    },
});