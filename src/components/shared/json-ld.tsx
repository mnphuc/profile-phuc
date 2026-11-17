type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

/** Chèn structured data (schema.org); escape "<" để không thể phá thẻ script. */
export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
