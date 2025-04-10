// utils/cropImage.ts
import { Area } from "react-easy-crop";
import { getOrientation, readAndCompressImage } from "browser-image-resizer";

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed for cross-origin images
    image.src = url;
  });

const getCroppedImg = async (file: File, crop: Area): Promise<File> => {
  const imageDataUrl = URL.createObjectURL(file);
  const image = await createImage(imageDataUrl);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas context is null");

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        return reject(new Error("Canvas is empty"));
      }
      resolve(new File([blob], file.name, { type: file.type }));
    }, file.type);
  });
};

export default getCroppedImg;
