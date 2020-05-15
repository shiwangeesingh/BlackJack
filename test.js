let mongoose = require("mongoose");
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./index');
let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);
const ObjectId = mongoose.Types.ObjectId;
describe('/POST Username Exists', () => {
    it('it should return if Username Exists', (done) => {
        let data = {
            userName: "shiwangee",
        }
        chai.request(server)
            .post('/history')
            .send(data)
            .end((err, res) => {
                res.should.have.status(200);
               // res.body.message.should.be.eql("User does not exist");
                done();
            });
    });
});

describe('/POST game Exists', () => {
    it('it should return if game Exists on hit', (done) => {
        let data = {
           gameId:"5ebecb821e037a09388f8889"   //passGameId here
        }
        chai.request(server)
            .post('/hit')
            .send(data)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});

describe('/POST game Exists', () => {
    it('it should return if game Exists on stand', (done) => {
        let data = {
            gameId:"5ebecb821e037a09388f8889"   //passGameId here
        }
        chai.request(server)
            .post('/stand')
            .send(data)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});

describe('/GET game started susseccfully', () => {
    it('it should return if game started susseccfully', (done) => {
        chai.request(server)
            .get('/startGame')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});