/** Goes inside the text of every link that opens a new tab, so screen readers say so. */
export function NewTabHint() {
  return <span className="sr-only"> (opens in new tab)</span>;
}

export const NEW_TAB_SUFFIX = " (opens in new tab)";
