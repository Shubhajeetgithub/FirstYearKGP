import type { LucideIcon } from "lucide-react";

/** Key of a semester in {@link SemesterData}, e.g. `"s1"`. */
export type SemesterKey = string;

export interface Resource {
  name: string;
  /** Link to the resource; `"#"` when the sheet leaves it blank. */
  url: string;
  icon: LucideIcon;
}

export interface Subject {
  /** Course code, e.g. `"AI20203"`. Unique within a semester. */
  id: string;
  name: string;
  /** Image URL; empty string when the sheet has none. */
  image: string;
  semester: SemesterKey;
  semesterName: string;
  resources: Resource[];
}

export interface Semester {
  name: string;
  subjects: Subject[];
}

/** All semesters, keyed by {@link SemesterKey} and ordered numerically. */
export type SemesterData = Record<SemesterKey, Semester>;
