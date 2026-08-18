import { writeFile } from 'node:fs/promises';

import { GENERATED_METADATA_PATH, renderHtmlAttributeMetadata } from './html-attribute-metadata.mjs';

await writeFile(GENERATED_METADATA_PATH, renderHtmlAttributeMetadata());
console.log(`Updated ${GENERATED_METADATA_PATH}.`);
