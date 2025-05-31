
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const NavMenu = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Listings</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
              <NavigationMenuLink asChild>
                <Link
                  to="/listings/concerts"
                  className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  )}
                >
                  <div className="text-sm font-medium leading-none">Concerts</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Browse upcoming concerts and live music events
                  </p>
                </Link>
              </NavigationMenuLink>
              
              <NavigationMenuLink asChild>
                <Link
                  to="/listings/just-announced"
                  className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  )}
                >
                  <div className="text-sm font-medium leading-none">Just Announced</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Recently announced concerts and events
                  </p>
                </Link>
              </NavigationMenuLink>

              <div className="space-y-2">
                <h4 className="text-sm font-medium leading-none mb-3">Festivals</h4>
                <NavigationMenuLink asChild>
                  <Link
                    to="/listings/festivals/ireland"
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    )}
                  >
                    <div className="text-sm font-medium leading-none">Ireland</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Music festivals in Ireland and Northern Ireland
                    </p>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    to="/listings/festivals/uk"
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    )}
                  >
                    <div className="text-sm font-medium leading-none">United Kingdom</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Music festivals across the UK
                    </p>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    to="/listings/festivals/france"
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    )}
                  >
                    <div className="text-sm font-medium leading-none">France</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Music festivals in France
                    </p>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    to="/listings/festivals/germany"
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    )}
                  >
                    <div className="text-sm font-medium leading-none">Germany</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Music festivals in Germany
                    </p>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    to="/listings/festivals/netherlands"
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    )}
                  >
                    <div className="text-sm font-medium leading-none">Netherlands</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Music festivals in the Netherlands
                    </p>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    to="/listings/festivals/spain"
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    )}
                  >
                    <div className="text-sm font-medium leading-none">Spain</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Music festivals in Spain
                    </p>
                  </Link>
                </NavigationMenuLink>
              </div>
              
              <NavigationMenuLink asChild>
                <Link
                  to="/listings/map"
                  className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  )}
                >
                  <div className="text-sm font-medium leading-none">Map</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Explore events on an interactive map
                  </p>
                </Link>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Reviews</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
              <NavigationMenuLink asChild>
                <Link
                  to="/reviews/concerts"
                  className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  )}
                >
                  <div className="text-sm font-medium leading-none">Concerts</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Read reviews of recent concerts and performances
                  </p>
                </Link>
              </NavigationMenuLink>
              
              <NavigationMenuLink asChild>
                <Link
                  to="/reviews/festivals"
                  className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  )}
                >
                  <div className="text-sm font-medium leading-none">Festivals</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    Festival reviews and coverage
                  </p>
                </Link>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/news" className={navigationMenuTriggerStyle()}>
            News
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/about" className={navigationMenuTriggerStyle()}>
            About
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavMenu;
