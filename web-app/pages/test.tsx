import React, { useEffect, useState } from "react";
import JitsiMeetExternalAPI from 'react-jitsi';
import { JitsiMeeting } from '@jitsi/react-sdk';
 
export default function Test() {

  const [jitsi, setJitsi] = useState(null);

  function loadScript(url: string, async?: boolean): Promise<void> {
    let resolver: any = null;
  
    const onloadPromise = new Promise((resolve) => {
      resolver = resolve;
    });
  
    const script = document.createElement("script");
    script.src = url;
    if (async) {
      script.async = true;
    }
    script.onload = () => resolver();
    document.body.appendChild(script);
  
    return onloadPromise as Promise<void>;
  }

  const initialize = async () => {
     await loadScript("https://meet.jit.si/external_api.js", true);
     setJitsi(createMeet()); 
  };

  useEffect( () => {
    initialize();
  },[])
  
  const createMeet = () => {
    return new window.JitsiMeetExternalAPI("meet.jit.si", {
      parentNode: document.getElementById("jitsi-root"),
      roomName :"dd",
      userInfo: {
        displayName :"dd"
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_CHROME_EXTENSION_BANNER: false,
        SHOW_POWERED_BY: false,
      },
      configOverwrite: {
        disableSimulcast: false,
      },
    });
  };
  
  const containerStyle = {
    width: "100%",
    height: "100vh",
  };

  const jitsiContainerStyle = {
    width: "100%",
    height: "100%",
  };




  return (
    <>
    <div style={containerStyle}>
      <div id="jitsi-root" style={jitsiContainerStyle} />
    </div>
    </>
  );

}