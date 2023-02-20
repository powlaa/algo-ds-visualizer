const navigateTo = (url) => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        { path: "/", template: "home-view" },
        { path: "/heapsort", template: "heapsort-view" },
        { path: "/dijkstra", template: "dijkstra-view" },
        { path: "/linkedlist", template: "linked-list-view" },
    ];

    // Test each route for potential match
    const potentialMatches = routes.map((route) => {
        return {
            route: route,
            isMatch: location.pathname === route.path,
        };
    });

    let match = potentialMatches.find((potentialMatch) => potentialMatch.isMatch);

    // define what happens when no route is matched
    // default to starting route
    if (!match) match = { route: routes[0], isMatch: true };

    const template = document.querySelector(`template#${match.route.template}`);
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
