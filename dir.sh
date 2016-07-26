  #!/bin/bash

  if [ ! -d /home/richard/StreamUpBox ]; then
     mkdir -m 777  -p /richard/home/StreamUpBox;
    echo "Folder created with success!";
  else
    echo "folder exist";  
  fi;

