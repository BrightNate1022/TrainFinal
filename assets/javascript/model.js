 // This is where all the data and global variables will 
 // live for the project

 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyAXDhCl-9EcxOON8l1psWFnsN1PA0ZAUtc",
    authDomain: "train-70a91.firebaseapp.com",
    databaseURL: "https://train-70a91.firebaseio.com",
    projectId: "train-70a91",
    storageBucket: "train-70a91.appspot.com",
    messagingSenderId: "99327234958"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// Form Variables to be passed between objects
var trainNumber;
var trainLine;
var trainDestination;
var trainDeparture;
var nextTrain;
var minutesAway;
var trainFrequency;
var trainTiming;
var trainPlatform;
var currentTime = moment();
console.log('CURRENT TIME: ' + moment(currentTime).format('hh:mm:ss A'));

// model object with functions for pulling/pushing new data to the database

var model = {

	pushNewTrain: () => {


		database.ref().push({

			trainDeparture: trainDeparture,
		    trainDestination: trainDestination,
		    trainFrequency: trainFrequency,
		    trainLine: trainLine,
		    trainNumber: trainNumber,
		    trainPlatform: trainPlatform,
		    dateAdded: firebase.database.ServerValue.TIMESTAMP

		});

		model.pullChildFromDatabase();

	},

	pullChildFromDatabase: () => {

		var filter = database.ref().orderByChild("dateAdded").limitToLast(1)

		filter.once("child_added", function(childSnapshot) {

			trainNumber = childSnapshot.val().trainNumber
			trainLine = childSnapshot.val().trainLine
			trainDestination = childSnapshot.val().trainDestination
			trainDeparture = childSnapshot.val().trainDeparture
			trainFrequency = childSnapshot.val().trainFrequency
			trainPlatform = childSnapshot.val().trainPlatform

			//console.log(trainNumber, trainLine, trainDestination, trainDeparture, trainFrequency, trainPlatform)

			view.updateTrainScheduleTable();
		});

	},

	initialDatabasePull: () => {

		database.ref().on("value", function(snapshot) {
				var trains = snapshot.val();

				//console.log(trains);

				$('#train-schedule-body').empty();

				for (var index in trains){
					trainNumber = trains[index].trainNumber
					trainLine = trains[index].trainLine
					trainDestination = trains[index].trainDestination
					trainDeparture = trains[index].trainDeparture
					trainFrequency = trains[index].trainFrequency
					trainPlatform = trains[index].trainPlatform

					//console.log(trainNumber, trainLine, trainDestination, trainDeparture, trainFrequency, trainPlatform)
					controller.nextArrival();
					controller.minutesAway();
					view.updateTrainScheduleTable();
				};

		}, function(errorObject) {
      		console.log("Errors handled: " + errorObject.code);

		});
	}

}

