import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import * as params from "./params";

export async function setupModelFolder(gui) {
  // The model folder contains options for model selection.
  const modelFolder = gui.addFolder("Model");

  params.STATE.model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;

  showModelConfigs(modelFolder);

  modelFolder.open();

  return gui;
}

function showModelConfigs(folderController) {
  // Clean up model configs for the previous model.
  // The first constroller under the `folderController` is the model
  // selection.
  const fixedSelectionCount = 1;
  while (folderController.__controllers.length > fixedSelectionCount) {
    folderController.remove(
      folderController.__controllers[folderController.__controllers.length - 1]
    );
  }

  switch (params.STATE.model) {
    case faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh:
      addMediaPipeFaceMeshControllers(folderController);
      break;
    default:
      alert(`Model ${params.STATE.model} is not supported.`);
  }
}

// The MediaPipeFaceMesh model config folder contains options for
// MediaPipeFaceMesh config settings.
function addMediaPipeFaceMeshControllers(modelConfigFolder) {
  params.STATE.modelConfig = { ...params.MEDIAPIPE_FACE_CONFIG };

  const boundingBoxController = modelConfigFolder.add(
    params.STATE.modelConfig,
    "boundingBox"
  );
  boundingBoxController.onChange((_) => {
    params.STATE.isModelChanged = true;
  });

  const triangulateMeshController = modelConfigFolder.add(
    params.STATE.modelConfig,
    "triangulateMesh"
  );
  triangulateMeshController.onChange((_) => {
    params.STATE.isModelChanged = true;
  });

  const refineLandmarksController = modelConfigFolder.add(
    params.STATE.modelConfig,
    "refineLandmarks"
  );
  refineLandmarksController.onChange((_) => {
    params.STATE.isModelChanged = true;
  });

  const maxFacesController = modelConfigFolder
    .add(params.STATE.modelConfig, "maxFaces", 1, 10)
    .step(1);
  maxFacesController.onChange((_) => {
    // Set isModelChanged to true, so that we don't render any result during
    // changing models.
    params.STATE.isModelChanged = true;
  });
}
