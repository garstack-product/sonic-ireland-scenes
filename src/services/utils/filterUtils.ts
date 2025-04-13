
// List of sports genres/subgenres to filter out
export const SPORTS_GENRES = [
  'Rugby',
  'GAA',
  'Football',
  'Sports',
  'Basketball',
  'Soccer',
  'Baseball',
  'Hockey',
  'Cricket',
];

// Check if an event is a sports event
export const isSportsEvent = (event: any): boolean => {
  const genre = event.classifications?.[0]?.genre?.name || "";
  const subgenre = event.classifications?.[0]?.subGenre?.name || "";
  const segment = event.classifications?.[0]?.segment?.name || "";
  
  return SPORTS_GENRES.some(sportGenre => 
    genre.includes(sportGenre) || 
    subgenre.includes(sportGenre) || 
    segment.includes(sportGenre) ||
    segment === "Sports"
  );
};
