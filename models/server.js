const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');


class Server {

   constructor() {
      this.app = express();
      this.port = process.env.PORT;
      this.paths = {
         auth:       '/api/auth',
         categories: '/api/categories',
         products:   '/api/products',
         search:       '/api/search',
         uploads:       '/api/uploads',
         users:      '/api/users',
      }
      //Database Connection
      this.database();

      //Middelwares
      this.middlewares();

      //request from body
      this.app.use( express.json() );

      //Routes
      this.routes();
   }

   async database() {
      await dbConnection();
   }

   middlewares() {

      //cors
      this.app.use( cors() );

      //read and parse body
      this.app.use( express.json() );

      //Public Directory
      this.app.use( express.static('public') );

      //fileUpload
      this.app.use(fileUpload({
         useTempFiles : true,
         tempFileDir : '/tmp/',
         createParentPath: true
     }));
   }

   routes() {
      this.app.use(this.paths.auth, require('../routes/auth'));
      this.app.use(this.paths.categories, require('../routes/categories'));
      this.app.use(this.paths.products, require('../routes/products'));
      this.app.use(this.paths.search, require('../routes/search'));
      this.app.use(this.paths.uploads, require('../routes/uploads'));
      this.app.use(this.paths.users, require('../routes/users'));
   }

   listen() {
       
      this.app.listen( this.port, () => {
         console.log('Servidor corriendo en el puerto:', this.port)
      })
   }

}

module.exports = Server;