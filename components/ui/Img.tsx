import ExportedImage, { type ExportedImageProps } from 'next-image-export-optimizer';
import { BASE_PATH } from '@/lib/site';

/** The only place the image optimizer is referenced. Swap the implementation here if the pipeline changes. */
export function Img(props: ExportedImageProps) {
  return <ExportedImage basePath={BASE_PATH} {...props} />;
}
