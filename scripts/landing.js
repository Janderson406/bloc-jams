 var pointsArray = document.getElementsByClassName('point');
 
 var animatePoints = function(pointsArray) {
     
     var revealPoint = function(points) {
         points.style.opacity = 1;
         points.style.transform = "scaleX(1) scaleY(1) translateY(0)";
         points.style.msTransform = "scaleX(1) scaleY(1) translateY(0)";
         points.style.WebkitTransform = "scaleX(1) scaleY(1) translateY(0)";
     };

     forEach(pointsArray, revealPoint);
     // callback created in utilities.js
 };

 window.onload = function() {
     
    // Automatically animate the points on a tall screen where scrolling can't trigger the animation
     if (window.innerHeight > 950) {
         animatePoints(pointsArray);
     }
     
     var sellingPoints = document.getElementsByClassName('selling-points')[0];
     var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
     //trigger the animation when a user scrolls at least 200 pixels into the .selling-points element. 
     
     window.addEventListener('scroll', function(event) {
         if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
             animatePoints(pointsArray);   
         }         
         
         //console.log("Current offset from the top is " + sellingPoints.getBoundingClientRect().top + " pixels");
         //getBoundingClientRect() measures the distance (in pixels) from the outside of a selected element to the end of the viewport
         //print the top property of the .selling-points element whenever the user scrolls
     });
 }
