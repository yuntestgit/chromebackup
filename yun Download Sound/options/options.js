var synth = window.speechSynthesis;
var voices = [];
var voiceSelect = document.getElementById('voice');

var audio = new Audio(''); 
var synthX = window.speechSynthesis;
var utterThisX = new SpeechSynthesisUtterance();
var voicesX = window.speechSynthesis.getVoices();
		
function populateVoiceList() {
// Determine available voices and create dropdown list	
  voices = synth.getVoices();
  var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
  voiceSelect.innerHTML = '';  
  
  for(i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    
    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
  voiceSelect.selectedIndex = selectedIndex;
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function save_options() {
// Save options to storage
	chrome.storage.local.set({
		speechtext: 	document.getElementById('speechtext').value,
		volume:			document.getElementById('volume').value,
		sound:  		document.getElementById('sound').checked,
		fileindex:		document.getElementById('file').selectedIndex,
		file:			document.getElementById('file').value,
		speech:  		document.getElementById('speech').checked,
		voiceindex:     voiceSelect.selectedIndex,
        voice:          voiceSelect.selectedOptions[0].getAttribute('data-name'),
        language:       voiceSelect.selectedOptions[0].getAttribute('data-lang')
    }, function() {
		// Update status to let user know options were saved
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function() {
		status.textContent = '';
		}, 750);
	});
}

function test()
{
	document.getElementById('test').style.display = 'none';
	document.getElementById('stop').style.display = '';
	
	var speechtext = document.getElementById('speechtext').value;
	var	volume = document.getElementById('volume').value;
	var	sound = document.getElementById('sound').checked;
	var	fileindex = document.getElementById('file').selectedIndex;
	var	file = document.getElementById('file').value;
	var	speech = document.getElementById('speech').checked;
	var voiceindex = voiceSelect.selectedIndex;
    var voice = voiceSelect.selectedOptions[0].getAttribute('data-name');
    var language = voiceSelect.selectedOptions[0].getAttribute('data-lang');
	
	if(sound == true)
	{
		audio = new Audio('../' + file); 
		audio.volume = volume * 1;
		audio.onended = stop;
		audio.play();
	}
	
	if(speech == true)
	{ 	
		utterThisX.text = speechtext;
		utterThisX.lang = language;
		voicesX = window.speechSynthesis.getVoices();
		utterThisX.voice = voicesX.filter(function(voice) { return voice.name == voice; })[0];		
		utterThisX.volume = volume * 1;
		utterThisX.onend = stop;
		synthX.speak(utterThisX);	
	}	
}

function stop()
{
	document.getElementById('stop').style.display = 'none';
	document.getElementById('test').style.display = '';
	
	var	sound = document.getElementById('sound').checked;
	if(sound == true)
	{
		audio.pause();
		audio.currentTime = 0;
	}
	
	var	speech = document.getElementById('speech').checked;
	if(speech == true)
	{ 	
		synthX.cancel();		
	}
}

function setvol1(){setVolume(1);} function setvol2(){setVolume(2);} function setvol3(){setVolume(3);} function setvol4(){setVolume(4);} function setvol5(){setVolume(5);}
function setVolume(value)
{
	for(var i = 1; i <= 5; i++)
	{
		if(i <= value)
		{
			document.getElementById('vol' + i).style.backgroundColor = '#555';
		}
		else
		{
			document.getElementById('vol' + i).style.backgroundColor = '#aaa';
		}
	}
	document.getElementById('volume').value = (value * 2) / 10;
}

function restore_options() {
// Restore options from storage
	chrome.storage.local.get({
// Default values		
		speechtext: 'Download complete', 
		volume:		1,
		sound:		true,     
		fileindex:	0,
		file:		'audio/clip.mp3',
		speech:		false,
		voiceindex: 0},
//Callback function (arrowed)
		(res) => {
		document.getElementById('speechtext').value = res.speechtext || 'Download complete';
		setVolume((res.volume * 10) / 2);
		document.getElementById('sound').checked = res.sound;
		document.getElementById('file').selectedIndex = res.fileindex;
		document.getElementById('speech').checked = res.speech;	
        voiceSelect.selectedIndex = res.voiceindex;
	});
}

document.addEventListener('DOMContentLoaded', restore_options);           //Restore options when content is loaded
document.getElementById('save').addEventListener('click', save_options);  //Save options when button is clicked

document.getElementById('volblock1').addEventListener('click', setvol1);
document.getElementById('volblock2').addEventListener('click', setvol2);
document.getElementById('volblock3').addEventListener('click', setvol3);
document.getElementById('volblock4').addEventListener('click', setvol4);
document.getElementById('volblock5').addEventListener('click', setvol5);

document.getElementById('test').addEventListener('click', test);
document.getElementById('stop').addEventListener('click', stop);