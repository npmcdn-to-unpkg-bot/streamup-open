var fs = require('fs');
var path = require('path');

function mkdir(dir) {
        var os = require('os'),
        userInfo = require('user-info');
        os.homedir() +'/StreamUpBox';
        fs.exists(dir,function (params,status) {
        if(status !== true){
            fs.mkdir(dir,function(_,t){});
            fs.chmod(dir, '777',function(_,t){
                    
                });
                console.log("Folder created Successfully!");
            }else{
                fs.chmod(dir, '777',function(_,t){

                });
                console.log("Folder already exist!");
            };
        });
    // return 200;    
};

module.exports = {
    mkdir: mkdir
};
