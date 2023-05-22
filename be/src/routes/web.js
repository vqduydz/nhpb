import express from 'express';
import { catalogController, menuController, userController, cartItemController, orderController } from '../controllers';
import { verifyToken, checkRole } from '../middlewares/middleware';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';

const sql = require('mssql');

const router = express.Router();

const app = express();
const port = 3000;

// Cấu hình , Khai báo middleware upload
const upload = multer({ storage: multer.memoryStorage() });

export const initWebRoutes = (app) => {
  //
  router.get('/', (req, res) => {
    return res.send(`Contact : Duy Vũ - vqduydz@gmail.com`);
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
  // create menu
  router.post('/menu', verifyToken, checkRole(['Root', 'Admin', 'UserManage']), menuController.createMenu);
  // update menu data
  router.patch('/menu', verifyToken, checkRole(['Root', 'Admin', 'UserManage']), menuController.updateMenuById);
  // delete menu
  router.delete('/menu', verifyToken, checkRole(['Root', 'Admin', 'UserManage']), menuController.deleteMenuById);
  // import menu
  router.post(
    '/menu/import',
    verifyToken,
    checkRole(['Root', 'Admin', 'UserManage']),
    upload.single('file'),
    menuController.importMenus,
  );

  // get catalog
  router.get('/catalog/:slug?', catalogController.getCatalog);
  // create catalog
  router.post('/catalog', verifyToken, checkRole(['Root', 'Admin', 'UserManage']), catalogController.createCatalog);
  // update catalog data
  router.patch(
    '/catalog',
    verifyToken,
    checkRole(['Root', 'Admin', 'UserManage']),
    catalogController.updateCatalogById,
  );
  // delete catalog
  router.delete(
    '/catalog',
    verifyToken,
    checkRole(['Root', 'Admin', 'UserManage']),
    catalogController.deleteCatalogById,
  );
  // import catalog
  router.post(
    '/catalog/import',
    verifyToken,
    checkRole(['Root', 'Admin', 'UserManage']),
    upload.single('file'),
    catalogController.importCatalogs,
  );

  /// cart item
  // get
  router.get('/cartitem/:user_id', cartItemController.getCartItemByCartId);
  // update
  router.patch('/cartitem', cartItemController.updateCartItemById);
  // delete
  router.delete('/cartitem', cartItemController.deleteCartItemById);
  // add
  router.post('/cartitem', cartItemController.addCartItem);

  /// order
  // get
  router.get('/order/:user_id', orderController.getOrders);
  // // update
  // router.patch('/order', orderController.updateOrderById);
  // // delete
  // router.delete('/order', orderController.deleteOrderById);
  // add
  router.post('/order', verifyToken, checkRole(['Customer']), orderController.createNewOrder);

  // upload image
  router.post('/upload', upload.single('image'), (req, res, next) => {
    const inputFile = req.file.buffer;
    // Đường dẫn lưu poster
    const posterOutputFile = 'uploads/' + req.file.originalname + '-poster' + '.png';
    // Đường dẫn lưu poster
    const outputFile = 'uploads/' + req.file.originalname + '.png';
    // Đường dẫn lưu thumb
    const thumbOutputFile = 'uploads/' + req.file.originalname + '-thumb' + '.png';

    // Thực hiện xử lý và lưu poster
    sharp(inputFile)
      .resize(800, 600)
      .toFile(posterOutputFile, (err, info) => {
        if (err) {
          console.error(err);
          res.status(500).send('Có lỗi xảy ra trong quá trình xử lý hình ảnh');
        } else {
          // Thực hiện xử lý và lưu thumb
          sharp(inputFile)
            .resize(200, 150)
            .toFile(thumbOutputFile, (err, info) => {
              if (err) {
                console.error(err);
                res.status(500).send('Có lỗi xảy ra trong quá trình xử lý hình ảnh');
              } else {
                // Thực hiện xử lý và lưu image
                sharp(inputFile)
                  .resize(500, 300)
                  .toFile(outputFile, (err, info) => {
                    if (err) {
                      console.error(err);
                      res.status(500).send('Có lỗi xảy ra trong quá trình xử lý hình ảnh');
                    } else {
                      res.status(200).json({
                        image_url: req.file.originalname + '.png',
                        thumb_url: req.file.originalname + '-thumb' + '.png',
                        poster_url: req.file.originalname + '-poster' + '.png',
                      });
                    }
                  });
              }
            });
        }
      });
  });

  // get image
  // Khai báo đường dẫn tới thư mục chứa hình ảnh
  const imagePath = path.join(__dirname, '../../uploads');

  // API endpoint để truy cập hình ảnh
  router.get('/images/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(imagePath, filename);
    res.sendFile(filePath);
  });

  // Khởi chạy server
  app.listen(3001, () => {
    console.log('Server is running on port 3000');
  });

  return app.use('/v1/api', router);
};
