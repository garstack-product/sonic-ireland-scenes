
// Get artist data from API
export const fetchArtistData = async (artistName: string) => {
  try {
    // In a real app, this would fetch from a music API like MusicBrainz, Spotify, etc.
    // For demo purposes, we'll return mock data with realistic URLs
    return {
      name: artistName,
      bio: `${artistName} is a renowned artist with a unique sound that blends various genres into an unforgettable musical experience.`,
      imageUrl: "https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=1470&auto=format&fit=crop",
      links: {
        website: artistName.toLowerCase().includes("primal") ? "https://www.primalscream.net/" : null,
        facebook: artistName.toLowerCase().includes("primal") ? "https://www.facebook.com/primalscreamofficial" : null,
        twitter: artistName.toLowerCase().includes("primal") ? "https://twitter.com/ScreamOfficial" : null,
        wikipedia: artistName.toLowerCase().includes("primal") ? "https://en.wikipedia.org/wiki/Primal_Scream" : null,
        instagram: null,
        spotify: null,
        youtube: null,
        itunes: null,
        musicbrainz: null
      }
    };
  } catch (error) {
    console.error("Error fetching artist data:", error);
    return null;
  }
};
