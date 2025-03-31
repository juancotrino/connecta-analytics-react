export interface StudyFileConfig {
  acronym: string;
  authorized_roles: string[];
  file_type: string;
  path: string;
};

export interface NewStudyFile {
  study_id: number;
  file_name: string;
  country: string;
  study_name: string;
  file: File;
}
