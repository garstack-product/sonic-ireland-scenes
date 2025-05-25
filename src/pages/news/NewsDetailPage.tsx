
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author?: string;
  date: string;
  category?: string;
  image_url?: string;
  tags?: string[];
  created_at: string;
}

const NewsDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsItem = async () => {
      if (!id) {
        setError('No news item ID provided');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('news_items')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          setError('News item not found');
        } else {
          setNewsItem(data);
        }
      } catch (err) {
        setError('Failed to load news item');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsItem();
  }, [id]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (error) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-white mb-4">News Item Not Found</h1>
          <p className="text-gray-400 mb-6">{error || 'The requested news item could not be found.'}</p>
          <Link to="/news">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to News
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/news">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to News
          </Button>
        </Link>
      </div>

      <article className="max-w-4xl mx-auto">
        {newsItem.image_url && (
          <div className="aspect-video overflow-hidden rounded-lg mb-8">
            <img 
              src={newsItem.image_url} 
              alt={newsItem.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <header className="mb-8">
          <div className="flex items-center text-sm text-gray-400 space-x-4 mb-4">
            <span className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDate(newsItem.date)}
            </span>
            {newsItem.category && (
              <span className="px-2 py-1 bg-dark-400 rounded text-xs">
                {newsItem.category}
              </span>
            )}
            {newsItem.author && (
              <span>By {newsItem.author}</span>
            )}
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">{newsItem.title}</h1>
          
          {newsItem.excerpt && (
            <p className="text-xl text-gray-300 leading-relaxed">
              {newsItem.excerpt}
            </p>
          )}
        </header>

        <div className="prose prose-lg prose-invert max-w-none">
          <div 
            className="text-gray-300 leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: newsItem.content }}
          />
        </div>

        {newsItem.tags && newsItem.tags.length > 0 && (
          <footer className="mt-8 pt-8 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {newsItem.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="px-3 py-1 bg-dark-400 text-gray-300 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </footer>
        )}
      </article>
    </div>
  );
};

export default NewsDetailPage;
