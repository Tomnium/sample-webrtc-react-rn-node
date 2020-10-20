import React, { Component } from 'react';

import {
  ControlButton,
} from './styles';

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mic: true,
      camera: true,
      videoVisible: true,
    }
  }

  componentDidMount() {
    if (this.props.videoStream) {
      this.video.srcObject = this.props.videoStream
    }
  }

  componentWillReceiveProps(nextProps) {

    console.log('1', this.props.videoType, nextProps.videoStream);

    if (nextProps.videoStream && nextProps.videoStream !== this.props.videoStream) {
      console.log('2', this.props.videoType, nextProps.videoStream);
      this.video.srcObject = nextProps.videoStream
    }

    // This is done only once when we receive a video track
    const videoTrack = nextProps.videoStream && nextProps.videoStream.getVideoTracks();
    if (this.props.videoType === 'remoteVideo' && videoTrack && videoTrack.length) {

      videoTrack[0].onmute = () => {
        this.setState({ videoVisible: false, });
        this.props.videoMuted(nextProps.videoStream)
      };

      videoTrack[0].onunmute = () => {
        this.setState({ videoVisible: true });
        this.props.videoMuted(nextProps.videoStream)
      }
    }


    const audioTrack = nextProps.videoStream && nextProps.videoStream.getAudioTracks();
    if (this.props.videoType === 'remoteVideo' && audioTrack && audioTrack.length) {
      audioTrack[0].onmute = () => {
        alert('muted')
      }
    }

  }

  muteMic = () => {
    const stream = this.video.srcObject.getTracks().filter(track => track.kind === 'audio');
    this.setState(prevState => {
      if (stream) stream[0].enabled = !prevState.mic;
      return {mic: !prevState.mic}
    })
  };

  muteCamera = () => {
    const stream = this.video.srcObject.getTracks().filter(track => track.kind === 'video');
    this.setState(prevState => {
      if (stream) stream[0].enabled = !prevState.camera;
      return {camera: !prevState.camera}
    })
  };

  render() {
    const { showMuteControls, videoStyles, muted, id, frameStyle } = this.props;
    const { mic, camera, videoVisible } = this.state;

    return (
      <div
        style={{ ...frameStyle }}
      >
        <video
          id={id}
          muted={muted}
          autoPlay
          style={{
            visibility: videoVisible && 'visible' || 'hidden',
            ...videoStyles,
          }}
          ref={ (ref) => {this.video = ref }}
        />
        {
          showMuteControls
          && (
              <div>
                <ControlButton
                    onClick={this.muteMic}
                    perm={mic}
                    className='material-icons'
                >
                  {mic && 'mic' || 'mic_off'}
                </ControlButton>
                <ControlButton
                    onClick={this.muteCamera}
                    perm={camera}
                    className='material-icons'
                >
                  {camera && 'videocam' || 'videocam_off'}
                </ControlButton>
              </div>
          )
        }
      </div>
    )
  }
}

export default Video
