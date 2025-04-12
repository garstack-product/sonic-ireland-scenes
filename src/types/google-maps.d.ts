
// Type definitions for Google Maps API
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement, options?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      getCenter(): LatLng;
      setZoom(zoom: number): void;
      getZoom(): number;
      setFog(options: FogOptions): void;
      panTo(latLng: LatLng | LatLngLiteral): void;
      easeTo(options: EaseToOptions): void;
      addControl(control: any, position?: string): void;
      addListener(eventName: string, handler: Function): MapsEventListener;
      on(eventName: string, handler: Function): MapsEventListener;
      remove(): void;
    }

    class Marker {
      constructor(options?: MarkerOptions);
      setPosition(latLng: LatLng | LatLngLiteral): void;
      getPosition(): LatLng;
      setMap(map: Map | null): void;
      getMap(): Map | null;
      setTitle(title: string): void;
      getTitle(): string;
      setIcon(icon: string | Icon | Symbol): void;
      getIcon(): string | Icon | Symbol;
      addListener(eventName: string, handler: Function): MapsEventListener;
    }

    class NavigationControl {
      constructor(options?: NavigationControlOptions);
    }

    interface NavigationControlOptions {
      visualizePitch?: boolean;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      styles?: any[];
      projection?: string;
      pitch?: number;
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map | null;
      title?: string;
      icon?: string | Icon | Symbol;
    }

    interface LatLng {
      lat(): number;
      lng(): number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface EaseToOptions {
      center?: LatLng | LatLngLiteral;
      duration?: number;
      easing?: Function;
    }

    interface FogOptions {
      color?: string;
      'high-color'?: string;
      'horizon-blend'?: number;
    }

    interface Icon {
      url?: string;
      size?: Size;
      scaledSize?: Size;
      origin?: Point;
      anchor?: Point;
    }

    interface Symbol {
      path: SymbolPath | string;
      scale?: number;
      fillColor?: string;
      fillOpacity?: number;
      strokeWeight?: number;
      strokeColor?: string;
    }

    interface Size {
      width: number;
      height: number;
    }

    interface Point {
      x: number;
      y: number;
    }

    enum SymbolPath {
      CIRCLE,
      BACKWARD_CLOSED_ARROW,
      FORWARD_CLOSED_ARROW,
      BACKWARD_OPEN_ARROW,
      FORWARD_OPEN_ARROW
    }

    interface MapsEventListener {
      remove(): void;
    }
  }
}

// Add initMap to Window interface
interface Window {
  initMap: () => void;
}
