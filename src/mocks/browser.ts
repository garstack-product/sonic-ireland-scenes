
// Remove MSW setup since we're using Supabase
export const worker = {
  start: () => Promise.resolve(),
  stop: () => Promise.resolve(),
};
