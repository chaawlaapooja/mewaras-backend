type MediaInput = number | { id: number } | string;

const resolveMediaCount = (media: MediaInput | MediaInput[] | undefined): number => {
  if (!media) return 0;
  if (Array.isArray(media)) return media.length;
  if (typeof media === 'object' && 'set' in media) {
    const setValue = (media as { set?: MediaInput[] }).set;
    return Array.isArray(setValue) ? setValue.length : 0;
  }
  return 1;
};

const validateImages = (images: MediaInput | MediaInput[] | undefined) => {
  const count = resolveMediaCount(images);
  if (count < 1 || count > 5) {
    throw new Error('Products must have between 1 and 5 images.');
  }
};

const validateVideo = (video: MediaInput | MediaInput[] | null | undefined) => {
  if (!video) return;
  const count = resolveMediaCount(video);
  if (count > 1) {
    throw new Error('Products can have at most 1 video.');
  }
};

const validatePricing = (mrp?: number, discountedPrice?: number | null) => {
  if (mrp !== undefined && mrp < 0) {
    throw new Error('MRP must be greater than or equal to 0.');
  }
  if (discountedPrice != null && discountedPrice < 0) {
    throw new Error('Discounted price must be greater than or equal to 0.');
  }
  if (mrp != null && discountedPrice != null && discountedPrice > mrp) {
    throw new Error('Discounted price cannot exceed MRP.');
  }
};

export default {
  beforeCreate(event: { params: { data: Record<string, unknown> } }) {
    const { data } = event.params;
    validateImages(data.images as MediaInput | MediaInput[] | undefined);
    validateVideo(data.video as MediaInput | MediaInput[] | null | undefined);
    validatePricing(data.mrp as number | undefined, data.discountedPrice as number | null | undefined);
  },
  beforeUpdate(event: { params: { data: Record<string, unknown> } }) {
    const { data } = event.params;
    if ('images' in data) {
      validateImages(data.images as MediaInput | MediaInput[] | undefined);
    }
    if ('video' in data) {
      validateVideo(data.video as MediaInput | MediaInput[] | null | undefined);
    }
    if ('mrp' in data || 'discountedPrice' in data) {
      validatePricing(data.mrp as number | undefined, data.discountedPrice as number | null | undefined);
    }
  },
};
