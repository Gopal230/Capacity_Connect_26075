import HomePage from "./HomePage";

/**
 * Unified Grand Get Started Page.
 * Both / and /login render the comprehensive Grand Get Started portal,
 * dynamically respecting any ?role= query parameter.
 */
export default function LoginPage() {
  return <HomePage />;
}
