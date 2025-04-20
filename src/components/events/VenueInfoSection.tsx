
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface VenueInfoSectionProps {
  event: any;
  venueData: any;
  isLoadingVenueEvents: boolean;
  venueEvents: any[];
  EventGrid: React.ComponentType<{ events: any[] }>;
}

const VenueInfoSection: React.FC<VenueInfoSectionProps> = ({
  event,
  venueData,
  isLoadingVenueEvents,
  venueEvents,
  EventGrid
}) => {
  const venueAddress = event.address || venueData?.address?.line1 || "";
  const venueCity = event.city || venueData?.city?.name || "";
  const venueState = venueData?.state?.name || "";
  const venueCountry = venueData?.country?.name || "";
  const venuePostalCode = venueData?.postalCode || "";
  const venueUrl = venueData?.url || "";
  const venuePhoneNumber = venueData?.phoneNumber || "";
  const venueAccessibility = venueData?.accessibleSeatingDetail || "";
  const venueParkingInfo = venueData?.parkingDetail || "";
  const venueGeneralInfo = venueData?.generalInfo?.generalRule || "";
  // priceRange stays in event
  return (
    <>
      <h3 className="text-2xl text-white font-semibold mb-6">Venue Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-dark-400 p-6 rounded-lg">
          <h4 className="text-lg text-white font-medium mb-4">{event.venue}</h4>
          {venueAddress && <p className="text-gray-300 mb-2">{venueAddress}</p>}
          {venueCity && <p className="text-gray-300 mb-1">{venueCity}{venueState ? `, ${venueState}` : ''}</p>}
          {venuePostalCode && <p className="text-gray-300 mb-1">{venuePostalCode}</p>}
          {venueCountry && <p className="text-gray-300 mb-4">{venueCountry}</p>}
          {venuePhoneNumber && (
            <div className="mt-4">
              <h5 className="text-white font-medium mb-2">Contact</h5>
              <p className="text-gray-300">{venuePhoneNumber}</p>
            </div>
          )}
          {venueUrl && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => window.open(venueUrl, '_blank')}
              >
                <ExternalLink size={16} className="mr-2" />
                Visit Venue Website
              </Button>
            </div>
          )}
          {event.priceRange && (
            <div className="mt-6">
              <h5 className="text-white font-medium mb-2">Ticket Price</h5>
              <p className="text-gray-300">{event.priceRange}</p>
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <div className="bg-dark-400 rounded-lg overflow-hidden h-80">
            <iframe
              title="Venue Location"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/place?key=${window.API_KEYS?.googleMaps}&q=${encodeURIComponent(event.venue + (event.city ? ', ' + event.city : ''))}`}
            ></iframe>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {venueAccessibility && (
              <div className="bg-dark-400 p-4 rounded-lg">
                <h5 className="text-white font-medium mb-2">Accessibility</h5>
                <p className="text-gray-300 text-sm">{venueAccessibility}</p>
              </div>
            )}
            {venueParkingInfo && (
              <div className="bg-dark-400 p-4 rounded-lg">
                <h5 className="text-white font-medium mb-2">Parking</h5>
                <p className="text-gray-300 text-sm">{venueParkingInfo}</p>
              </div>
            )}
            {venueGeneralInfo && (
              <div className="bg-dark-400 p-4 rounded-lg md:col-span-2">
                <h5 className="text-white font-medium mb-2">Venue Rules</h5>
                <p className="text-gray-300 text-sm">{venueGeneralInfo}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {venueEvents.length > 0 && (
        <div className="md:col-span-3 mt-8">
          <h3 className="text-2xl text-white font-semibold mb-6">More Events at {event.venue}</h3>
          {isLoadingVenueEvents ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : (
            <EventGrid events={venueEvents} />
          )}
        </div>
      )}
    </>
  );
};

export default VenueInfoSection;
