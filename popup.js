// moment.locale('bn');

// get current location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, error);
    } else {
        console.log("Geo location is not supported by this browser");
    }
}

function error(error) {
	console.log(error.code, error.message);
}

function showPosition(position) {
	showPrayTimes(position.coords.latitude, position.coords.longitude, prayTimes);
}

function showPrayTimes(lat, long, prayTimes) {
	var prayerTimes = prayTimes.setMethod('Karachi');
	var prayerTimes = prayTimes.adjust( {asr: 'Hanafi', maghrib: '3 min'} );
	var prayerTimes = prayTimes.getTimes(new Date(), [lat, long, 300], +6, 0, '12h');

	var list = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Sunset', 'Maghrib', 'Isha', 'Midnight'];
	var html = '<table id="timetable" class="table table-bordered table-hover">';
	var nextPrayerTime;
	var nextPrayerTimeRemaining;
	var nextPrayerTimeName;
	var listLength = list.length;
	for (var i = 0; i < listLength; i++) {

		// find current waqt
		var currentWaqt = '';

		var startTime = moment(prayerTimes[list[i].toLowerCase()], 'hh:mm a');
		if (list[i+1]) {
			var endTime = moment(prayerTimes[list[i+1].toLowerCase()], 'hh:mm a');
		}else{
			var endTime = moment(prayerTimes[list[0].toLowerCase()], 'hh:mm a');
		}

		if (startTime.hour() >=12 && endTime.hour() <=12 )
		{
			endTime.add(1, "days");       // handle spanning days
		}

		if (currentWaqt == '') {
			if (moment().isBetween(startTime, endTime)) {
				if (list[i] != 'Sunrise' && list[i] != 'Sunset' && list[i] != 'Midnight') {
					currentWaqt = 'bg-primary';
				}

				nextPrayerTime = moment(prayerTimes[list[i+1].toLowerCase()], 'hh:mm a');
				nextPrayerTimeName = list[i+1];
				if (list[i+1] == 'Sunrise' || list[i+1] == 'Sunset' || list[i+1] == 'Midnight') {
					if (list[i+1] == 'Midnight') {
						nextPrayerTime = prayerTimes[list[0].toLowerCase()];
						nextPrayerTimeName = list[0];
					}else{
						nextPrayerTime = prayerTimes[list[i+2].toLowerCase()];
						nextPrayerTimeName = list[i+2];
					}
					nextPrayerTime = moment(nextPrayerTime, 'hh:mm a');
				}

				nextPrayerTimeRemaining = nextPrayerTime.diff(moment());
				if (moment(nextPrayerTimeRemaining).hour() > 0) {
					nextPrayerTimeRemaining = moment(nextPrayerTimeRemaining).utc().format('HH:mm:ss');
				}else{
					nextPrayerTimeRemaining = moment(nextPrayerTimeRemaining).utc().format('mm:ss');
				}
			}
		}

		html += '<tr class="'+currentWaqt+'"><td>'+ list[i]+ '</td>';
		html += '<td class="text-right">'+ prayerTimes[list[i].toLowerCase()]+ '</td></tr>';

	}
	html += '<tfoot><tr class="text-center"><td colspan="2"><strong>Next Prayer Time</strong><br> '+nextPrayerTimeName+' '+nextPrayerTimeRemaining+'</td></tfoot>';

	html += '</table>';

	document.getElementById('divShowPrayTimes').innerHTML = html;
}

var interval = setInterval(getLocation, 100);

// Set current date and time on card header
function setCurrentDateTime() {
	document.getElementById("currentDateTime").innerHTML = moment().format('MMMM Do YYYY, h:mm:ss a');
}
var interval = setInterval(setCurrentDateTime, 100);