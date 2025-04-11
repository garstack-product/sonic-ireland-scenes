
import PageHeader from "@/components/ui/PageHeader";

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="About SonicShots"
        subtitle="Dedicated to documenting Ireland's vibrant music scene through photography and journalism"
      />
      
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed">
            SonicShots aims to be the definitive resource for concert and festival photography and information in Ireland. 
            We're passionate about capturing the energy, emotion, and artistry of live music performances, 
            while also providing a comprehensive guide to upcoming events throughout the country.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">The Photographer</h2>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/3">
              <div className="aspect-square rounded-lg overflow-hidden">
                <img 
                  src="/placeholder.svg" 
                  alt="Photographer" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <p className="text-gray-300 leading-relaxed mb-4">
                With over a decade of experience photographing live music events, our lead photographer has developed 
                a distinctive style that captures not just the artists, but the atmosphere and energy of each unique performance.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Having worked with major publications and directly with artists, we bring professional expertise and 
                an insider's perspective to each event we cover. Our work has been featured in national media outlets 
                and used by artists from around the world.
              </p>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Our Approach</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-300 p-6 rounded-lg">
              <h3 className="text-xl font-medium text-white mb-3">Authentic</h3>
              <p className="text-gray-400">
                We focus on capturing genuine moments that tell the story of each performance. 
                No excessive editing or manipulation—just authentic, emotional imagery.
              </p>
            </div>
            <div className="bg-dark-300 p-6 rounded-lg">
              <h3 className="text-xl font-medium text-white mb-3">Comprehensive</h3>
              <p className="text-gray-400">
                Beyond just beautiful photos, we provide detailed event information and thoughtful 
                reviews that give context and insight to the Irish music scene.
              </p>
            </div>
            <div className="bg-dark-300 p-6 rounded-lg">
              <h3 className="text-xl font-medium text-white mb-3">Connected</h3>
              <p className="text-gray-400">
                With strong relationships throughout the industry, we're able to access and 
                document events from a privileged perspective.
              </p>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
          <p className="text-gray-300 mb-6">
            For inquiries about event coverage, collaborations, or to license photographs, please get in touch:
          </p>
          <div className="bg-dark-300 p-6 rounded-lg">
            <p className="text-gray-300 mb-2"><strong className="text-white">Email:</strong> info@sonicshots.com</p>
            <p className="text-gray-300 mb-2"><strong className="text-white">Instagram:</strong> @sonicshotsireland</p>
            <p className="text-gray-300"><strong className="text-white">Twitter:</strong> @sonicshotsie</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
