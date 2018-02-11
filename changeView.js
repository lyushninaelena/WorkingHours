var hours_button = document.getElementById('hours_button');
var schedule_button = document.getElementById('schedule_button');

hours_button.onclick = changeView;
schedule_button.onclick = changeView;

var isScheduleView = true;

function changeView(){
    isScheduleView = !isScheduleView;

    if(isScheduleView){
        document.getElementById('schedule_wrapper').style.display = 'block';
        document.getElementById('hours_wrapper').style.display = 'none';
        document.getElementById('schedule_button').style.display = 'none';
        document.getElementById('hours_button').style.display = 'inline-block';
    } else {
        document.getElementById('schedule_wrapper').style.display = 'none';
        document.getElementById('hours_wrapper').style.display = 'block';
        document.getElementById('schedule_button').style.display = 'inline-block';
        document.getElementById('hours_button').style.display = 'none';
    }
}