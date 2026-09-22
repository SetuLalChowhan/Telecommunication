import { apiClient } from "@/lib/api/axios";
import { ContactMessage, ContactMessageInput } from "../types";

/**
 * Submit a public contact / inquiry form.
 *
 * Succeeds for guests too — `POST /contacts` is a public endpoint.
 */
export async function submitContactMessage(
  input: ContactMessageInput
): Promise<ContactMessage> {
  const response = await apiClient.post("/contacts", input);
  const body = response.data;
  return (body?.data ?? body) as ContactMessage;
}
