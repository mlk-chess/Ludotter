import Head from 'next/head'
import HomeLayout from '@/components/layouts/Home'
// import {Peer} from "peerjs";
import {useEffect, useRef, useState} from "react";

export default function Home() {
    const [peerId, setPeerId] = useState('');
    const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
    const remoteVideoRef = useRef<any>(null);
    const currentUserVideoRef = useRef<any>(null);
    const peerInstance = useRef<any>(null);

    useEffect(() => {
        document.body.classList.add("bg-custom-light-orange");
    }, []);

    useEffect(() => {
        import('peerjs').then(({default: Peer}) => {

            const peer = new Peer();


            peer.on('open', (id) => {
                setPeerId(id)
            });

            peer.on('call', (call) => {
                let getUserMedia = navigator.mediaDevices.getUserMedia;

                getUserMedia({video: true, audio: true}).then((mediaStream: MediaStream) => {
                    if (currentUserVideoRef.current) {
                        currentUserVideoRef.current.srcObject = mediaStream;
                        currentUserVideoRef.current.play();
                    }
                    call.answer(mediaStream)
                    call.on('stream', function (remoteStream) {
                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = remoteStream;
                            remoteVideoRef.current.play();
                        }
                    });
                }).catch((error) => {
                    console.error('Error accessing media devices:', error);
                });
            })

            peerInstance.current = peer;
        })
    }, []);

    const call = (remotePeerId: any) => {
        var getUserMedia = navigator.mediaDevices.getUserMedia;

        getUserMedia({video: true, audio: true}).then((mediaStream: MediaStream) => {

            currentUserVideoRef.current.srcObject = mediaStream;
            currentUserVideoRef.current.play();

            const call = peerInstance.current.call(remotePeerId, mediaStream)

            call.on('stream', (remoteStream: any) => {
                remoteVideoRef.current.srcObject = remoteStream
                remoteVideoRef.current.play();
            });
        });
    }

    return (
        <>
            <Head>
                <title>Ludotter</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <HomeLayout>
                <p>Test</p>
                <h1>Current user id is {peerId}</h1>
                <input type="text" value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)}/>
                <button onClick={() => call(remotePeerIdValue)}>Call</button>
                <div>
                    <video ref={currentUserVideoRef}/>
                </div>
                <div>
                    <video ref={remoteVideoRef}/>
                </div>
            </HomeLayout>
        </>
    )
}