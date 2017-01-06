/**
 * Makes a request to the Soundcloud API and returns the JSON data.
 */
export default function (player, uiUpdater) {
  var self = this
  var clientId = 'ca66887bcdd9141bdf67a2568496e151' // to get an ID go to http://developers.soundcloud.com/
  this.sound = {}
  this.streamUrl = ''
  this.errorMessage = ''
  this.player = player
  this.uiUpdater = uiUpdater

    /**
     * Loads the JSON stream data object from the URL of the track (as given in the location bar of the browser when browsing Soundcloud),
     * and on success it calls the callback passed to it (for example, used to then send the stream_url to the audiosource object).
     * @param track_url
     * @param callback
     */
  this.loadStream = function (trackUrl, successCallback, errorCallback) {
    SC.initialize({
      client_id: clientId
    })
    SC.get('/resolve', { url: trackUrl }, function (sound) {
      if (sound.errors) {
        self.errorMessage = ''
        for (var i = 0; i < sound.errors.length; i++) {
          self.errorMessage += sound.errors[i].error_message + '<br>'
        }
        self.errorMessage += 'Make sure the URL has the correct format: https://soundcloud.com/user/title-of-the-track'
        errorCallback()
      } else {
        if (sound.kind === 'playlist') {
          self.sound = sound
          self.streamPlaylistIndex = 0
          self.streamUrl = function () {
            return sound.tracks[self.streamPlaylistIndex].stream_url + '?client_id=' + clientId
          }
          successCallback()
        } else {
          self.sound = sound
          self.streamUrl = function () { return sound.stream_url + '?client_id=' + clientId }
          successCallback()
        }
      }
    })
  }

  this.directStream = function (direction) {
    if (direction === 'toggle') {
      if (this.player.paused) {
        this.player.play()
      } else {
        this.player.pause()
      }
    } else if (this.sound.kind === 'playlist') {
      if (direction === 'coasting') {
        this.streamPlaylistIndex++
      } else if (direction === 'forward') {
        if (this.streamPlaylistIndex >= this.sound.track_count - 1) this.streamPlaylistIndex = 0
        else this.streamPlaylistIndex++
      } else {
        if (this.streamPlaylistIndex <= 0) this.streamPlaylistIndex = this.sound.track_count - 1
        else this.streamPlaylistIndex--
      }
      if (this.streamPlaylistIndex >= 0 && this.streamPlaylistIndex <= this.sound.track_count - 1) {
        this.player.setAttribute('src', this.streamUrl())
        this.uiUpdater.update(this)
        this.player.play()
      }
    }
  }
};
