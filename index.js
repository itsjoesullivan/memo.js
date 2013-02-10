window.context = new webkitAudioContext();
navigator.webkitGetUserMedia({audio:true}, function(stream) {
	context = new webkitAudioContext();
	var src = context.createMediaStreamSource(stream);
	window.rec = new Recorder(src, {workerPath: 'lib/Recorderjs/recorderWorker.js'});		
	src.connect(context.destination);
});

//uhh, turn what you recorded into a buffer, attach that to your speaker, then start it.
function getBufferCallback( buffers ) {
	var newSource = context.createBufferSource();
	var newBuffer = context.createBuffer( 2, buffers[0].length, context.sampleRate );
	newBuffer.getChannelData(0).set(buffers[0]);
	newBuffer.getChannelData(1).set(buffers[1]);
	newSource.buffer = newBuffer;
        newSource.connect( context.destination );
	newSource.start(0);
}


//convenience
var empty = true;
var record = function() {
	if(!empty) {
		rec.clear();
	}
	rec.record();
	empty = false;
};
document.getElementById("start").addEventListener('click',record);
var stop = function() {
	rec.stop();
};
document.getElementById("stop").addEventListener('click',stop);
var play = function() {
	rec.getBuffer(getBufferCallback);
}
document.getElementById("play").addEventListener('click',play);
