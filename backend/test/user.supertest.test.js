import chai from 'chai';
import supertest from 'supertest';


const expect = chai.expect;
const api = supertest('http://localhost:8080/api'); 

let token; // Almacena el token para usarlo en otras solicitudes

describe('Test del modelo de usuario CRUD en la ruta api/sessions/register', function () {        
    describe('Ruta api/sessions/register método post', function () {
        let testUserId = null;

        it('Crear un usuario mediante post', async function() {
            this.timeout(5000);

            const newUser = {
                first_name: 'Juan',
                last_name: 'Perez',
                age: 30,
                email: 'mailprueba@prueba',
                password: '1234'
            };

            const response = await api.post('/sessions/register').send(newUser); // Cambiado a '/sessions/register'
            expect(response.statusCode).to.be.equal(200);
        });

        it('Solicitar datos de usuarios mediante GET en /api/users', async function() {
            this.timeout(5000);

            const response = await api.get('/users'); // Cambiado a '/users'
            testUserId = response.body[0]._id;
            expect(response.statusCode).to.be.equal(200);
        });

        it('Actualizar usuario mediante PUT en /api/users/:id', async function() {
            this.timeout(5000);

            const updatedUser = {
                first_name: 'NuevoNombre',
                last_name: 'NuevoApellido',
                age: 25
            };

            const response = await api.put(`/users/${testUserId}`) // Cambiado a '/users'
                .send(updatedUser)
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).to.be.equal(200);
        });

        it('Iniciar sesión con post a través de /api/sessions/login', async function() {
            this.timeout(5000);

            const loginUser = {
                email: 'mailprueba@prueba',
                password: '1234'
            };

            const response = await api.post('/sessions/login').send(loginUser);
            token = response.body.token;
            expect(response.statusCode).to.be.equal(200);
            expect(token).to.be.ok;
        });

        it('Consultar datos de usuario a través de GET en sessions/current', async function() {
            this.timeout(5000);
        
            const response = await api.get('/sessions/current')
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(200);
        
             // Verificar que la respuesta es la esperada
                expect(response.body).to.have.property('token'); // Reemplaza 'tu_propiedad_esperada' con la propiedad que esperas en la respuesta

            expect(response.body).to.be.ok;
            expect(response.body.email).to.be.equal('mailprueba@prueba');

        });
        

        it('Eliminar usuario mediante DELETE en /api/users/:id', async function() {
            this.timeout(5000);

            const response = await api.delete(`/users/${testUserId}`) // Cambiado a '/users'
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).to.be.equal(200);
        });
    });
});
