export interface Country {
  country: string;
  methodology: string[];
  study_type: string[];
  value: number | null;
  currency: string | null;
  consultant?: string | null;
  description: string | null;
  number_of_routes: number | null;
  number_of_visits: number | null;
  number_of_surveys: number | null;
}
