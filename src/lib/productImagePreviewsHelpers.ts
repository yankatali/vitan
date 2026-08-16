export const getImageKey = (image: File) => `${image.name}-${image.size}-${image.lastModified}`;
