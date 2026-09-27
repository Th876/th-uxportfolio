import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
        <div style={{ fontSize: 28, letterSpacing: "0.08em" }}>TAHAYLIA HIGGINS</div>
        <div style={{ marginTop: 20, fontSize: 68, lineHeight: 1.05, maxWidth: 900 }}>
          Product designer in Atlanta.
        </div>
        <div style={{ marginTop: 24, fontSize: 28, color: "#6B625C" }}>
          I research, design, and build for real people.
        </div>
      </div>
    ),
    { ...size },
  );
}
