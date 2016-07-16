sync.service('urlShortener',[function(){
  this.makeShort = function(longUrl){
    return longUrl;
  };
  // this.makeShort = function(longUrl)
  // {
  //   //  var longUrl=document.getElementById("longurl").value;
  //     var request = gapi.client.urlshortener.url.insert({
  //     'resource': {
  //       'longUrl': longUrl
  // 	}
  //     });
  //     request.execute(function(response)
  // 	{
  //
  // 		if(response.id != null)
  // 		{
  // 			str ="<b>Long URL:</b>"+longUrl+"<br>";
  // 			str +="<b>your File is:</b> <a href='"+response.id+"'>"+response.id+"</a><br>";
  // 			return str;
  // 		}
  // 		else
  // 		{
  // 			console.log("error: unable to create short url");
  // 		}
  //
  //     });
  //  }
  //
  // this.getShortInfo = function()
  //  {
  //      var shortUrl=document.getElementById("shorturl").value;
  //
  //      var request = gapi.client.urlshortener.url.get({
  //        'shortUrl': shortUrl,
  //  	     'projection':'FULL'
  //      });
  //      request.execute(function(response)
  //  	{
  //  		if(response.longUrl!= null)
  //  		{
  //  			str ="<b>Long URL:</b>"+response.longUrl+"<br>";
  //  			str +="<b>Create On:</b>"+response.created+"<br>";
  //  			document.getElementById("output").innerHTML = str;
  //  		}
  //  		else
  //  		{
  //  			console.log("error: unable to get URL information");
  //  		}
  //
  //      });
  //
  //  }
  //  function load()
  //  {
  //  	gapi.client.setApiKey('AIzaSyDSn7z7V1f6H3yXrgAlgVGw52dSEmqALIc'); //get your ownn Browser API KEY
  //  	gapi.client.load('urlshortener', 'v1',function(){});
  //  }
  //  window.onload = load;
}]);
