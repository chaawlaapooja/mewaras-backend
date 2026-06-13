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

const validateHeroImages = (heroImages: MediaInput | MediaInput[] | undefined) => {
  const count = resolveMediaCount(heroImages);
  if (count !== 6) {
    throw new Error('Hero section requires exactly 6 images.');
  }
};

export default {
  beforeCreate(event: { params: { data: Record<string, unknown> } }) {
    validateHeroImages(event.params.data.heroImages as MediaInput | MediaInput[] | undefined);
  },
  beforeUpdate(event: { params: { data: Record<string, unknown> } }) {
    if ('heroImages' in event.params.data) {
      validateHeroImages(event.params.data.heroImages as MediaInput | MediaInput[] | undefined);
    }
  },
};
