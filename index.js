const Odoo = require('odoo-await');
const PRODUCTOSJSON = require('../productos.json');
const prompt = require('prompt-sync')();
const bur = require('./nosubir.js').bur;
const bpo = require('./nosubir.js').bpo;
const bdb = require('./nosubir.js').bdb;
const bus = require('./nosubir.js').bus;
const bpa = require('./nosubir.js').bpa;
const axios = require('axios');
const base64 = require('base-64');

const odoo = new Odoo({
  baseUrl: bur,
  port: bpo,
  db: bdb,
  username: bus,
  password: bpa,
});

console.log('\t cantidad de productos en EL JSON =>  ', PRODUCTOSJSON.length);

async function main() {
  let salir = false;

  do {
    switch (mostrarMenu()) {
      case 1:
        //! -------------------------- conectar --------------------------
        await odoo.connect();
        console.log('Connected to Odoo server.');
        console.log('AÑADIENDO TODOS LOS PRODUCTOS!!');

        //! -------------------------- añadir todos los productos --------------------------

        for (let i = 0; i < PRODUCTOSJSON.length; i++) {
          // cambiar las url de las imagenes por base64
          let imagenes = [];

          for (let j = 0; j < PRODUCTOSJSON[i].imagenes.length; j++) {
            const response = await axios.get(PRODUCTOSJSON[i].imagenes[j], {
              responseType: 'arraybuffer',
            });
            const base64String = Buffer.from(response.data, 'binary').toString(
              'base64'
            );
            imagenes.push(base64String);
          }

          // subimos cada imagen a la base de datos y guardamos en el array los id de las imagenes
          // para pasarlos al producto que vamos a crear
          let productImage = [];
          for (let k = 0; k < imagenes.length; k++) {
            const newImage = {
              name: PRODUCTOSJSON[i].SKU + ' ' + k,
              image_1920: imagenes[k],
            };
            const image = await odoo.create('product.image', newImage);
            productImage.push(image);
          }

          // CREAMOS EL PRODUCTO
          const newProduct = {
            // el id del producto es el mismo que el id de la tabla de imagenes
            id: PRODUCTOSJSON[i].id,
            name: PRODUCTOSJSON[i].SKU,
            list_price: PRODUCTOSJSON[i].precio
              ? PRODUCTOSJSON[i].precio.replace(',', '.')
              : 0,
            standard_price: PRODUCTOSJSON[i].precio
              ? PRODUCTOSJSON[i].precio.replace(',', '.')
              : 0,
            // weight es el peso del producto sin "kg"
            weight: PRODUCTOSJSON[i].Peso
              ? PRODUCTOSJSON[i].Peso.replace('Kg', '').replace(',', '.')
              : 0,
            volume: PRODUCTOSJSON[i].Volume
              ? PRODUCTOSJSON[i].Volume.replace('m³', '').replace(',', '.')
              : 0,
            description_purchase: PRODUCTOSJSON[i].descripcion,
            image_1920: imagenes[0],
            //a prouct_template_image_ids le pasamos el 6 que es el id de la tabla de imagenes
            // false porque no queremos que se borren las imagenes que ya tiene el producto
            // y el array de los id de las imagenes que hemos subido
            product_template_image_ids: [[6, false, productImage]],
          };

          console.log(newProduct);

          // añadir el producto en la base de datos
          const product = await odoo.create('product.template', newProduct);
          console.log(`Product created with ID ${product}`);
        }

        break;
      case 2:
        //! -------------------------- eliminar todos los productos --------------------------
        await odoo.connect();
        console.log('Connected to Odoo server.');
        console.log('ELIMINANDO TODOS LOS PRODUCTOS!!');

        // 1º mirar cuantos productos hay en la base de datos
        TOTAL_PRODUCTOS = await odoo.searchRead('product.template', {});

        console.log('en la bbdd hay ' + TOTAL_PRODUCTOS.length + ' productos');

        // 2º  eliminar todos los productos
        for (let i = 0; i < TOTAL_PRODUCTOS.length; i++) {
          const product = await odoo.delete(
            'product.template',
            TOTAL_PRODUCTOS[i].id
          );
          console.log(`Product deleted ${product}`);
        }

        break;

      case 3:
        //! -------------------------- mostrar todos los productos con su id --------------------------
        await odoo.connect();

        console.log('Connected to Odoo server.');
        console.log(' \n \t MOSTRANDO TODOS LOS PRODUCTOS CON SU ID!!');

        TOTAL_PRODUCTOS = await odoo.searchRead('product.template', {});

        for (let i = 0; i < TOTAL_PRODUCTOS.length; i++) {
          console.log(`\n \t id => \n \t ${TOTAL_PRODUCTOS[i].id}`);
          console.log(TOTAL_PRODUCTOS[i]);
        }

        console.log('en la bbdd hay ' + TOTAL_PRODUCTOS.length + ' productos');
        break;
      case 4:
        //! -------------------------- mostrar todas las fotos del directorio de odoo --------------------------
        // conectar odoo y mostrar la base de datos
        await odoo.connect();
        console.log('Connected to Odoo server.');

        TOTAL_PRODUCTOS = await odoo.searchRead('product.template', {});

        break;

      case 5:
        break;
      case 0:
        salir = true;
        console.log('Saliento del programa');
      default:
        break;
    }
  } while (!salir);

  try {
    //! -------------------------- conectar --------------------------
    await odoo.connect();
    console.log('Connected to Odoo server.');

    //! -------------------------- añaadir un partner --------------------------

    // const partnerId = await odoo.create('res.partner', {
    //   name: 'Kool Keith',
    //   email: 'lostinspace@example.com',
    // });
    // console.log(`Partner created with ID ${partnerId}`);

    //! -------------------------- añadir el primer producto --------------------------

    // const product = await odoo.create('product.template', {
    //   name: PRODUCTOSJSON[0].name,
    // });
    // console.log(`Product created with ID ${product}`);

    //! -------------------------- añadir todos los productos --------------------------

    // for (let i = 0; i < PRODUCTOSJSON.length; i++) {
    //   const product = await odoo.create('product.template', {
    //     name: PRODUCTOSJSON[i].name,
    //   });
    //   console.log(`Product created with ID ${product}`);
    // }

    //! -------------------------- mostrar todos los productos --------------------------
    // for (let i = 0; i < 1; i++) {
    //   const product = await odoo.searchRead('product.template', {
    //     name: PRODUCTOSJSON[i].name,
    //   });
    //   console.log(product);
    // }

    //! -------------------------- eliminar el primer producto --------------------------

    // const product = await odoo.searchRead('product.template', {
    //   name: PRODUCTOSJSON[0].name,
    // });
    // console.log(product);

    // const productDeleted = await odoo.delete('product.template', product[0].id);
    // console.log(`Product deleted with ID ${productDeleted}`);

    //! -------------------------- eliminar todos los productos --------------------------

    // for (let i = 0; i < PRODUCTOSJSON.length; i++) {
    //   const product = await odoo.searchRead('product.template', {
    //     name: PRODUCTOSJSON[i].name,
    //   });
    //   console.log(product);

    //   const productDeleted = await odoo.delete(
    //     'product.template',
    //     product[0].id
    //   );
    //   console.log(`Product deleted with ID ${productDeleted}`);
    // }
  } catch (err) {
    console.log(err);
  }
}

main();

// ! -------------------------- FUNCIONES --------------------------
// funcion para mostrar el menu y retorna la opcion elegida por el usuario desde la consola
function mostrarMenu() {
  console.log(' | -------------------------- MENU -------------------------|');
  console.log(' | 1. AÑADIR TODOS LOS PRODUCTOS!                           |');
  console.log(' | 2. ELIMINAR TODOS LOS PRODUCTOS! CUIDADO!                |');
  console.log(' | 3. MOSTRAR TODOS LOS PRODUCTOS!!                         |');
  console.log(' | 0. Salir                                                 |');
  console.log(' | ---------------------------------------------------------|');
  console.log();
  return parseInt(prompt());
}
