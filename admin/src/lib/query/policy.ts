/**
 * The single client cache policy for the admin app.
 *
 * Admin data is operational and changes often, so nothing here is cached
 * aggressively. `staleTime` is how long a value is considered fresh; after that
 * it is refetched in the background on the next mount/focus.
 */
const SECOND = 1_000;
const MINUTE = 60_000;

export const CACHE = {
  /** Counts that change as users book and sign up. */
  dashboard: { staleTime: 30 * SECOND },
  /** Verification queues must reflect new submissions quickly. */
  doctors: { staleTime: 30 * SECOND },
  doctorDetail: { staleTime: 60 * SECOND },
  appointments: { staleTime: 30 * SECOND },
  users: { staleTime: MINUTE },
  patients: { staleTime: MINUTE },
  /** Editorial content changes rarely. */
  blogs: { staleTime: MINUTE },
  cms: { staleTime: 5 * MINUTE },
  contacts: { staleTime: MINUTE },
  settings: { staleTime: 5 * MINUTE },
  /** The session/profile rarely changes and is fetched on every route. */
  profile: { staleTime: 5 * MINUTE },
} as const;

export const DEFAULT_QUERY_STALE_TIME = 30 * SECOND;
