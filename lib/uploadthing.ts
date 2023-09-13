// This file will only need generateReactHelpers which will
// be used to generate the useUploadThing hook and the uploadFiles
// Functions

import { generateReactHelpers } from "@uploadthing/react/hooks";
 
import type { OurFileRouter } from '@/app/api/uploadthing/core';

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();