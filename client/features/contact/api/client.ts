import { http } from "@/lib/api/client";
import { ContactMessage, ContactMessageInput } from "../types";

/**
 * Submit a public contact / inquiry form.
 *
 * Succeeds for guests too — `POST /contacts` is a public endpoint.
 */
export async function submitContactMessage(
  input: ContactMessageInput
): Promise<ContactMessage> {
  return http.post<ContactMessage>("/contacts", input);
}
