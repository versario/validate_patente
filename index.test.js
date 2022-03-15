const request = require('supertest');
const app = require('./index');

describe('Validate patente dv API', () => {  
  it('POST /validatePatente ---> OK: Validate patente formato LLLL.NN (JBFW70-1)', () => {
    return request(app)
    .post('/validatePatente')
    .send({
      patente: 'JBFW70',
      dv: '1'
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => {
      expect(response.body).toEqual(
        expect.objectContaining({
          status: "Ok",
          description: "Patente válida"
        })
      )
    })
  })
  it('POST /validatePatente ---> BAD: Validate patente formato LLLL.NN (JBFW70-5)', () => {
    return request(app)
    .post('/validatePatente')
    .send({
      patente: 'JBFW70',
      dv: '5'
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => {
      expect(response.body).toEqual(
        expect.objectContaining({
          status: "Bad",
          description: "Patente inválida"
        })
      )
    })
  })
  it('POST /validatePatente ---> OK: Validate patente formato LLL.NNN (GDF064-0)', () => {
    return request(app)
    .post('/validatePatente')
    .send({
      patente: 'GDF064',
      dv: '0'
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => {
      expect(response.body).toEqual(
        expect.objectContaining({
          status: "Ok",
          description: "Patente válida"
        })
      )
    })
  })
  it('POST /validatePatente ---> BAD: Validate patente formato LLL.NNN (GDF064-8)', () => {
    return request(app)
    .post('/validatePatente')
    .send({
      patente: 'GDF064',
      dv: '8'
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => {
      expect(response.body).toEqual(
        expect.objectContaining({
          status: "Bad",
          description: "Patente inválida"
        })
      )
    })
  })
  it('POST /validatePatente ---> OK: Validate patente formato LL.NNNN (UX0683-0)', () => {
    return request(app)
    .post('/validatePatente')
    .send({
      patente: 'UX0683',
      dv: '0'
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => {
      expect(response.body).toEqual(
        expect.objectContaining({
          status: "Ok",
          description: "Patente válida"
        })
      )
    })
  })
  it('POST /validatePatente ---> BAD: Validate patente formato LL.NNNN (UX0683-K)', () => {
    return request(app)
    .post('/validatePatente')
    .send({
      patente: 'UX0683',
      dv: 'K'
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => {
      expect(response.body).toEqual(
        expect.objectContaining({
          status: "Bad",
          description: "Patente inválida"
        })
      )
    })
  })
  it('POST /validatePatente ---> BAD: Formato inválido LLLLLN (BCCYX3-6)', () => {
    return request(app)
    .post('/validatePatente')
    .send({
      patente: 'BCCYX3',
      dv: '6'
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => {
      expect(response.body).toEqual(
        expect.objectContaining({
          status: "Bad",
          description: "Formato de patente inválido"
        })
      )
    })
  })
});