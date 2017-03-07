//We declare the objects before the function because the 
//createSongRow function uses the information stored in the album objects.

 var getSongNumberCell = function(number){
    return $('.song-item-number[data-song-number="' + number + '"]');   
 }

 var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' //store the song # To revert the play button back to song #    
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     var $row = $(template);
     
     var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));

        if (currentlyPlayingSongNumber !== null) {
            // Revert to song number for currently playing song because user started playing new song.
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        if (currentlyPlayingSongNumber !== songNumber) { // Switch from Play -> Pause button to indicate new song is playing.
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            currentSoundFile.play(); 
            updateSeekBarWhileSongPlays();
            currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
          
            //maintain volume when new song is clicked 
            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({left: currentVolume + '%'});            
           
            updatePlayerBarSong();            
        } else if (currentlyPlayingSongNumber === songNumber) {
            if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
                updateSeekBarWhileSongPlays()
            } else {
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();   
            }
        }
    };
     
    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
    };  
     
     $row.find('.song-item-number').click(clickHandler);
     // combines the mouseover and mouseleave functions we relied on previously
     $row.hover(onHover, offHover);
     // return $row, which is created with the event listeners attached.
     return $row;
 };     
     
 var setSong = function(songNumber){
     //prevent concurrent playback
     if (currentSoundFile) {
         currentSoundFile.stop();
     }

    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
     //assign a new Buzz sound object. We've passed the audio file via the audioUrl property on the currentSongFromAlbum object.
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
     //we've passed in a settings object that has two properties defined, formats and  preload. formats is an array 
     //of strings with acceptable audio formats. We've only included the 'mp3' string because all of our songs are mp3s. 
     //Setting the preload property to true tells Buzz that we want the mp3s loaded as soon as the page loads
        formats: [ 'mp3' ],
        preload: true
    });

     setVolume(currentVolume);
 };
 
 var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
 };   

 var setCurrentAlbum = function(album) {
     currentAlbum = album;     
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

var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
 };

var nextSong = function() {

    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };

    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

    // Set a new current song
    setSong(currentSongIndex + 1);
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    
    // Play Audio
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();

    // Update the Player Bar information
    updatePlayerBarSong();

    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};


var previousSong = function() {

    // Note the difference between this implementation and the one in nextSong()
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };

    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the index here
    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }

    // Set a new current song
    setSong(currentSongIndex + 1);
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    
    // Play Audio
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();

    // Update the Player Bar information
    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};

 var updatePlayerBarSong = function() {
     $('.currently-playing .song-name').text(currentSongFromAlbum.title);
     $('.currently-playing .artist-name').text(currentAlbum.artist);
     $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
     
     $('.main-controls .play-pause').html(playerBarPauseButton);
 };


var togglePlayFromPlayerbar = function() {
    var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
    if (currentSoundFile.isPaused()) {
        $currentlyPlayingCell.html(pauseButtonTemplate);
        $(this).html(playerBarPauseButton);
        currentSoundFile.play();
        updateSeekBarWhileSongPlays(); ////////////
    } else if (currentSoundFile) {
        $currentlyPlayingCell.html(playButtonTemplate);
        $(this).html(playerBarPlayButton);
        currentSoundFile.pause();
    }
};

 var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
         //bind() the timeupdate event to currentSoundFile. timeupdate is a custom Buzz event that fires repeatedly while time elapses during song playback.
         currentSoundFile.bind('timeupdate', function(event) {
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
     }
 };


 var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
     //start by multiplying the ratio by 100 to determine a percentage. use the built-in JavaScript Math.max() function 
     //to make sure our percentage isn't less than zero and the Math.min() function to make sure it doesn't exceed 100.
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
 
     //convert our percentage to a string and add the % character. When we set the width of the .fill class and the 
     //left value of the .thumb class, the CSS interprets the value as a percent instead of a unit-less number between 0 and 100.
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

 var setupSeekBars = function() {
     var $seekBars = $('.player-bar .seek-bar');
        //And all elements in the DOM with a class of "seek-bar" that are contained within the element with a class of "player-bar". 
        //This will return a jQuery wrapped array containing both the song seek control and the volume control.
 
     $seekBars.click(function(event) {
          //subtract the offset() of the seek bar held in $(this) from the left side of the page
          //leaves us with a resulting value that is a proportion of the seek bar 
         var offsetX = event.pageX - $(this).offset().left;
         var barWidth = $(this).width();
          //divide offsetX by the width of the entire bar to calculate  seekBarFillRatio
         var seekBarFillRatio = offsetX / barWidth;
         
         if ($(this).parent().attr('class') == 'seek-control') {
             seek(seekBarFillRatio * currentSoundFile.getDuration());
         } else {
             setVolume(seekBarFillRatio * 100);   
         }         
 
         //pass $(this) as the $seekBar argument and seekBarFillRatio
         updateSeekPercentage($(this), seekBarFillRatio);
     });
     
     $seekBars.find('.thumb').mousedown(function(event) {
            //this will be equal to the .thumb node that was clicked. Because we are attaching an event to both the song seek 
            //and volume control, thisis howw to determine which of these nodes dispatched the event. 
            //then use the parent method, which will select whichever seek bar this .thumb belongs to
         var $seekBar = $(this).parent();
 
             //bind() because it allows us to namespace event listeners (we'll discuss namespacing, shortly). 
             //The event handler inside the bind() call is identical to the  click behavior.
             //attached the mousemove event to $(document) to make sure that we can drag the thumb after mousing down, even when the mouse leaves the seek bar.
         $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;
            
             if ($seekBar.parent().attr('class') == 'seek-control') {
                 seek(seekBarFillRatio * currentSoundFile.getDuration());   
             } else {
                 setVolume(seekBarFillRatio);
             }
                     
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
 
         // unbind() event method, which removes the previous event listeners that we just added. If we fail to unbind() them, 
         // the thumb and fill would continue to move even after the user released the mouse.
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });     
 };

 var seek = function(time) {
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
 }


////////--Set Elements to add listeners to: 


 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
 var playerBarPlayButton = '<span class="ion-play"></span>';
 var playerBarPauseButton = '<span class="ion-pause"></span>';


 // a set of variables in the global scope that hold current song and album information 
 var currentAlbum = null;
 var currentlyPlayingSongNumber = null;
 var currentSoundFile = null;
 var currentVolume = 80;
 var currentSongFromAlbum = null;

 var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');
 var $playPauseButton = $('.main-controls .play-pause');

console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
 
////////--Add Event Listeners 

 $(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     setupSeekBars();    
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
     $playPauseButton.click(togglePlayFromPlayerbar);
     
 });