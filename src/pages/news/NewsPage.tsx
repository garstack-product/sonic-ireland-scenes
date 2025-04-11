
import { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock news data
const newsArticles = [
  {
    id: "n1",
    title: "Electric Picnic Announces 2025 Lineup",
    excerpt: "Ireland's biggest music festival reveals an impressive lineup for next year's event, featuring international headliners and local talent.",
    date: "April 5, 2025",
    imageUrl: "/placeholder.svg",
    category: "Festivals"
  },
  {
    id: "n2",
    title: "New Music Venue Opening in Galway",
    excerpt: "A state-of-the-art concert venue is set to open in Galway this summer, promising to bring more international acts to the west of Ireland.",
    date: "March 22, 2025",
    imageUrl: "/placeholder.svg",
    category: "Venues"
  },
  {
    id: "n3",
    title: "Exclusive Interview with Fontaines D.C.",
    excerpt: "We sat down with Dublin post-punk band Fontaines D.C. to discuss their upcoming album and Irish tour dates.",
    date: "March 10, 2025",
    imageUrl: "/placeholder.svg",
    category: "Interviews"
  },
  {
    id: "n4",
    title: "Longitude Festival Extends to Four Days",
    excerpt: "Popular Dublin festival announces extension to four days for 2025 edition with expanded lineup and new stage.",
    date: "February 28, 2025",
    imageUrl: "/placeholder.svg",
    category: "Festivals"
  }
];

const categories = ["All", "Festivals", "Concerts", "Interviews", "Venues", "Artists"];

const NewsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  const filteredArticles = newsArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === "All" || article.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <PageHeader 
        title="Music News" 
        subtitle="Stay updated with the latest news from Ireland's music scene"
      />
      
      <div className="mb-8">
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search news..."
            className="pl-10 bg-dark-300 border-gray-700 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button 
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className={activeCategory === category ? "" : "text-gray-400"}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      {filteredArticles.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No news articles found matching your search.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredArticles.map(article => (
            <article key={article.id} className="bg-dark-300 rounded-lg overflow-hidden hover-effect">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <div className="aspect-[4/3] md:h-full">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="p-6 md:w-2/3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-dark-200 rounded-full text-gray-300">
                      {article.category}
                    </span>
                    <span className="text-sm text-gray-400">{article.date}</span>
                  </div>
                  <h3 className="text-xl font-medium text-white mb-3">{article.title}</h3>
                  <p className="text-gray-300 mb-4">{article.excerpt}</p>
                  <Button variant="link" className="px-0 text-white hover:text-gray-300">
                    Read More
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsPage;
