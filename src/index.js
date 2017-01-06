import MyComponent from 'components/MyComp'
import SoundcloudLoader from 'components/SoundcloudLoader.js'
import UiUpdater from 'components/PlayerUpdater.js'
import SoundCloudAudioSource from 'components/SCAudioSource.js'
import visualizer from 'components/visualizer.js'
import 'styl/index.styl'
let test = new MyComponent()
window.onload = function init () {
    // var visualizer = new Visualizer();
  var player = document.getElementById('player')
  var uiUpdater = new UiUpdater()
  var loader = new SoundcloudLoader(player, uiUpdater)
  var audioSource = new SoundCloudAudioSource(player)
  var form = document.getElementById('form')
  var loadAndUpdate = function (trackUrl) {
    loader.loadStream(trackUrl, function () {
      uiUpdater.clearInfoPanel()
      audioSource.playStream(loader.streamUrl())
      uiUpdater.update(loader)
      setTimeout(uiUpdater.toggleControlPanel, 3000) // auto-hide the control panel
    },
    function () {
      uiUpdater.displayMessage('Error', loader.errorMessage)
    })
  }
  visualizer(audioSource)

   /* visualizer.init({
        containerId: 'visualizer',
        audioSource: audioSource
    }); */

  uiUpdater.toggleControlPanel()
    // on load, check to see if there is a track token in the URL, and if so, load that automatically
  if (window.location.hash) {
    var trackUrl = 'https://soundcloud.com/' + window.location.hash.substr(1)
    loadAndUpdate(trackUrl)
  }

    // handle the form submit event to load the new URL
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    var trackUrl = document.getElementById('input').value
    loadAndUpdate(trackUrl)
  })
  var toggleButton = document.getElementById('toggleButton')
  toggleButton.addEventListener('click', function (e) {
    e.preventDefault()
    uiUpdater.toggleControlPanel()
  })
   /* var aboutButton = document.getElementById('credit');
    aboutButton.addEventListener('click', function(e) {
        e.preventDefault();
        var message = 'Soundcloud visualizer: a canvas and webaudio API experiment by <a href='http://www.michaelbromley.co.uk'>Michael Bromley</a>.<br>' +
            'For more information, visit the project\'s <a href='https://github.com/michaelbromley/soundcloud-visualizer'>Github page</a>';
        uiUpdater.displayMessage('About', message);
    }); */

  window.addEventListener('keydown', keyControls, false)

  function keyControls (e) {
    switch (e.keyCode) {
      case 32:
                // spacebar pressed
        loader.directStream('toggle')
        break
      case 37:
                // left key pressed
        loader.directStream('backward')
        break
      case 39:
                // right key pressed
        loader.directStream('forward')
        break
    }
  }
}
