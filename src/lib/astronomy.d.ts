// Type shim for astronomy-engine dynamic import
declare module 'astronomy-engine' {
  export class Observer {
    constructor(latitude: number, longitude: number, height: number);
  }
  export function MakeTime(date: Date): AstroTime;
  export function Equator(body: Body, time: AstroTime, observer: Observer, ofDate: boolean, aberration: boolean): EquatorialCoordinates;
  export function Horizon(time: AstroTime, observer: Observer, ra: number, dec: number, refraction: string): HorizontalCoordinates;
  export function Illumination(body: Body, time: AstroTime): IlluminationInfo;

  export interface AstroTime { date: Date; }
  export interface EquatorialCoordinates { ra: number; dec: number; dist: number; }
  export interface HorizontalCoordinates { azimuth: number; altitude: number; }
  export interface IlluminationInfo { mag: number; }

  export enum Body {
    Sun = 'Sun',
    Moon = 'Moon',
    Mercury = 'Mercury',
    Venus = 'Venus',
    Earth = 'Earth',
    Mars = 'Mars',
    Jupiter = 'Jupiter',
    Saturn = 'Saturn',
    Uranus = 'Uranus',
    Neptune = 'Neptune',
    Pluto = 'Pluto',
  }
}
