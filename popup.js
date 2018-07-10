// moment.locale('bn');

// get current location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geo location is not supported by this browser");
    }
}

function showPosition(position) {
	showPrayTimes(position.coords.latitude, position.coords.longitude, prayTimes);
}

function showPrayTimes(lat, long, prayTimes) {
	var paryerTimes = prayTimes.setMethod('Karachi');
	var paryerTimes = prayTimes.adjust( {asr: 'Hanafi', maghrib: '3 min'} );
	var paryerTimes = prayTimes.getTimes(new Date(), [lat, long], +6, 0, '12h');

	var list = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Sunset', 'Maghrib', 'Isha', 'Midnight'];
	var html = '<table id="timetable" class="table table-bordered table-hover">';
	html += '<tr class="active"><th colspan="2">'+moment().format('MMMM Do YYYY, h:mm:ss a')+ '</th></tr>';
	var nextPrayerTime;
	var nextPrayerTimeRemaining;
	var nextPrayerTimeName;
	var listLength = list.length;
	for (var i = 0; i < listLength; i++) {

		// find current waqt
		var currentWaqt = '';

		var startTime = moment(paryerTimes[list[i].toLowerCase()], 'hh:mm a');
		if (list[i+1]) {
			var endTime = moment(paryerTimes[list[i+1].toLowerCase()], 'hh:mm a');
		}

		if (currentWaqt == '') {
			if (moment().isBetween(startTime, endTime)) {
				if (list[i] != 'Sunrise' && list[i] != 'Sunset' && list[i] != 'Midnight') {
					currentWaqt = 'bg-primary';
				}

				nextPrayerTime = moment(paryerTimes[list[i+1].toLowerCase()], 'hh:mm a');
				nextPrayerTimeName = list[i+1];
				if (list[i+1] == 'Sunrise' || list[i+1] == 'Sunset' || list[i+1] == 'Midnight') {
					nextPrayerTime = moment(paryerTimes[list[i+2].toLowerCase()], 'hh:mm a');
					nextPrayerTimeName = list[i+2];
				}
				nextPrayerTimeRemaining = nextPrayerTime.diff(moment());
				nextPrayerTimeRemaining = moment(nextPrayerTimeRemaining).format("mm:ss");
			}
		}

		html += '<tr class="'+currentWaqt+'"><td>'+ list[i]+ '</td>';
		html += '<td class="text-right">'+ paryerTimes[list[i].toLowerCase()]+ '</td></tr>';

	}
	html += '<tfoot><tr class="text-center"><td colspan="2">Next Prayer Time<br> '+nextPrayerTimeName+' '+nextPrayerTimeRemaining+'</td></tfoot>';

	html += '</table>';

	document.getElementById('divShowPrayTimes').innerHTML = html;
}
var interval = setInterval(getLocation, 100);