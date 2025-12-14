export interface CameraAttribute {
  OBJECTID: number;
  IMAGEURL: string;
  MAINROAD: string;
  CROSSROAD?: string;
  DIRECTION1?: string;
}

export interface CameraFeature {
  attributes: CameraAttribute;
  geometry?: {
    x: number;
    y: number;
  };
}

export interface CameraData {
  features: CameraFeature[];
}
