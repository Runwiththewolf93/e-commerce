"use client";

/**
 * Renders a global error component.
 *
 * @param {Object} props - The properties for the component.
 * @param {Error} props.error - The error object.
 * @param {Function} props.reset - The reset function.
 * @return {JSX.Element} The rendered global error component.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}): JSX.Element {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
