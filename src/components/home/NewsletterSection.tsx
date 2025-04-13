
import { Button } from "@/components/ui/button";

const NewsletterSection = () => {
  return (
    <section className="bg-dark-300 rounded-xl p-8 md:p-12">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Stay Updated</h2>
        <p className="text-gray-400 mb-8">
          Subscribe to our newsletter for the latest concert announcements, festival lineups, and exclusive photography.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-grow px-4 py-3 rounded-md bg-dark-400 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          />
          <Button className="bg-white text-dark-500 hover:bg-gray-200 sm:w-auto">
            Subscribe
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
