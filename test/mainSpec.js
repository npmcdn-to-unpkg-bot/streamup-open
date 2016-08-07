var should = require('should'),
    mocha = require('supertest'),
      dir =require('../app_modules/dir');


describe('StreamUpBoxDeskTop Testing Suite',function() {
    it('should initiate app with some usefull credential',function(done){

        done();
    });
    it('should create app DIR on start of application',function(done){
        // throw "don't pass this test";
        if(dir.mkdir('MeAndYou')){
            
            done();
        }else{
            throw 'we failed to create a folder with success';
        }
        
    });
});