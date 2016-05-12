/**
 grid.js
 description:    Builds the gameboard for BrainTrain game.
 authors:        Kabir Cahill, Kent Huang, Luke Lee, Eric Lin, Roger Zhang
 */

var rows = 9;
var cols = 16;
var grid;
var track; // A 2D array representing the train track. True means the tile is part of the track.
var level = 0;
var totalScore = 0;
var levelComplete = false;
var difficultyTier = 3;
var numberOfTrains = 2;
var startingPoints = [];
var correctAnswers = [];
var usersAnswers = [];

$(document).ready(function(){
	grid = $('#grid');
	buildGrid();
	resizeGrid();

	// resize grid when window is resized
	$(window).resize(resizeGrid);

    // place the trains at their starting position
    startingPoints = randomTrains(difficultyTier,numberOfTrains);
    for(i = 0; i < startingPoints.length; i++) {
        placeTheTrain(startingPoints[i]);
    }

    // determine the correct destinations
    correctAnswers = giveTheAnswerArr(startingPoints);

    // the user has chosen a destination
    $('.destButton').click(function () {

        if (usersAnswers.length < numberOfTrains) {

            // get the row of the button
            var row = parseInt($(this).attr('id').replace(/\D/g, ''));

            // get the index of the row in userAnswers
            var answerIndex = usersAnswers.findIndex(function (userAnswer) {
                return userAnswer == row;
            });

            // if the row has not already been stored, add it to the array
            if (answerIndex == -1) {
                // make the button 'selected' (i.e. change its color)
                //$(this).css('backgroundColor', 'yellow');
                usersAnswers.push(row); // store the button's row in the array of user's answers
            }

            var soundEffect = new Audio();

            // get the index of the row in correctAnswers
            answerIndex = correctAnswers.findIndex(function (correctAnswer) {
                return correctAnswer == row;
            });

            // if the row is a correct destination, add to the users score, otherwise subtract
            if (answerIndex != -1) {
                // add 100 points from user's score
                totalScore += 100;
                soundEffect.src = "Correct.mp3";
                $(this).css('backgroundColor', '#00ff00');
            } else {
                // deduct 50 points from user's score
                totalScore -= 50;
                soundEffect.src = "Wrong.mp3";
                $(this).css('backgroundColor', 'black');
            }

            soundEffect.play();

            if (usersAnswers.length == numberOfTrains) {
                // move the trains
                for(i = 0; i < startingPoints.length; i++) {
                    moveTheTrain(startingPoints[i]);
                }

                usersAnswers.sort();
                correctAnswers.sort();

                if(usersAnswers.isEqual(correctAnswers)) {
                    levelComplete = true;
                    console.log('You win! Score: ' + totalScore);
                } else {
                    console.log('You lose. Score: ' + totalScore);
                }
            }
        }
    });
});

// An array method that compares if two arrays are equal (same length, values and order)
Array.prototype.isEqual = function (otherArray) {
    if(this.length != otherArray.length) {
        return false;
    }

    return this.every(function (value, i) {
        return value == otherArray[i];
    });
}

// Adds the tiles to the grid
function buildGrid() {
	// clear the grid
	grid.empty();

	track = CreateArray(rows, cols);
	fillArray(track, rows, cols);
    buildHorizontalTracks(track, difficultyTier);
    randomCrossing(difficultyTier, track);

    // add track or empty tile to grid
	for(i = 0; i < rows; i++) {
		for(j = 0; j < cols; j++) {
            var trackClass = '';
            var buttonClass = '';
            var buttonId = '';
            if (track[i][j]) {
                trackClass = ' track';

                if (j == cols - 1) {
                    buttonClass = ' destButton';
                    buttonId = ' id="button' + i + '"';
                } else {
                    buttonClass = '';
                }
            }
            grid.append('<div class="tile'+ trackClass + buttonClass + '"' + buttonId +'></div>');
		}
	}
}
	
// Scales the grid to fit the screen
function resizeGrid() {
	// fit grid in window
	grid.width('80%');
	grid.height('80%');
	
	// get grid width and height in px
	var gridWidth = grid.width();
	var gridHeight = grid.height();
	var tileWidth;
	var tileHeight;
	
	// choose tile size that fits both grid width and height
	if((gridWidth / cols) < (gridHeight / rows)) {
		tileWidth = gridWidth / cols;
		tileHeight = tileWidth;
	} else {
		tileHeight = gridHeight / rows;
		tileWidth = tileHeight;
	}

	// set tile width and height
	$('.tile').outerHeight(tileHeight);
	$('.tile').outerWidth(tileWidth);
	
	// adjust grid width and height
	grid.width(tileWidth * cols + 1);
	grid.height(tileHeight * rows + 1);
}

// Generates the track
function buildTrack(level) {

}
