const importAll = (context: __WebpackModuleApi.RequireContext) =>
  context.keys().forEach(context);

// Import your components, mixins, and views
importAll(require.context("./static/code/components/", true, /\.(js|ts)$/));
importAll(require.context("./static/code/mixins/", true, /\.(js|ts)$/));
importAll(require.context("./static/code/views/", true, /\.(js|ts)$/));

import "./static/code/router.js";
