export default [
  {
    route: ['', 'welcome'],
    name: 'welcome',
    moduleId: 'viewmodels/welcome',
    nav: true,
    title: 'Welcome'
  },
  {route: 'signup', name: 'signup', moduleId: 'viewmodels/auth/signup', nav: false, title: 'Signup'},
  {route: 'login', name: 'login', moduleId: 'viewmodels/auth/login', nav: false, title: 'Login'},
  {route: 'logout', name: 'logout', moduleId: 'viewmodels/auth/logout', nav: false, title: 'Logout', auth: true},
  {route: 'profile', name: 'profile', moduleId: 'viewmodels/auth/profile', nav: false, title: 'Profile', auth: true},
  {route: 'get', name: 'get', moduleId: 'viewmodels/auth/get', nav: true, title: 'Get'},
  {route: 'list', name: 'list', moduleId: 'viewmodels/admin/list', nav: true, title: 'list'},
  {route: 'detail', name: 'detail', moduleId: 'viewmodels/admin/detail', nav: true, title: 'detail'},
  {route: 'syncfusion', name: 'syncfusion', moduleId: 'viewmodels/syncfusion', nav: true, title: 'syncfusion'},
  {route: 'gridremote', name: 'gridremote', moduleId: 'viewmodels/gridremote', nav: true, title: 'gridremote'},
  {route: 'gridremote2', name: 'gridremote2', moduleId: 'viewmodels/gridremote2', nav: true, title: 'gridremote2'}
];
