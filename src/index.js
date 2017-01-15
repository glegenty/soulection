import MyComponent from 'components/MyComp'
import SoundcloudLoader from 'components/SoundcloudLoader.js'
import UiUpdater from 'components/PlayerUpdater.js'
import SoundCloudAudioSource from 'components/SCAudioSource.js'
import visualizer from 'components/visualizer.js'
import 'styl/index.styl'
import 'gsap'
import $ from 'jquery'

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
    console.log('Submit')
  })
     /* var toggleButton = document.getElementById('toggleButton')
      toggleButton.addEventListener('click', function(e) {
          e.preventDefault()
          uiUpdater.toggleControlPanel()
      }) */

  var url = false

  console.log(trackUrl)
      /* Si pas d'URl afficher input */
  var newSession = !trackUrl
  if (!trackUrl) {
    url = true
    $(this).addClass('paused')
          /* TweenMax.to('#form',0.01,{className:''})
          TweenMax.to('#form',0.3,{width:'270px'})
          TweenMax.to(['#input','#submit'],0.2,{display:'inline-block',delay:0.3}) */
    TweenMax.set('#form', {className: ''})
    TweenMax.set('#form', {width: '274px'})
    TweenMax.set(['#input', '#submit'], {display: 'inline-block'})
    TweenMax.set(['#trackInfoPanel', '#control-plus', '.background-control', '#play'], {opacity: 0})
  }

  function TweenMaxNewSession () {
    console.log('TweenMaxNewSession ' + newSession)
    var input = $('#input').val()
    console.log(input)
    if (newSession && (input !== '')) {
      newSession = false
      url = false
      console.log('TweenMaxNewSession TRUE')
      TweenMax.to(['#trackInfoPanel', '#control-plus', '.background-control', '#play'], 0.5, {opacity: 1})
      TweenMax.to(['#input', '#submit'], 0.1, {display: 'none', ease: Power3.easeOut})
      TweenMax.to('#form', 0.5, {width: '26px', delay: 0.1, ease: Power3.easeOut})
      TweenMax.to('#form', 0.01, {className: 'disable', delay: 0.3, ease: Power3.easeOut})
    } else {
      console.log('TweenMaxNewSession False reverse')
      tlURL.reverse()
      url = false
    }
  }
  var togglePlay = document.getElementById('play')

  togglePlay.addEventListener('click', function (e) {
    e.preventDefault()
    loader.directStream('toggle')
    $(this).toggleClass('paused')
  })

  const toggleControlPlus = document.getElementById('control-plus')
  toggleControlPlus.addEventListener('click', function (e) {
    e.preventDefault()
  })

  const tlURL = new TimelineMax({paused: true, ease: Power3.easeOut})

    /*  $('#submit').click( () =>{

      }) */

  tlURL.to(['#trackInfoPanel', '#control-plus', '.background-control', '#play'], 0.2, {opacity: 0.5})
           .to('#form', 0.01, {className: ''}, '-=0.2')
           .to('#form', 0.3, {width: '274px'}, '-=0.2')
           .to(['#input', '#submit'], 0.2, {display: 'inline-block'})

  const toggleURL = document.getElementById('toggleURL')
  toggleURL.addEventListener('click', function (e) {
    e.preventDefault()
    console.log('TOGGLE URL')

    if (!url && !newSession) {
      TweenMax.set(['#trackInfoPanel', '#control-plus', '.background-control', '#play'], {opacity: 1})
      tlURL.play()
      url = true
    } else if (!newSession) {
      TweenMax.set(['#trackInfoPanel', '#control-plus', '.background-control', '#play'], {opacity: 0.5})
      tlURL.reverse()
      url = false
    }
  })
  var tlCtrlPlus = new TimelineMax({paused: true, ease: Power3.easeOut})
  var toggleCtrlPlus = false
  tlCtrlPlus.fromTo('#currentTl', 0.1, {float: 'right'}, {float: 'left'})
                  .fromTo(['.time', '.volumeWrapper', 'playheadTl'], 0.1, {visibility: 'hidden'}, {visibility: 'visible'}, '-=0.1')
                  .fromTo('.background-control', 0.5, {width: '105px'}, {width: '540px'})

                  .fromTo(['#infoArtist', '#infoTrack'], 0.5, {color: '#6b97ba'}, {color: '#f1f1e5'}, '-=0.3')
      // $('.background-control').css("display","none")
  $('#control-plus').click(function () {
    if (!toggleCtrlPlus) {
      tlCtrlPlus.play()
      toggleCtrlPlus = true
    } else {
      tlCtrlPlus.reverse()
      toggleCtrlPlus = false
    }
  })

  player.addEventListener('loadeddata', () => {
    var sT = parseInt(player.duration % 60)
    var mT = parseInt((player.duration / 60) % 60)
    var hT = parseInt(((player.duration / 60) / 60) % 60)
    sT = (sT >= 10) ? sT : '0' + sT
    mT = (mT >= 10) ? mT : '0' + mT
    hT = (player.duration < 3600) ? '' : '0' + hT + ':'
    $('#totalTime').text(hT + mT + ':' + sT)
    volHead.css('left', player.volume * 100 + '%')
    currentVol.css('width', player.volume * 100 + '%')
  })

  player.addEventListener('timeupdate', timeUpdate, false)
      // $(audioFilePlayer).bind('timeupdate', updateTime)
  function timeUpdate () {
    var playPercent = 100 * (player.currentTime / player.duration)
    $('#playheadTl').css('left', playPercent + '%')
    $('#currentTl').css('width', playPercent + '%')
    var s = parseInt(player.currentTime % 60)
    var m = parseInt((player.currentTime / 60) % 60)
    var h = parseInt(((player.currentTime / 60) / 60) % 60)
    s = (s >= 10) ? s : '0' + s
    m = (m >= 10) ? m : '0' + m
    h = (player.duration < 3600) ? '' : '0' + h + ':'
    $('#currentTime').text(h + m + ':' + s)
  }

  player.addEventListener('ended', () => {
    $('#play').addClass('paused')
  })

  // Makes timeline clickable
  var timeline = $('#timeline')
  var volumeline = $('#volumeline')
  var playheadTl = $('#playheadTl')
  var volHead = $('#volHead')
  var currentTl = $('#currentTl')
  var currentVol = $('#currentVol')
  const timelineWidth = parseInt(timeline.css('width'))
  const volumelineWidth = parseInt(volumeline.css('width'))
  timeline.click(function (event) {
    moveplayhead(event)
    player.currentTime = player.duration * clickPercent(event, timeline, timelineWidth)
  })

  volumeline.click(function (event) {
    moveVolHead(event)
    player.volume = volPercent(event)
  })
  // returns click as decimal (.77) of the total timelineWidth
  function clickPercent (e, line, lineWidth) {
    return (e.pageX - line.offset().left) / lineWidth
  }
  function volPercent (e) {
    var volP = (e.pageX - volumeline.offset().left) / volumelineWidth
    volP = (volP > 1) ? 1 : volP
    volP = (volP < 0) ? 0 : volP
    return volP
  }
  function moveplayhead (e) {
    var currentPos = e.pageX - timeline.offset().left
    var playPercent = currentPos / (timelineWidth / 100)
    if (currentPos >= 0 && currentPos <= timelineWidth) {
      playheadTl.css('left', playPercent + '%')
      currentTl.css('width', playPercent + '%')
    }
    if (currentPos < 0) {
      playheadTl.css('left', '0')
      currentTl.css('width', '0')
    }
    if (currentPos > timelineWidth) {
      playheadTl.css('left', '100%')
      currentTl.css('width', '100%')
    }
  }

  function moveVolHead (e) {
    var currentPos = e.pageX - volumeline.offset().left
    var playPercent = currentPos / (volumelineWidth / 100)
    if (currentPos >= 0 && currentPos <= volumelineWidth) {
      volHead.css('left', playPercent + '%')
      currentVol.css('width', playPercent + '%')
    }
    if (currentPos < 0) {
      volHead.css('left', '0')
      currentVol.css('width', '0')
    }
    if (currentPos > volumelineWidth) {
      volHead.css('left', '100%')
      currentVol.css('width', '100%')
    }
  }
  // Makes playhead draggable
  playheadTl.mousedown(mouseDownTl)
  volHead.mousedown(mouseDownVol)
  $(window).mouseup(mouseUp)

  // Boolean value so that mouse is moved on mouseUp only when the playhead is released
  var onplayhead = false
  // mouseDown EventListener
  function mouseDownTl () {
    console.log(this)
    if (this === playheadTl) {
      alert('Yep')
    }
    onplayhead = true
    console.log('MouseDown')
    window.addEventListener('mousemove', moveplayhead, true)
    player.removeEventListener('timeupdate', timeUpdate, false)
    $('*').addClass('nonselectable')
  }

  var onVolhead = false
  function mouseDownVol () {
    onVolhead = true
    window.addEventListener('mousemove', moveVolHead, true)
    $('*').addClass('nonselectable')
  }
  // mouseUp EventListener
  // getting input from all mouse clicks
  function mouseUp (e) {
    if (onplayhead === true) {
      moveplayhead(e)
      window.removeEventListener('mousemove', moveplayhead, true)
          // change current time
      player.currentTime = player.duration * clickPercent(e, timeline, timelineWidth)
      player.addEventListener('timeupdate', timeUpdate, false)
    }
    if (onVolhead === true) {
      console.log('Vol Up')
      moveVolHead(e)
      window.removeEventListener('mousemove', moveVolHead, true)
          // change current time
      player.volume = volPercent(e)
    }
    onVolhead = false
    onplayhead = false
    $('*').removeClass('nonselectable')
  }

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

  // if ($.browser.webkit) {
  //   $('input').attr('autocomplete', 'off')
  // }
      /* $("#play").click(function() {
          $(this).toggleClass("paused")
      }) */
}
