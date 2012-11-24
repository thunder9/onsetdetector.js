# onsetdetector.js (experimental)

onsetdetector.js is a minimal JavaScript library for onset detection of live audio input using getUserMedia.

## Usage

```js
// set arbitrary callback that will be called when detecting onset
OnsetDetector.setCallback(function () {
    alert('hey!');
});

// set threshold in the range of 0-255
OnsetDetector.threshold = 150;

// start monitoring the live audio input that are captured by the microphone
OnsetDetector.start();

// stop monitoring
OnsetDetector.stop();
```
## License
Copyright (c) 2012 thunder9 licensed under the MIT license.