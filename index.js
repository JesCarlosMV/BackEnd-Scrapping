const Odoo = require('odoo-await');
const PRODUCTOSJSON = require('../productos.json');
const prompt = require('prompt-sync')();
const bur = require('./nosubir.js').bur;
const bpo = require('./nosubir.js').bpo;
const bdb = require('./nosubir.js').bdb;
const bus = require('./nosubir.js').bus;
const bpa = require('./nosubir.js').bpa;

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
          const product = await odoo.create('product.template', {
            name: `SKU ${PRODUCTOSJSON[i].SKU}`,
            list_price: PRODUCTOSJSON[i].precio.replace(',', '.'),
            weight: PRODUCTOSJSON[i].Peso.match(/\d+/g)[0],
            description_purchase: PRODUCTOSJSON[i].descripcion,
            description_picking: PRODUCTOSJSON[i].descripcion,
            description: PRODUCTOSJSON[i].descripcion,
            type: 'product',
          });

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
        //! -------------------------- mostrar todos los productos --------------------------
        await odoo.connect();
        console.log('Connected to Odoo server.');
        console.log('Mostrando TODOS los productos');

        TOTAL_PRODUCTOS = await odoo.searchRead('product.template', {});

        for (let i = 0; i < TOTAL_PRODUCTOS.length; i++) {
          console.log(TOTAL_PRODUCTOS[i]);
        }

        break;
      case 4:
      //! -------------------------- VACIO --------------------------

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
