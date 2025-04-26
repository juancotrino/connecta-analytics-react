import { Country } from './country';

export interface NewStudy {
  study_name: string;
  client: string;
  countries: Country[];
}

export interface StudyToEdit extends NewStudy {
  study_id: number;
  source: string;
}

export interface StudyTableData {
  client: string;
  country: string;
  creation_date: string;
  currency: string;
  description: string;
  last_update_date: string;
  methodology: string[];
  source: string;
  status: string;
  study_id: number; 
  study_name: string;
  study_type: string[];
  consultant: string;
  value: number;
  number_of_surveys: number;
  number_of_routes: number;
  number_of_visits: number;
};

export interface StudiesData {
  studies: StudyTableData[];
  total_studies: number;
  roles_authorized_columns: string[];
}
