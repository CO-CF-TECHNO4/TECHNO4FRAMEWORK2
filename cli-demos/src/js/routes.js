
import HomePage from '../pages/home.t4';
import AboutPage from '../pages/about.t4';
import FormPage from '../pages/form.t4';
import CatalogPage from '../pages/catalog.t4';
import ProductPage from '../pages/product.t4';
import SettingsPage from '../pages/settings.t4';

import DynamicRoutePage from '../pages/dynamic-route.t4';
import RequestAndLoad from '../pages/request-and-load.t4';
import NotFoundPage from '../pages/404.t4';

var routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/about/',
    component: AboutPage,
  },
  {
    path: '/form/',
    component: FormPage,
  },
  {
    path: '/catalog/',
    component: CatalogPage,
  },
  {
    path: '/product/:id/',
    component: ProductPage,
  },
  {
    path: '/settings/',
    component: SettingsPage,
  },

  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    component: DynamicRoutePage,
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function ({ router, to, resolve }) {
      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = to.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Techno4! Hope you like it!',
          links: [
            {
              title: 'Techno4 Website',
              url: 'http://techno4.io',
            },
            {
              title: 'Techno4 Forum',
              url: 'http://forum.techno4.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            component: RequestAndLoad,
          },
          {
            props: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;