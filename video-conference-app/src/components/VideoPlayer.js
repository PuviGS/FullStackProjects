import React, { useRef, useEffect } from 'react';

const VideoPlayer = ({ peer }) => {
    const ref = useRef();

    useEffect(() => {
        peer.on('stream', (stream) => {
            ref.current.srcObject = stream;
        });
    }, [peer]);

    return (
        <video playsInline autoPlay ref={ref} className="peer-video" />
    );
};

export default VideoPlayer;
