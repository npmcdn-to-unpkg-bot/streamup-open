var should = require('should'),
    mocha = require('supertest'),
      _dir_ =require('../app_modules/_dir_');


describe('state',function() {
    it('should initiate app with some usefull credential',function(done){
        done();
    });
    it('should create app DIR on start of application',function(done){
        // throw "don't pass this test";
        if(_dir_.mkdir('obn') ===200){
            done();
        }else{
            throw 'we failed to create a folder with success';
        }
        
    });
});