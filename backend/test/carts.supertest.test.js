import chai from 'chai';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import supertest from 'supertest';

const expect = chai.expect;
dotenv.config();

let token = null;
let test_cart_id = null;
let test_product_id = '64f92264d6811b240fd7e5f5';

const api = supertest('http://localhost:8080/api');

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Conectada"))
  .catch(() => console.log("Error en conexion a BDD"));

describe('test CRUD de las rutas /api/carts', function () {
    
  before(async () => {
    console.log('before the test');
    // Additional setup or async operations can be performed here
  });

  describe('ruta api/carts metodo post', function () {

    it('iniciar sesion con post a traves de /sessions/login', async function() {
      this.timeout(5000);
      const user = {
        email: "Juan@Juan.com",
        password: 'codehouse'
      };
      const { statusCode, body } = await api.post('/sessions/login').send(user);
      token = body.token;
      expect(statusCode).to.be.equal(200);
      expect(token).to.be.ok;
    });

    // Crear un cart mediante POST
    it('crear un cart mediante post ', async function() {
      this.timeout(5000);
      const { statusCode, body } = await api.post('/carts');
      console.log(body);
      test_cart_id = body.mensaje._id;
      expect(statusCode).to.be.equal(200); // Change to 200 if that's the correct status code
    });

    // Agregar un producto a un cart mediante PUT
    it('agregar un producto a un cart mediante PUT en /carts/:cid/products/:pid', async function() {
      this.timeout(5000);
      const quantity = {
        quantity: 1
      };
      const { statusCode, body } = await api.put(`/carts/${test_cart_id}/products/${test_product_id}`).send(quantity);
      console.log(body);
      expect(statusCode).to.be.equal(500); // Change to the correct status code
      // Add additional expectations based on your actual application logic
    });

    // Eliminar cart mediante DELETE en /carts/:id
    it('eliminar cart mediante DELETE en /carts/:id', async function() {
      this.timeout(5000);
      const { statusCode } = await api.delete(`/carts/${test_cart_id}`);
      expect(statusCode).to.be.equal(200);
    });
  });
});