import "@tensorflow-models/face-detection";

import { Camera } from "./camera";
import { setupDatGui } from "./option_panel";
import { STATE, createDetector } from "./shared/params";

export class Face {
  detector;
  camera;
  startInferenceTime;
  numInferences = 0;
  inferenceTimeSum = 0;
  lastPanelUpdate = 0;
  rafId;

  async checkGuiUpdate() {
    if (STATE.isTargetFPSChanged || STATE.isSizeOptionChanged) {
      this.camera = await Camera.setupCamera(STATE.camera);
      STATE.isTargetFPSChanged = false;
      STATE.isSizeOptionChanged = false;
    }

    if (STATE.isModelChanged || STATE.isFlagChanged) {
      STATE.isModelChanged = true;

      window.cancelAnimationFrame(this.rafId);

      if (this.detector != null) {
        this.detector.dispose();
      }

      if (STATE.isFlagChanged) {
      }

      try {
        this.detector = await createDetector(STATE.model);
      } catch (error) {
        this.detector = null;
        alert(error);
      }

      STATE.isFlagChanged = false;
      STATE.isModelChanged = false;
    }
  }

  beginEstimateFaceStats() {
    this.startInferenceTime = (performance || Date).now();
  }

  endEstimateFaceStats() {
    const endInferenceTime = (performance || Date).now();
    this.inferenceTimeSum += endInferenceTime - this.startInferenceTime;
    ++this.numInferences;

    const panelUpdateMilliseconds = 1000;
    if (endInferenceTime - this.lastPanelUpdate >= panelUpdateMilliseconds) {
      // const averageInferenceTime = this.inferenceTimeSum / this.numInferences;
      this.inferenceTimeSum = 0;
      this.numInferences = 0;

      this.lastPanelUpdate = endInferenceTime;
    }
  }

  async renderResult() {
    if (this.camera.video.readyState < 2) {
      await new Promise((resolve) => {
        this.camera.video.onloadeddata = () => {
          resolve(this.video);
        };
      });
    }

    let faces = null;

    if (this.detector != null) {
      this.beginEstimateFaceStats();

      try {
        faces = await this.detector.estimateFaces(this.camera.video, {
          flipHorizontal: false,
        });
      } catch (error) {
        this.detector.dispose();
        this.detector = null;
        alert(error);
      }

      this.endEstimateFaceStats();
    }

    this.camera.drawCtx();

    if (faces && faces.length > 0 && !STATE.isModelChanged) {
      this.camera.drawResults(
        faces,
        STATE.modelConfig.triangulateMesh,
        STATE.modelConfig.boundingBox
      );
    }
  }

  async renderPrediction() {
    await this.checkGuiUpdate();

    if (!STATE.isModelChanged) {
      await this.renderResult();
    }

    this.rafId = requestAnimationFrame(() => this.renderPrediction());
  }

  async app() {
    await setupDatGui();

    this.camera = await Camera.setupCamera(STATE.camera);

    this.detector = await createDetector();

    this.renderPrediction();
  }
}
