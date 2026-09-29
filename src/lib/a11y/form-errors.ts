/**
 * Field checks shared by the contact and newsletter forms. The forms turn off
 * the browser's own bubbles (noValidate) and show these messages in text under
 * the field instead, tied to it with aria-describedby.
 */
export type FieldErrors = Record<string, string>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function emailError(value: string): string | null {
  const v = value.trim();
  if (!v) return "Enter your email address.";
  if (!EMAIL.test(v)) return "Enter an email address like name@example.com.";
  return null;
}

export function requiredError(value: string, message: string): string | null {
  return value.trim() ? null : message;
}

/** Moves keyboard focus to the first field that has an error, in the order the fields appear. */
export function focusFirstError(form: HTMLFormElement, errors: FieldErrors) {
  for (const el of Array.from(form.elements)) {
    if (el instanceof HTMLElement && "name" in el && typeof el.name === "string" && errors[el.name]) {
      el.focus();
      return;
    }
  }
}
