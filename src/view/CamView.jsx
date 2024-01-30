import React from "react";
import { Face } from "../util";

export const CamView = () => {
  React.useEffect(() => {
    const face = new Face();
    face.app();
  }, []);

  return (
    <div className="canvas-wrapper" style={{ position: "relative" }}>
      <canvas id="output"></canvas>
      <video
        id="video"
        playsInline
        style={{
          WebkitTransform: "scaleX(-1)",
          transform: "scaleX(-1)",
          display: "none",
          width: "auto",
          height: "auto",
        }}
      ></video>
      {/* <div ref={figures}></div>
      <video
        autoPlay
        playsInline
        muted={true}
        preload="metadata"
        ref={camera}
        width="870"
        height="534"
        style={{ transform: "scaleX(-1)" }}
      /> */}
    </div>
  );
};
