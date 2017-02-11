 var buildCollectionItemTemplate = function() {
     var template =
         '<div class="collection-album-container column fourth">'
       + '  <img src="assets/images/album_covers/01.png"/>'
       + '  <div class="collection-album-info caption">'
       + '    <p>'
       + '      <a class="album-name" href="album.html"> The Colors </a>'
       + '      <br/>'
       + '      <a href="album.html"> Pablo Picasso </a>'
       + '      <br/>'
       + '      X songs'
       + '      <br/>'
       + '    </p>'
       + '  </div>'
       + '</div>'
     return $(template);
 }; 
     
 //To make the template a string, it must be wrapped in quotation marks. 
 //The template could exist on one line, but for readability we return each line as we normally would in an HTML document. 
 //To keep the string together, we use + at the start of each line, where it's easy to see its location.
 
 $(window).load(function() {
     var $collectionContainer = $('.album-covers');
            //select the first (and only, as we've designed it) element with an album-covers class name
     $collectionContainer.empty();
            //assign an empty string to collectionContainer's innerHTML property to clear its content.
     for (var i = 0; i < 12; i++)  {
         var $newThumbnail = buildCollectionItemTemplate();
         $collectionContainer.append($newThumbnail);         
            //inserts 12 albums     
     }
 });