    var folderWatcher = function(object) {
       
        require('chokidar').watch(os.homedir()+'/StreamUpBox', {ignored: /[\/\\]\./}).on('all', function(event, path) {
            if(event === "unlink"){
                notification.send('removed files');
            }else if(event === "add"){
                
                 notification.send('add new file');
            }else if(event ==="change"){
                 notification.send('changes');

            }
            console.log(event, path);
        });
    };