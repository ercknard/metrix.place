//List of permitted mimes
const mimes = [
  {
    mime: 'image/jpeg',
    pattern: [0xff, 0xd8, 0xff],
    mask: [0xff, 0xff, 0xff],
    ext: '.jpg'
  },
  {
    mime: 'image/jpg',
    pattern: [0xff, 0xd8, 0xff],
    mask: [0xff, 0xff, 0xff],
    ext: '.jpg'
  },
  {
    mime: 'image/bmp',
    pattern: [0x42, 0x4d],
    mask: [0xff, 0xff],
    ext: '.bmp'
  },
  {
    mime: 'image/png',
    pattern: [0x89, 0x50, 0x4e, 0x47, 0x0d],
    mask: [0xff, 0xff, 0xff, 0xff, 0xff],
    ext: '.png'
  },
  {
    mime: 'image/gif',
    pattern: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
    mask: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
    ext: '.gif'
  },
  {
    mime: 'text/xml',
    pattern: [0x3c, 0x3f, 0x78, 0x6d, 0x6c],
    mask: [0xff, 0xff, 0xff, 0xff, 0xff],
    ext: '.svg'
  },
  {
    mime: 'model/gltf+json',
    pattern: [0x7b, 0x0a, 0x20, 0x20, 0x20, 0x20, 0x22],
    mask: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
    ext: '.gltf'
  },
  {
    mime: 'model/gltf-binary',
    pattern: [0x7b, 0x0a, 0x20, 0x20, 0x20, 0x20, 0x22],
    mask: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
    ext: '.gltf'
  },
  {
    mime: 'model/glb-binary',
    pattern: [0x67, 0x6c, 0x54, 0x46, 0x02],
    mask: [0xff, 0xff, 0xff, 0xff, 0xff],
    ext: '.glb'
  },
  {
    mime: 'model/glb+json',
    pattern: [0x67, 0x6c, 0x54, 0x46, 0x02],
    mask: [0xff, 0xff, 0xff, 0xff, 0xff],
    ext: '.glb'
  },
  {
    mike: 'audio/mpeg',
    pattern: [0x49, 0x44, 0x33],
    mask: [0xff, 0xff, 0xff],
    ext: '.mpg'
  },
  {
    mike: 'application/ogg',
    pattern: [0x4f, 0x67, 0x67, 0x53, 0x00],
    mask: [0xff, 0xff, 0xff, 0xff, 0xff],
    ext: '.ogg'
  },
  {
    mike: 'audio/wave',
    pattern: [
      0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45
    ],
    mask: [
      0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff
    ],
    ext: '.wav'
  },
  {
    mike: 'audio/mp4',
    pattern: [
      0x00, 0x00, 0x00, 0x00, 0x00, 0x66, 0x74, 0x79, 0x70, 0x6d, 0x70, 0x34
    ],
    mask: [
      0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff
    ],
    ext: '.mp4'
  },
  {
    mike: 'video/mp4',
    pattern: [
      0x00, 0x00, 0x00, 0x00, 0x00, 0x66, 0x74, 0x79, 0x70, 0x6d, 0x70, 0x34
    ],
    mask: [
      0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff
    ],
    ext: '.mp4'
  }
  // you can expand this list @see https://mimesniff.spec.whatwg.org/#matching-an-image-type-pattern
];

export function getMimeType(
  bytes: Uint8Array
): { mime: string; ext: string } | undefined {
  function check(mime: {
    mime?: string;
    pattern: any /* eslint-disable-line */;
    mask: any /* eslint-disable-line */;
  }):
    | {
        mime?: string | undefined;
        pattern: any /* eslint-disable-line */;
        mask: any /* eslint-disable-line */;
      }
    | undefined {
    for (let i = 0, l = mime.mask.length; i < l; ++i) {
      if ((bytes[i] & mime.mask[i]) - mime.pattern[i] === 0) {
        return mime;
      }
    }
    return undefined;
  }
  let _mime: undefined | any = undefined; /* eslint-disable-line */
  for (let i = 0, l = mimes.length; i < l; ++i) {
    _mime = check(mimes[i]);
    if (_mime) {
      break;
    }
  }
  if (_mime) {
    return { mime: _mime.mime, ext: _mime.ext };
  }
  return undefined;
}

export function isSupportedFile(bytes: Uint8Array): boolean {
  function check(mime: {
    mime?: string;
    pattern: any /* eslint-disable-line */;
    mask: any /* eslint-disable-line */;
  }) {
    for (let i = 0, l = mime.mask.length; i < l; ++i) {
      if ((bytes[i] & mime.mask[i]) - mime.pattern[i] === 0) {
        return true;
      }
    }
    return false;
  }
  let pass = false;
  for (let i = 0, l = mimes.length; i < l; ++i) {
    if (check(mimes[i])) {
      pass = true;
      break;
    }
  }
  return pass;
}
