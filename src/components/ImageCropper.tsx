"use client";

import Cropper from "react-easy-crop";
import { useCallback, useState } from "react";
import getCroppedImg from "@/utils/cropImage";
import type { Area } from "react-easy-crop";

interface ImageCropperProps {
  file: File;
  onCropDone: (cropped: File) => void;
}

const ImageCropper = ({ file, onCropDone }: ImageCropperProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCrop = async () => {
    if (!croppedAreaPixels) {
      console.warn("Cropping area is not ready yet.");
      return;
    }

    try {
      const croppedImage = await getCroppedImg(file, croppedAreaPixels);
      onCropDone(croppedImage);
    } catch (error) {
      console.error("Cropping failed:", error);
    }
  };

  return (
    <div className="relative w-full h-[400px] bg-gray-100 rounded overflow-hidden mb-4">
      {/* Cropper */}
      <Cropper
        image={URL.createObjectURL(file)}
        crop={crop}
        zoom={zoom}
        aspect={16 / 9}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
        cropShape="rect"
        showGrid={true}
      />

      {/* Zoom Slider */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-2/3">
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Crop Button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <button
          onClick={handleCrop}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          Crop Image
        </button>
      </div>
    </div>
  );
};

export default ImageCropper;
