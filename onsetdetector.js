// onsetdetector.js 
// Minimal JavaScript library for onset detection of live audio input
// Copyright (c) 2012 thunder9 licensed under the MIT license.

(function (global) {
    
    navigator.getUserMedia = navigator.getUserMedia ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia ||
                             navigator.msGetUserMedia || null;
      
    var _callback,
        _args,
        _context,
        _threshold = 100, // 0 to 255
        _bufferSize = 512,
        _skipCount = 100,
        skips = 0,
        liveSource,
        audioContext,
        analyser,
        processor,
        spectrum,
        level = 0;

    var setCallback = function (callback, args, context) {
        if (typeof callback === 'function') {
            _callback = callback;
            _args = args;
            _context = context || global;
        }
    };
        
    var init = function () {
        if (!navigator.getUserMedia) throw new Error('getUserMedia is not supported');
        if (typeof AudioContext === 'function') {
            audioContext = new AudioContext();
        } else if (typeof webkitAudioContext === 'function') {
            audioContext = new webkitAudioContext();
        } else {
            throw new Error('AudioContext is not supported');
        }
        analyser = audioContext.createAnalyser();
        analyser.fftSize = _bufferSize * 2;
        analyser.smoothingTimeConstant = 0;
        processor = audioContext.createJavaScriptNode(_bufferSize, 1, 1);
        spectrum = new Uint8Array(analyser.frequencyBinCount);
        processor.onaudioprocess = function () {
            if (skips > 0) {
                skips--;
                return;
            }
            level =  getCurrentLevel();           
            if (level > _threshold) {
                if (_callback) {
                    _callback.apply(_context, _args);
                }
                skips = _skipCount;
            }
        };
    };

    var getCurrentLevel = function () {
        if (!analyser) return 0;
        
        analyser.getByteFrequencyData(spectrum);

        // summing up the frequency-domain data excluding dc component
        var total = 0;
        for (var i = 1; i < analyser.frequencyBinCount; i++) {
            total += spectrum[i];
        }
            
        // return the average
        return total / (analyser.frequencyBinCount - 1);    
    };
    
    var start = function () {
        if (!audioContext) init();
        navigator.getUserMedia({ audio: true }, function (stream) {
            liveSource = audioContext.createMediaStreamSource(stream);
            liveSource.connect(analyser);
            analyser.connect(processor);
            processor.connect(audioContext.destination);
        });    
    };
    
    var stop = function () {
        liveSource.disconnect();
        analyser.disconnect();
        processor.disconnect();
        level = 0;
    };
    
    global.onsetDetector = {
        setCallback: setCallback,
        start: start,
        stop: stop
    };
    
    Object.defineProperties(global.onsetDetector, {
        threshold: {
            get: function () { return _threshold; },
            set: function (threshold) { _threshold = threshold; }
        },
        skipCount: {
            get: function () { return _skipCount; },
            set: function (count) { _skipCount = count; }        
        }, 
        bufferSize: {
            get: function () { return _bufferSize; },
            set: function (bufferSize) {
                sizes = [256, 512, 1024, 2048, 4096, 8192, 16384];
                for (var i = 0; i < sizes.length; i++) {
                    if (sizes[i] === bufferSize) {
                        _bufferSize = bufferSize;
                        init();
                        return;
                    }
                }           
            }
        },
        currentLevel: {
            get: function () { return level; }    
        }
    });
        
})(this);
