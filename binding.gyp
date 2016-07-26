{
  "targets": [
    {
      "target_name": "ftp",
      "sources": [ "./C++/ftp.cc" ],
    "include_dirs" : [
            "<!(node -e \"require('nan')\")"
        ]
      
    },
    {
      "target_name": "add",
      "sources": [ "./C++/add.cc" ],
            "include_dirs" : [
            "<!(node -e \"require('nan')\")"
        ]
    },
    
  ]
}