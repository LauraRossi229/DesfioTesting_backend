import mongoose from 'mongoose';
import { userModel } from "../src/models/users.models.js"
import Assert from 'assert';
import dotenv from 'dotenv';
import chai from 'chai';

dotenv.config();
const assert = Assert.strict; 
const expect = chai.expect;
let test_id = null;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Conectada"))
  .catch(() => console.log("Error en conexion a BDD"));

describe(' test user model CRUD en la ruta api/users', function () {
    // previo a comenzar el test
    before(() => {
        console.log('before the test')
    })

    // previo a arrancar cada test
    beforeEach(() => {
        console.log('before each test')
    })

    //obtene todos los suarios mediante get
    it('obtener todsos los usuarios', async () => {
        const users = await userModel.find();
        // assert.strictEqual(Array.isArray(users), true);
        // expect(Array.isArray(users)).to.be.true;
        expect(users).not.to.be.deep.equal([])
    })

    it('obtener un usuario por id', async () => {
        const user = await userModel.findById('65466d08ad839eb00ac22df1');
        expect(user).to.have.property('_id')
    })

    it('crear un usuario mediante post ', async () => {
        const user = await userModel.create({
            first_name: 'Juan',
            last_name: 'Pastor',
            age: 30,
            email: 'juan@juan.com',
            password: 'juan123'
        })
        test_id = user._id;
        expect(user).to.have.property('_id')
    })

    //65466d08ad839eb00ac22df1
    it('actualizar un usuario mediante put ', async () => {
        const user = await userModel.findByIdAndUpdate(test_id, {
            first_name: 'Juan',
            last_name: 'Jose',
            age: 30
        }, { new: true });
        assert.strictEqual(user.first_name, 'Juan');
        expect(user).to.have.property('first_name').to.be.equal('Juan');
    })

    // 654044b3c55d612ed87bd49c
    it('borrar un usuario mediante delete ', async () => {
        const user = await userModel.findByIdAndDelete(test_id);
        expect(user).to.be.ok;
    })

})