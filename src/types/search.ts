/**
 * Minimal shape the search utilities can score. Fields are optional and nullable because the
 * search tolerates incomplete entries (a missing name scores as an empty name, a missing id
 * drops the entry).
 */
export interface SearchableSubject {
  id?: string | number | null;
  name?: string | null;
  semester?: string;
  semesterName?: string;
}

/** A semester as accepted by the search: its subjects array may be missing or contain holes. */
export interface SearchableSemester<S extends SearchableSubject> {
  name?: string | null;
  subjects?: readonly (S | null | undefined)[] | null;
}

export type SearchableSemesterMap<S extends SearchableSubject> = Readonly<
  Record<string, SearchableSemester<S> | null | undefined>
>;

/** Subjects to search: a flat list, or a semester map such as `SemesterData`. */
export type SubjectSource<S extends SearchableSubject> =
  | readonly (S | null | undefined)[]
  | SearchableSemesterMap<S>
  | null
  | undefined;

/** A subject flattened out of a semester map, annotated with the semester it came from. */
export type WithSemester<S extends SearchableSubject> = S & {
  semester: string;
  semesterName: string;
};

export type MatchedOn = "id" | "name" | "acronym";

export interface SubjectDistance {
  /** Lower is a closer match. `Infinity` for an empty query. */
  distance: number;
  matchedOn: MatchedOn;
}

export interface DistanceOptions {
  /** Score first-letter acronyms of the name too. Defaults to `true`. */
  considerAcronyms?: boolean;
}

export interface SearchOptions extends DistanceOptions {
  /** Always return at least this many results (fuzzy ones included). Defaults to `limit`. */
  minResults?: number;
}

/** A search hit: the original subject plus its relevance metadata. */
export type SearchResult<S extends SearchableSubject> = S & {
  _distance: number;
  _matchedOn: MatchedOn;
};
