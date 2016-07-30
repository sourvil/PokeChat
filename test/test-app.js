var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);
chai.use(require('chai-passport-strategy'));

var envs = require('envs');
const env = require('env2')('./config.env');

describe('Pokes', function() {
  it('should list ALL pokes on /chat GET', function (done) {
    chai.request(server)
        .get('/chat')
        .end(function(err,res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            done();
        });  
  });

    it('should get a poke on /chat GET', function (done) {
        var idChat = process.env.defaultChatId;
        chai.request(server)
            .get('/chat/' + idChat)
            .end(function(err,res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.message.should.equal(process.env.defaultChatMessage);
                done();
            });  
  });

    // TODO -- Mocha / Authenticate, Authroize and after Post a Message
    
    // before(function(done) {
    //   chai.passport.use(strategy)
    //     .success(function(u, i) {
    //       user = u;
    //       info = i;
    //       done();
    //     })
    //     .req(function(req) {
    //       req.headers.authorization = 'Bearer MOCHA_TEST';
    //     })
    //     .authenticate();
    // });

    // it('should add a SINGLE poke on /chat POST', function(done){
    //     var user = { username: 'MOCHA_TEST', password: '1' };
    //     chai.request(server)
    //         .post('/auth/login')
    //         .send({'username': user.username, 'password' : user.password})
    //         .end(function(err,res){
    //             if(err)
    //                 console.log('cannot login: ' + err + '.res:' + res);

    //             console.log(res.body);
    //             console.log(res.header);                
                
    //             res.should.have.status(200);
    //             res.body.state.should.equal('success');

    //             console.log('sending poke message to chat server...');

    //             done();              
    //         })
    //     chai.request(server)
    //         .post('/chat')
    //         .auth('Burak',1)
    //         .send({'body.message' : 'TEST MESSAGE', 'body.createdBy' : '579c94e5200d307c88323b7a', 'body.createdAt' : Date.now})
    //         .end(function(err, res){
    //             res.should.have.status(200);
    //             console.log('res.body:' + res.body);
    //             //res.body.state.should.equal('success');
    //             //res.body.should.be.a('object');
    //             done();
    //          });

    //      });
 });


describe('Users', function(){
    it('should signup a User on /auth POST', function(done){
        var user = {username: 'MOCHA_TEST_' + Date.now().toExponential(), password: '1' };
        chai.request(server)
            .post('/auth/signup')
            .send({'username' : user.username, 'password' : user.password })
            .end(function(err,res){
                if(err)
                    console.log('cannot signup: ' + err);
                
                res.should.have.status(200);
                res.body.state.should.equal('success');

                done();
            });
    }   
    );
    it('should login a User on /auth POST', function(done){
        var user = { username: 'MOCHA_TEST', password: '1' };
        chai.request(server)
            .post('/auth/login')
            .send({'username': user.username, 'password' : user.password})
            .end(function(err,res){
                if(err)
                    console.log('cannot login: ' + err + '.res:' + res);

                //console.log(res.body);
                
                res.should.have.status(200);
                res.body.state.should.equal('success');

                done();                
            })
    });
});