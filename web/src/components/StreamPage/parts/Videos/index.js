import React, {Component} from 'react'
import Video from '../Video'

import {VideosWrapper} from './styles';
import './styles.scss'

class Videos extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rVideos: [],
            remoteStreams: [],
            selectedVideo: null,
            videoVisible: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.remoteStreams !== nextProps.remoteStreams) {

            const NoOfRemoteStreams = nextProps.remoteStreams.length

            let selectedVideo;

            if (NoOfRemoteStreams === 1)
                selectedVideo = {selectedVideo: nextProps.remoteStreams[0]}
            else {
                selectedVideo = this.state.selectedVideo
                    && nextProps.remoteStreams.filter(stream => stream.id === this.state.selectedVideo.id) || [];

                selectedVideo = selectedVideo.length
                    ? {}
                    : {selectedVideo: nextProps.remoteStreams[NoOfRemoteStreams - 1]}
            }

            let _rVideos = nextProps.remoteStreams.map((rVideo, index) => {

                const _videoTrack = rVideo.stream.getTracks().filter(track => track.kind === 'video')
                let video = _videoTrack && (
                    <Video
                        videoMuted={this.videoMuted}
                        videoType='remoteVideo'
                        videoStream={rVideo.stream}
                        frameStyle='remote-video-wrapper'
                        videoStyles='remote-video'
                    />
                ) || <div/>;

                return (
                    <div
                        id={rVideo.name}
                        onClick={() => this.switchVideo(rVideo)}
                        style={{
                            cursor: 'pointer', display: 'inline-block'
                        }}
                        key={index}
                    >
                        {video}
                    </div>
                )
            });

            this.setState({
                remoteStreams: nextProps.remoteStreams,
                rVideos: _rVideos,
                ...selectedVideo,
            })
        }
    }

    videoMuted = (rVideo) => {
        const muteTrack = rVideo.getVideoTracks()[0]
        const isSelectedVideo = rVideo.id === this.state.selectedVideo.stream.id
        if (isSelectedVideo) {
            this.setState({
                videoVisible: !muteTrack.muted
            })
        }
    };

    switchVideo = (_video) => {
        const muteTrack = _video.stream.getVideoTracks()[0]
        this.setState({
            selectedVideo: _video,
            videoVisible: !muteTrack.muted
        })
    };

    render() {
        return (
            <>
                <Video
                    videoType='previewVideo'
                    frameStyle='video-wrapper'
                    videoStyles='styled-video'
                    videoStream={this.state.selectedVideo && this.state.selectedVideo.stream}
                />
                <VideosWrapper>
                    {this.state.rVideos}
                </VideosWrapper>
            </>
        )
    }

}

export default Videos
