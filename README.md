# onsetdetector.js (experimental)

onsetdetector.js is a minimal JavaScript library for onset detection of live audio input using getUserMedia.

## Usage

Download the js and include it in your html.

```html
<script src="js/onsetdetector.js"></script>
```

All methods and properties are included in the "onsetDetector" object.

A short example is the following:

```js
// set arbitrary callback that will be called when detecting onset
onsetDetector.setCallback(function () {
    alert('hey!');
});

// set threshold in the range of 0-255
onsetDetector.threshold = 150;

// start monitoring the live audio input that is captured by microphone
onsetDetector.start();

// stop monitoring
onsetDetector.stop();
```

### Properties

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Default</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>threshold</td>
            <td>100</td>
            <td>Threshold for the level of analysis audio signal. The range of level is from 0 to 255. When the level is greater than this threshold, the callback is called.</td>
        </tr>
        <tr>
            <td>skipCount</td>
            <td>100</td>
            <td>Count of analysis frames to skip monitoring after detecting onset.</td>
        </tr>
        <tr>
            <td>bufferSize</td>
            <td>512</td>
            <td>Length of the analysis window in sample. It must be one of the following values: 256, 512, 1024, 2048, 4096, 8192, 16384.</td>
        </tr>
        <tr>
            <td>currentLevel</td>
            <td>Read-only</td>
            <td>Level of the current analysis audio signal.</td>
        </tr>
    </tbody>
</table>

## License
Copyright (c) 2012 thunder9 licensed under the MIT license.