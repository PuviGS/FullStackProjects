import React, { useEffect, useRef, useState } from 'react';
import socket from '../socket';
import SimplePeer from 'simple-peer';
import VideoPlayer from './VideoPlayer';

const Room = ({ roomId }) => {
    const [peers, setPeers] = useState([]);
    const myVideo = useRef();
    const videoGrid = useRef();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            myVideo.current.srcObject = stream;

            socket.emit('join-room', roomId, socket.id);

            socket.on('user-connected', (userId) => {
                const peer = createPeer(userId, socket.id, stream);
                setPeers((peers) => [...peers, { peerID: userId, peer }]);
            });

            socket.on('user-disconnected', (userId) => {
                setPeers((prevPeers) => prevPeers.filter((p) => p.peerID !== userId));
            });

            socket.on('receiving-returned-signal', (payload) => {
                const item = peers.find((p) => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        });

    }, [roomId]);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new SimplePeer({
            initiator: true,
            trickle: false,
            stream
        });

        peer.on('signal', (signal) => {
            socket.emit('sending-signal', { userToSignal, callerID, signal });
        });

        return peer;
    }

    return (
        <div className="room">
            <video playsInline muted ref={myVideo} autoPlay className="my-video"></video>
            <div ref={videoGrid} className="video-grid">
                {peers.map((peerObj) => (
                    <VideoPlayer key={peerObj.peerID} peer={peerObj.peer} />
                ))}
            </div>
        </div>
    );
};

export default Room;
