const navigateTo = (url) => {
    history.pushState(null, null, url);
    router();
};

const router = () => {
    let template;

    switch (window.location.pathname) {
        case "/":
            template = document.querySelector(`template#home-view`);
            break;
        case "/methods":
            template = document.querySelector(`template#methods-view`);
            break;
        case "/recursion":
            template = document.querySelector(`template#recursion-view`);
            break;
        case "/heapsort":
            template = document.querySelector(`template#heapsort-view`);
            break;
        case "/dijkstra":
            template = document.querySelector(`template#dijkstra-view`);
            break;
        case "/linkedlist":
            template = document.querySelector(`template#linked-list-view`);
            break;
        case "/quicksort":
            template = document.querySelector(`template#quicksort-view`);
            break;
        case "/astar":
            template = document.querySelector(`template#astar-view`);
            break;
        default:
            template = document.querySelector(`template#home-view`);
            break;
    }

    if (!template) return;
    const app = document.querySelector("#app");
    app.textContent = "";
    app.appendChild(template.content.cloneNode(true));
};

//use router when navigating through the history
window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e) => {
        // if the element clicked has a data-link attribute
        // prevent the default behavior of the click and use navigateTo function
        // use first element of composedPath() to get the target because it could be in shadow DOM
        if (e.composed && e.composedPath()[0].matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.composedPath()[0].href);
        }
    });

    router();
});
