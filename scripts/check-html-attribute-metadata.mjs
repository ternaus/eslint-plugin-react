import assert from 'node:assert/strict';

import {
  HTML5_ELEMENT_ATTRIBUTES,
  HTML5_GLOBAL_ATTRIBUTES,
  HTML5_METADATA_SOURCE,
} from '../lib/generated/html5-attributes.js';
import { getHtmlAttributeMetadata, HTML_ATTRIBUTE_METADATA_SOURCE } from './html-attribute-metadata.mjs';

const expected = getHtmlAttributeMetadata();

assert.equal(HTML5_METADATA_SOURCE, HTML_ATTRIBUTE_METADATA_SOURCE);
assert.deepEqual(HTML5_GLOBAL_ATTRIBUTES, expected.globalAttributes);
assert.deepEqual(HTML5_ELEMENT_ATTRIBUTES, expected.elements);

console.log('HTML attribute metadata check passed.');
