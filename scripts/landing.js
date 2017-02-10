 var animatePoints = function() {
     var revealPoint = function() {
         $(this).css({
             opacity: 1,
             transform: 'scaleX(1) translateY(0)'
         });
     };
     $.each($('.point'), revealPoint);
 };     

//     var revealPoint = function(i) {
//         points[i].style.opacity = 1;
//         points[i].style.transform = "scaleX(1) scaleY(1) translateY(0)";
//         points[i].style.msTransform = "scaleX(1) scaleY(1) translateY(0)";
//         points[i].style.WebkitTransform = "scaleX(1) scaleY(1) translateY(0)";
//     };
//
//     for (var i = 0; i < points.length; i++) {
//         revealPoint(i);
//     }
// };

 $(window).load(function() {
     
    // Automatically animate the points on a tall screen where scrolling can't trigger the animation
     if ($(window).height() > 950) {
         animatePoints();
     }
     
     
     //trigger the animation when a user scrolls at least 200 pixels into the .selling-points element. 
     
     $(window).scroll(function(event) {
         var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;
         if ($(window).scrollTop() >= scrollDistance) {
             animatePoints();
     // jQuery's scroll() "method" is still an event handler like addEventListener(), but the jQuery 
     //wrapper obscures the appearance of events. When the window scrolls, the function executes.         
         }         
     });
 });
 
 
 

 
 
 
 
