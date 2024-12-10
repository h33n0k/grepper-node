/**
 * Interface defining the available API endpoints.
 *
 * Fields:
 * - `base` (string): The base URL of the API (e.g., `https://api.grepper.com/v1/`).
 * - `search` (string): Endpoint for searching answers (e.g., `answers/search`).
 * - `answer` (string): Endpoint for retrieving or updating a specific answer (e.g., `answers`).
 */
export interface Endpoints {
	readonly base: string
	readonly search: string
	readonly answer: string
}

/**
 * Type representing the available endpoints excluding the base URL.
 *
 * This type is useful for defining operations specific to individual API endpoints,
 * such as `search` or `answer`, while excluding operations for the `base` URL.
 *
 * Example usage:
 * ```
 * const endpoint: Endpoint = 'search'; // Valid
 * const endpoint: Endpoint = 'base';   // Invalid
 * ```
 */
export type Endpoint = keyof Omit<Endpoints, 'base'>

/**
 * Interface for configuring the client instance.
 *
 * Fields:
 * - `api_key` (string, required): API key used for authentication. It is encoded in the `Authorization` header.
 * - `headers` (optional Record<string, string>): Additional HTTP headers to include in requests.
 *   Example:
 *   ```
 *   { 'Custom-Header': 'value' }
 *   ```
 * - `base_url` (optional string): Base URL of the API. Defaults to `https://api.grepper.com/v1/`.
 *
 * Authentification:
 * @see https://www.grepper.com/app/settings-account.php
 *
 * Example usage:
 * ```
 * const options: ClientOptions = {
 *   api_key: 'your_api_key',
 *   headers: { 'Custom-Header': 'value' },
 *   base_url: 'https://api.custom.com/v1/'
 * };
 * ```
 */
export interface ClientOptions {
	api_key: string
	headers?: Record<string, string>
	base_url?: string
}
