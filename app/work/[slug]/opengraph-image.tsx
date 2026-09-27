import { ImageResponse } from "next/og";
import { getCaseStudy } from "@/lib/case-studies";

export const alt = "Case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function CaseStudyOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  const project = study?.frontmatter.project ?? "Case study";
  const title = study?.frontmatter.comingSoon
    ? "Case study coming soon"
    : (study?.frontmatter.title ?? "Case study");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#FBF6F1",
          color: "#1C1A17",
          padding: "72px",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: "0.08em" }}>{project.toUpperCase()}</div>
        <div style={{ marginTop: 20, fontSize: 60, lineHeight: 1.08, maxWidth: 980 }}>{title}</div>
      </div>
    ),
    { ...size },
  );
}
