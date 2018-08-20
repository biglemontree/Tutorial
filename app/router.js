'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index);
  router.get('/access/token', controller.home.login);
  router.post('/unionId', controller.home.postUnionId);
};
