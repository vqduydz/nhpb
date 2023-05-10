import express from 'express';
import { catalogController, menuController, userController, cartItemController } from '../controllers';
import { verifyToken, checkRole } from '../middlewares/middleware';

const router = express.Router();

const app = express();
const port = 3000;

export const initWebRoutes = (app) => {
  router.get('/', (req, res) => {
    return res.send('test');
  });
  // gettoken
  router.post('/gettoken', userController.getToken);
  // log in
  router.get('/login', verifyToken, userController.handleLogin);
  // forgot password
  router.post('/forgot-password', userController.forgotPassword);
  // reset password
  router.patch('/reset-password/:token', userController.resetPassword);
  // sign up - create user
  router.post('/user', userController.createUser);

  // get user
  router.get('/user', verifyToken, checkRole(['Root', 'Admin', 'UserManage', 'Customer']), userController.getUser);
  // update user data
  router.patch(
    '/user',
    verifyToken,
    checkRole(['Customer', 'Root', 'Admin', 'UserManage']),
    userController.updateUserById,
  );
  // delete user
  router.delete(
    '/user',
    verifyToken,
    checkRole(['Customer', 'Root', 'Admin', 'UserManage']),
    userController.deleteUserById,
  );

  // get menu
  router.get('/menu/:slug?', menuController.getMenu);

  // get catalog
  router.get('/catalog/:slug?', catalogController.getCatalog);

  /// cart item
  // get
  router.get('/cartitem/:user_id', cartItemController.getCartItemByCartId);
  // update
  router.patch('/cartitem', cartItemController.updateCartItemById);
  // delete
  router.delete('/cartitem', cartItemController.deleteCartItemById);
  // add
  router.post('/cartitem', cartItemController.addCartItem);

  return app.use('/v1/api', router);
};
