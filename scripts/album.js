 // Example Album
 var albumPicasso = {
     title: 'The Colors',
     artist: 'Pablo Picasso',
     label: 'Cubism',
     year: '1881',
     albumArtUrl: 'assets/images/album_covers/01.png',
     songs: [
         { title: 'Blue', duration: '4:26' },
         { title: 'Green', duration: '3:14' },
         { title: 'Red', duration: '5:01' },
         { title: 'Pink', duration: '3:21'},
         { title: 'Magenta', duration: '2:15'}
     ]
 };
 
 // Another Example Album
 var albumMarconi = {
     title: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { title: 'Hello, Operator?', duration: '1:01' },
         { title: 'Ring, ring, ring', duration: '5:01' },
         { title: 'Fits in your pocket', duration: '3:21'},
         { title: 'Can you hear me now?', duration: '3:14' },
         { title: 'Wrong phone number', duration: '2:15'}
     ]
 };

//We declare the objects before the function because the 
//createSongRow function uses the information stored in the album objects.

 var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' //store the song # To revert the play button back to song #    
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     return $(template);
 };


 var setCurrentAlbum = function(album) {
     //select all of the HTML elements required to display on the album page: title, artist, release info, image, and song list
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     //nodeValue returns or sets the value of the first child node.
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
 
     //clear the album song list HTML to make sure there are no interfering elements
     $albumSongList.empty();
 
     //go through all the songs from the specified album object and insert them into the HTML using the innerHTML property. 
     //The createSongRow function is called at each loop, passing in the song number, name, and length arguments from our album object.
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };

 //traverse the DOM upward until a parent with a specified class name is found
 var findParentByClassName = function(element, targetClass) {
     if (element) {
         var currentParent = element.parentElement;
         while (currentParent.className != targetClass && currentParent.className !== null) {
             currentParent = currentParent.parentElement;
         }
         return currentParent;
     }
 };

 //take an element based on that element's class name(s), return the element with the .song-item-number class.
 var getSongItem = function(element) {
    switch (element.className) {
        case 'album-song-button':
        case 'ion-play':
        case 'ion-pause':
            return findParentByClassName(element, 'song-item-number');
        case 'album-view-song-item':
            return element.querySelector('.song-item-number');
        case 'song-item-title':
        case 'song-item-duration':
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        case 'song-item-number':
            return element;
        default:
            return;
    }  
 };

 var clickHandler = function(targetElement) {

     var songItem = getSongItem(targetElement);  
      //if currentlyPlayingSong is null. If true, it should set the songItem's content to the pause button and 
      //set currentlyPlayingSong to the new song's number 
     if (currentlyPlayingSong === null) {
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
      //revert the button back to a play button if the playing song is clicked again. Set currentlyPlayingSong to null after
     } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
         songItem.innerHTML = playButtonTemplate;
         currentlyPlayingSong = null;
      //If the clicked song is not the active song, set the content of the new song to the pause button
     } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
         var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
         currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
     }
 };

////////--Set Elements to add listeners to: 

 var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
    //To reduce the number of event listeners, we'll use event delegation. 
    //It allows us to listen for an event on a parent element but target the behavior on one of its children.
    //The target parent element is the table with the class .album-view-song-list
 var songRows = document.getElementsByClassName('album-view-song-item');

 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
  //display the play button when we hover over the table row, change the content of the table cell with the class .song-item-number
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>'; 
  //template for the pause button
 
 var currentlyPlayingSong = null;
 // Store state of playing songs, null so that no song is identified as playing until we click one

////////--Add Event Listeners 

window.onload = function() {
     setCurrentAlbum(albumPicasso);
     songListContainer.addEventListener('mouseover', function(event) {
         //The target property on the event object stores the DOM element where the event occurred.
         //first select the parent element of song's number/title/duration
         //use the parentElement and className properties together to make sure that we only act on the table row
         if (event.target.parentElement.className === 'album-view-song-item') {
             event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
               // Change the content from the song number to the play button's HTML
               //use querySelector() method bc we only need to return a single element with the .song-item-number class
             var songItem = getSongItem(event.target);
              //only changes the innerHTML of the table cell when the element does not belong to the currently playing song.
             if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
                 songItem.innerHTML = playButtonTemplate;
             }             
         }
     });
     
     // Revert the content back to the number
     for (var i = 0; i < songRows.length; i++) {
         songRows[i].addEventListener('mouseleave', function(event) {
             var songItem = getSongItem(event.target);
              //cache the song item that we're leaving in a variable
             var songItemNumber = songItem.getAttribute('data-song-number');
              // The getAttribute() method takes a single argument: a string with the name of the attribute whose value 
              // we want to retrieve. When the mouse leaves a selected table row, it will change back to the song number using the value obtained from this method.       
             
             if (songItemNumber !== currentlyPlayingSong) {
                 songItem.innerHTML = songItemNumber;
                 //checks that the item the mouse is leaving is not the current song, and we only change the content if it isn't
             }         
         });
         
         songRows[i].addEventListener('click', function(event) {
            clickHandler(event.target);
             //see clickHandler func above
         });             
     }     
 };