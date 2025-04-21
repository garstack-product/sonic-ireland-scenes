
import React from "react";
import { MapPin, ExternalLink, Home, Spotify, Instagram, Twitter } from "lucide-react";
import SocialIcons from "@/components/ui/SocialIcons";

interface VenueInfoSectionProps {
  event: any;
  venueData: any;
  isLoadingVenueEvents: boolean;
  venueEvents: any[];
  EventGrid: React.ComponentType<any>;
}

const VenueInfoSection: React.FC<VenueInfoSectionProps> = ({
  event,
  venueData,
  isLoadingVenueEvents,
  venueEvents,
  EventGrid,
}) => {
  // Extract venue image, fallback, etc.
  const venueImage =
    venueData?.images?.[0]?.url ||
    event?.venueData?.images?.[0]?.url ||
    "/placeholder.svg";

  // Extract social links from artist_links if present, fallback to venue
  const getVenueSocialLinks = () => {
    // 1. Artist Links
    let linksObj =
      event?.rawData?._embedded?.attractions?.[0]?.externalLinks ||
      event?.rawData?.artist_links ||
      event?.rawData?.artistLinks ||
      event?.artist_links ||
      null;
    // 2. Fallback to venue links
    const venueLinks = venueData?.externalLinks || {};
    // Only show these predefined icons if they exist
    const iconDefs = [
      {
        key: "homepage",
        name: "Homepage",
        field: "homepage",
        color: "#4a5568",
        icon: "home",
      },
      {
        key: "spotify",
        name: "Spotify",
        field: "spotify",
        color: "#1DB954",
        icon: "spotify",
      },
      {
        key: "instagram",
        name: "Instagram",
        field: "instagram",
        color: "#E1306C",
        icon: "instagram",
      },
      {
        key: "twitter",
        name: "Twitter",
        field: "twitter",
        color: "#1DA1F2",
        icon: "twitter",
      },
    ];
    
    // Use imported lucide-react icons instead of requiring them
    const iconMap = {
      home: <Home size={20} />,
      spotify: <Spotify size={20} />,
      instagram: <Instagram size={20} />,
      twitter: <Twitter size={20} />,
    };

    // Use artist_links first, fallback to venue links
    const linksSource = linksObj || venueLinks;
    if (!linksSource) return [];

    const links = iconDefs
      .map((def) => {
        let url;
        if (Array.isArray(linksSource[def.field])) {
          url = linksSource[def.field][0]?.url || linksSource[def.field][0];
        } else if (typeof linksSource[def.field] === "string") {
          url = linksSource[def.field];
        } else if (linksSource[def.field]?.url) {
          url = linksSource[def.field].url;
        }
        if (!url) return null;
        return {
          name: def.name,
          url,
          icon: iconMap[def.icon],
          color: def.color,
        };
      })
      .filter((x) => !!x);
    return links;
  };

  const venueSocialLinks = getVenueSocialLinks();

  return (
    <div>
      <h3 className="text-2xl text-white font-semibold mb-6">
        Venue Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="rounded-lg overflow-hidden mb-4">
            <img
              src={venueImage}
              alt={event.venue}
              className="w-full h-auto object-cover"
            />
          </div>
          {/* Social icons shown directly under the venue picture */}
          {venueSocialLinks.length > 0 && <SocialIcons links={venueSocialLinks} />}
        </div>
        <div className="md:col-span-2">
          <h4 className="text-lg text-white font-medium mb-3">
            {event.venue}
          </h4>
          {(venueData?.address?.line1 || venueData?.city?.name) && (
            <div className="flex items-start text-gray-300 mb-4">
              <MapPin className="h-5 w-5 mr-2 mt-0.5" />
              <div>
                {venueData?.address?.line1 && <p>{venueData.address.line1}</p>}
                {venueData?.city?.name && (
                  <p>
                    {venueData.city.name}
                    {venueData?.state?.stateCode &&
                      `, ${venueData.state.stateCode}`}
                    {venueData?.postalCode && ` ${venueData.postalCode}`}
                  </p>
                )}
                {venueData?.country?.name && (
                  <p>{venueData.country.name}</p>
                )}
              </div>
            </div>
          )}
          {venueData?.url && (
            <a
              href={venueData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Visit venue website
            </a>
          )}
          {venueData?.generalInfo && (
            <div className="mt-4">
              <h5 className="text-white font-medium mb-2">
                General Information
              </h5>
              <p className="text-gray-300">
                {venueData.generalInfo.generalRule}
              </p>
            </div>
          )}
          {isLoadingVenueEvents ? (
            <div className="mt-6">
              <p className="text-gray-400">
                Loading other events at this venue...
              </p>
            </div>
          ) : venueEvents.length > 0 ? (
            <div className="mt-6">
              <h4 className="text-lg text-white font-semibold mb-4">
                Other Events at This Venue
              </h4>
              <EventGrid events={venueEvents} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default VenueInfoSection;
