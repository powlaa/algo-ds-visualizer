import "../src/static/css/index.css";
import { PseudocodeDisplay } from "../src/static/js/components/PseudocodeDisplay";

export default {
    title: "PseudocodeDisplay",
};

const Template = ({}) => `<pseudocode-display></pseudocode-display>`;

export const PseudoCodeDisplay = Template.bind({});

document.addEventListener("DOMContentLoaded", (e) => {
    const pseudocodeDisplay = document.querySelector("pseudocode-display");
    if (!e.isTrusted && pseudocodeDisplay) {
        pseudocodeDisplay.code = [
            { code: "<b>Heapsort</b>(A as array)", indent: 0, label: "heapsort" },
            { code: "<b>BuildMaxHeap</b>(A)", indent: 1, label: "heapsort-build-max-heap" },
            { code: "<b>for</b> i = A.length - 1 to 0", indent: 1, label: "heapsort-for-loop" },
            { code: "swap A[0] and A[i]", indent: 2, label: "heapsort-swap" },
            { code: "<b>Heapify</b>(A, 0)", indent: 2, label: "heapsort-heapify" },
            { code: "", indent: 0, label: "empty" },
            { code: "<b>BuildMaxHeap</b>(A as array)", indent: 0, label: "build-max-heap" },
            { code: "<b>for</b> i = floor(A.length / 2) to 0", indent: 1, label: "build-max-heap-for-loop" },
            { code: "<b>Heapify</b>(A, i)", indent: 2, label: "build-max-heap-heapify" },
            { code: "", indent: 0, label: "empty" },
            { code: "<b>Heapify</b>(A as array, i as int)", indent: 0, label: "heapify" },
            { code: "l = 2 * i + 1", indent: 1, label: "heapify-l" },
            { code: "r = 2 * i + 2", indent: 1, label: "heapify-r" },
            { code: "<b>if</b> l < A.length and A[l] > A[i]", indent: 1, label: "heapify-if-l" },
            { code: "max = l", indent: 2, label: "heapify-max-l" },
            { code: "<b>else</b>", indent: 1, label: "heapify-else-i" },
            { code: "max = i", indent: 2, label: "heapify-max-i" },
            { code: "<b>if</b> r < A.length and A[r] > A[max]", indent: 1, label: "heapify-if-r" },
            { code: "max = r", indent: 2, label: "heapify-max-r" },
            { code: "<b>if</b> max != i", indent: 1, label: "heapify-if-max" },
            { code: "swap A[i] and A[max]", indent: 2, label: "heapify-swap" },
            { code: "<b>Heapify</b>(A, max)", indent: 2, label: "heapify-heapify" },
        ];
    }
});
