import Theme from '../Clover-theme';
import NotFound from '../Clover-theme/';
import DefaultTheme from 'vitepress/dist/client/theme-default';
import { registerComponents } from './registerComponents.js'

export default {
  ...DefaultTheme,
  // ...Theme,
  NotFound: () => "custom 404", // this is a Vue3 function component
  enhanceApp({ app, router, siteData }) {
    registerComponents(app);
    // app is Vue3 app instance from `createApp()`. router is VitePress
    // custom router. `SiteData` is a `ref` of current site-level metadata.
  },
};