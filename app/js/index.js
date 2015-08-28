var $ = require('jquery');
var paper = require('paper');

var canvas = document.getElementById('test');
// Create an empty project and a view for the canvas:
paper.setup(canvas);
// paper.install(window);

// // Adapted from the following Processing example:
// // http://processing.org/learning/topics/follow3.html

// // The amount of points in the path:
// var points = 20;

// // The distance between the points:
// var length = 20;

// var path = new Path({
//     strokeColor: '#E4141B',
//     strokeWidth: 20,
//     strokeCap: 'round'
// });

// //var start = view.center / [10, 1];
// var start = view.center.divide(new Point([10, 1]));

// for (var i = 0; i < points; i++) {
//     path.add(start.add(new Point(i * length, 0)));
// }


// function onMouseMove(event) {
//     path.firstSegment.point = event.point;
//     for (var i = 0; i < points - 1; i++) {
//         var segment = path.segments[i];
//         var nextSegment = segment.next;
//         var vector = segment.point.subtract(nextSegment.point);
//         vector.length = length;
//         nextSegment.point = segment.point.subtract(vector);
//     }
//     path.smooth();
// };

// function onMouseDown(event) {
//     path.fullySelected = true;
//     path.strokeColor = '#e08285';
// };

// function onMouseUp(event) {
//     path.fullySelected = false;
//     path.strokeColor = '#e4141b';
// };

var path = new paper.Path.Rectangle([125, 125], [200, 200]);
path.strokeColor = 'black';

paper.view.onFrame = function(event) {
    // On each frame, rotate the path by 3 degrees:
    path.rotate(1);
};



