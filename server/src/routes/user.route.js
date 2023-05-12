/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
const router = require('express').Router();
const kc = require('../config/keycloak-config.js').getKeycloak();
const userController = require('../controllers/user.controller');
var verify = require('../middleware');

// from backend
router.post(
  '/isAuthenticated',
  kc.enforcer(['isAuthenticatedUser']),
  // verify.verifyToken,
  userController.isAuthenticated
);
router.post(
  '/getUserByEmailId',
  kc.enforcer(['getUserByEmailIdUser']),
  verify.authorization,
  userController.getUserByEmailId
); 
router.post('/login', userController.login);
router.post('/reset', userController.reset);
// router.post(
//   '/link',
//   kc.enforcer(['linkUser']),
//   // verify.verifyToken,
//   userController.linkAccount
// ); 
router.post(
  '/logout',
  // kc.enforcer(['logoutUser']),
  // verify.verifyToken,
  userController.logout
);
router.post('/signup', userController.create);
router.get(
  '/search',
  kc.enforcer(['searchUser']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  userController.search
);
router.get(
  '/get/activity',
  kc.enforcer(['getUserActivity']),
  // verify.verifyToken,
  verify.validateRoleWithToken,
  userController.getActivity
);
router.get('/getRefToken',verify.validateRoleWithToken,userController.getRefToken);
router.post('/getExchangeToken',userController.getExchangeToken);

module.exports = router;
