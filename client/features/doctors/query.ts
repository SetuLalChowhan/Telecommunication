import type { DoctorQueryParams } from "./types";

/**
 * One serialization of the doctor list filters, shared by the browser client
 * and the server fetcher. Keeping it in one place is what makes the prefetched
 * cache entry and the client query key refer to the same request.
 */
export function buildDoctorQuery(
  params?: DoctorQueryParams
): Record<string, string | number> {
  const query: Record<string, string | number> = {};

  if (params?.search?.trim()) query.search = params.search.trim();
  if (params?.specialtySlug) query.specialtySlug = params.specialtySlug;
  if (params?.minFee !== undefined) query.minFee = params.minFee;
  if (params?.maxFee !== undefined) query.maxFee = params.maxFee;

  const experience =
    params?.minExperience ??
    (params?.experience !== undefined && params.experience !== ""
      ? Number(params.experience)
      : undefined);
  if (experience !== undefined && !Number.isNaN(experience)) {
    query.minExperience = experience;
  }

  if (params?.sortBy) query.sortBy = params.sortBy;

  query.page = params?.page ?? 1;
  query.limit = params?.limit ?? 6;

  return query;
}
