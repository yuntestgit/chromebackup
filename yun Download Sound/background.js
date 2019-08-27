chrome.downloads.onChanged.addListener(function(downloadDelta){
// Handle download status
	if(downloadDelta.state === undefined){
	}
// Download is completed	
	else if(downloadDelta.state.current === 'complete'){
	chrome.storage.local.get({
// Default values		
		speechtext: 'Download complete', 
		volume:		1,
		sound:		true,
		fileindex:	0,
		file:		'audio/clip.mp3',
		speech:		false,
		voiceindex: 0,
		voice:      '',
		language:   'en-US'}, 
//Callback function (arrowed)		
        (res) => {
// Play sound
			if (res.sound == true) { 
				var download_finished = new Audio(res.file); 
				download_finished.volume = res.volume * 1;
				download_finished.play(); 
			}
// or utter text			
			if (res.speech == true) { 
				var synth = window.speechSynthesis;
				var utterThis = new SpeechSynthesisUtterance();
				var voices = window.speechSynthesis.getVoices();	
				utterThis.text = res.speechtext;
				utterThis.lang = res.language;
				voices = window.speechSynthesis.getVoices();
				utterThis.voice = voices.filter(function(voice) { return voice.name == res.voice; })[0];		
				utterThis.volume = res.volume * 1;
				synth.speak(utterThis);		
			}		
		});
	}
});

function handleClick() {
// Click on icon in toolbar calls options page	
	chrome.runtime.openOptionsPage();
}

chrome.browserAction.onClicked.addListener(handleClick); //Handle click on icon in toolbar