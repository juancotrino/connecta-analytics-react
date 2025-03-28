import { Country } from './country';

export interface NewStudy {
  study_name: string;
  client: string;
  countries: Country[];
}

export interface StudyTableData {
  client: string;
  country: string[];
  creation_date: string;
  currency: string;
  description: string;
  last_update_date: string;
  methodology: string;
  source: string;
  status: string;
  study_id: number; 
  study_name: string;
  study_type: string;
  consultant: string;
  value: number;
};

export interface StudiesData {
  studies: StudyTableData[];
  total_studies: number;
}
