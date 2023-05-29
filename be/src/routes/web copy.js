import express from 'express';
import { catalogController, menuController, userController, cartItemController } from '../controllers';
import { verifyToken, checkRole } from '../middlewares/middleware';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';

const router = express.Router();

const app = express();
const port = 3000;

///
export const initWebRoutes = (app) => {
  // Cấu hình Multer
  // Khai báo nơi lưu trữ file
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // thư mục lưu trữ file
    },
    filename: (req, file, cb) => {
      // đổi tên file thành tên món ăn
      const name = file.originalname;
      cb(null, name + '.png');
    },
  });

  // Khai báo middleware upload
  const upload = multer({ storage: storage });

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

  // get catalog
  router.get('/catalog/:slug?', catalogController.getCatalog);

  /// cart item
  // get
  router.get('/cartitem/:customer_id', cartItemController.getCartItemByCartId);
  // update
  router.patch('/cartitem', cartItemController.updateCartItemById);
  // delete
  router.delete('/cartitem', cartItemController.deleteCartItemById);
  // add
  router.post('/cartitem', cartItemController.addCartItem);

  // // upload image
  // router.post('/upload', upload.single('image'), (req, res, next) => {
  //   // trả về đường dẫn của file đã lưu trên server
  //   console.log('80---', req.file);
  //   // const imageUrl = `/uploads/${req.file.filename}`;
  //   const imageUrl = req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename;
  //   return res.status(200).json({ imageUrl });
  // });

  // upload image
  router.post('/upload', upload.single('image'), (req, res, next) => {
    // trả về đường dẫn của file đã lưu trên server
    const inputFile = req.file.path;
    // Đường dẫn lưu image
    const outputFile = 'uploads/image-' + req.file.filename;
    // Đường dẫn lưu thumb
    const thumbOutputFile = 'uploads/thumb-' + req.file.filename;
    // Đường dẫn lưu thumb
    const posterOutputFile = 'uploads/poster-' + req.file.filename;

    // Kích thước image
    const width = 500;
    const height = 300;

    // Kích thước thumb
    const thumbWidth = 200;
    const thumbHeight = 150;

    // Kích thước poster
    const posterWidth = 800;
    const posterHeight = 650;

    // Thực hiện xử lý và lưu image
    sharp(inputFile)
      .resize(width, height)
      .toFile(outputFile, (err, info) => {
        if (err) {
          console.error(err);
          res.status(500).send('Có lỗi xảy ra trong quá trình xử lý hình ảnh');
        } else {
          // Thực hiện xử lý và lưu thumb
          sharp(inputFile)
            .resize(thumbWidth, thumbHeight)
            .toFile(thumbOutputFile, (err, info) => {
              if (err) {
                console.error(err);
                res.status(500).send('Có lỗi xảy ra trong quá trình xử lý hình ảnh');
              } else {
                // Thực hiện xử lý và lưu thumb
                sharp(inputFile)
                  .resize(posterWidth, posterHeight)
                  .toFile(posterOutputFile, (err, info) => {
                    if (err) {
                      console.error(err);
                      res.status(500).send('Có lỗi xảy ra trong quá trình xử lý hình ảnh');
                    } else {
                      res.status(200).json({
                        image: 'image-' + req.file.filename,
                        thumb: 'thumb-' + req.file.filename,
                        poster: 'poster-' + req.file.filename,
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
