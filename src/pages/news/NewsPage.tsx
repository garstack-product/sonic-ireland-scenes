
import { useState, useEffect } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, ChevronRightIcon, TagIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  tags: string[];
}

const NewsPage = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNewsItems = () => {
      setIsLoading(true);
      
      try {
        // Get news items from local storage
        const savedNews = localStorage.getItem('newsItems');
        
        if (savedNews) {
          const parsedNews = JSON.parse(savedNews);
          setNewsItems(parsedNews);
        } else {
          // Set sample news items if none in local storage
          const sampleNews: NewsItem[] = [
            {
              id: '1',
              title: 'Coldplay Announces 2025 Ireland Tour',
              excerpt: 'The British rock band has scheduled three concerts in Dublin as part of their world tour.',
              content: 'Coldplay has announced that they will perform at Croke Park in Dublin on August 30-31, 2025, as part of their new world tour. This will be their first performance in Ireland since 2017. Tickets will go on sale next month.',
              author: 'John Smith',
              date: '2025-03-15',
              category: 'Tour Announcements',
              imageUrl: '/placeholder.svg',
              tags: ['Coldplay', 'Tours', 'Rock', 'Dublin']
            },
            {
              id: '2',
              title: 'Electric Picnic 2025 Lineup Announced',
              excerpt: 'Festival organizers revealed the headliners for next year\'s event.',
              content: 'Electric Picnic organizers have announced the first wave of artists for the 2025 festival, which will take place from September 5-7 in Stradbally, Co. Laois. Headliners include Arcade Fire, The National, and Billie Eilish.',
              author: 'Jane Doe',
              date: '2025-03-10',
              category: 'Festivals',
              imageUrl: '/placeholder.svg',
              tags: ['Electric Picnic', 'Festivals', 'Music News']
            }
          ];
          
          setNewsItems(sampleNews);
          localStorage.setItem('newsItems', JSON.stringify(sampleNews));
        }
      } catch (error) {
        console.error('Error loading news items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNewsItems();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (error) {
      return dateString;
    }
  };

  // Sort news items by date (newest first)
  const sortedNewsItems = [...newsItems].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div>
      <PageHeader 
        title="News" 
        subtitle="The latest music news, announcements, and updates"
      />
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : sortedNewsItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No news items available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {sortedNewsItems.map((item) => (
            <Card key={item.id} className="bg-dark-300 border-gray-700 hover:bg-dark-400 transition-colors">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-center text-sm text-gray-400 space-x-4 mb-2">
                  <span className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(item.date)}
                  </span>
                  <span className="px-2 py-1 bg-dark-400 rounded text-xs">
                    {item.category}
                  </span>
                </div>
                <CardTitle className="text-xl text-white">{item.title}</CardTitle>
                <CardDescription className="text-gray-300">
                  {item.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 line-clamp-3">
                  {item.content}
                </p>
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 bg-dark-500 text-gray-300 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link 
                  to={`/news/${item.id}`} 
                  className="flex items-center text-primary hover:underline"
                >
                  Read more
                  <ChevronRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsPage;
