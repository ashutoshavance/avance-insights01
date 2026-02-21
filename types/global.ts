import { StrapiData, StrapiImage } from './strapi';

export interface GlobalAttributes {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  logo: StrapiImage;
  favicon: StrapiImage;
  socialLinks: {
    platform: string;
    url: string;
  }[];
}

export type StrapiGlobal = StrapiData<GlobalAttributes>;

export interface GlobalSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  logoUrl: string;
  socialLinks: {
    platform: string;
    url: string;
  }[];
}
