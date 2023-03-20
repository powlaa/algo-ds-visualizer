import { ArrayDisplay } from "../src/static/js/components/ArrayDisplay";

export default {
    title: "Vis/ArrayDisplay",
};

const Template = ({ width }) => `<array-display style="width:${width};"></array-display>`;

export const ArrayDisplayRegular = Template.bind({});
ArrayDisplayRegular.args = {
    width: "100%",
};

document.addEventListener("DOMContentLoaded", (e) => {
    const arrayDisplay = document.querySelector("array-display");
    if (!e.isTrusted && arrayDisplay) {
        arrayDisplay.data = [{ value: 2 }, { value: 5 }, { value: 6 }, { value: 13 }, { value: 7 }, { value: 8 }, { value: 9 }];
    }
});
