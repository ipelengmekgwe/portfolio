import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import { cv, formatRange } from "@/lib/cv";

/* ────────────────────────────────────────────────────────────────────────────
   CV PDF — generated from content/cv.json at request time and served from
   /cv. Quiet companion to the book site: ivory paper, ink + rust headings,
   gold accent rules. Built-in PDF fonts only.
   ──────────────────────────────────────────────────────────────────────────── */

const palette = {
  paper: "#F5EFE0",
  ink: "#1A1A1A",
  inkSoft: "#3A3A3A",
  inkFaint: "#8A8A8A",
  rust: "#A63D2A",
  gold: "#B08D57",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: palette.paper,
    color: palette.ink,
    paddingTop: 44,
    paddingBottom: 40,
    paddingLeft: 44,
    paddingRight: 44,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.45,
  },

  // Header
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  nameBlock: { flex: 1 },
  name: {
    fontFamily: "Times-Bold",
    fontSize: 28,
    color: palette.rust,
    letterSpacing: -0.4,
    lineHeight: 1.15,
    marginBottom: 4,
  },
  title: {
    fontFamily: "Times-Italic",
    fontSize: 13,
    color: palette.inkSoft,
    lineHeight: 1.3,
  },
  contact: { fontSize: 9, color: palette.inkSoft, textAlign: "right" },
  contactLine: { marginBottom: 2, lineHeight: 1.4 },
  contactPrefix: {
    fontFamily: "Courier-Bold",
    color: palette.rust,
    letterSpacing: 1,
  },
  contactLink: { color: palette.inkSoft, textDecoration: "none" },

  rule: {
    height: 0.8,
    backgroundColor: palette.gold,
    marginTop: 18,
    marginBottom: 14,
  },

  // Section
  section: { marginBottom: 16 },
  sectionHeading: {
    fontFamily: "Times-Bold",
    fontSize: 11,
    color: palette.rust,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  sectionRule: {
    height: 0.5,
    backgroundColor: palette.inkFaint,
    marginBottom: 8,
    width: 60,
  },

  summary: { fontSize: 10.5, lineHeight: 1.55, color: palette.inkSoft },

  // Role
  role: { marginBottom: 14 },
  roleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  roleTitle: { fontFamily: "Times-Bold", fontSize: 11.5, color: palette.ink },
  roleCompany: { fontFamily: "Times-Italic", fontSize: 11, color: palette.inkSoft },
  roleRange: {
    fontSize: 9,
    color: palette.inkFaint,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  roleSummary: {
    fontSize: 10,
    lineHeight: 1.45,
    marginTop: 2,
    marginBottom: 5,
    color: palette.inkSoft,
  },
  bullet: {
    fontSize: 10,
    lineHeight: 1.45,
    marginBottom: 2.5,
    paddingLeft: 10,
    textIndent: -10,
  },
  stack: {
    fontSize: 8.5,
    color: palette.inkFaint,
    marginTop: 5,
    fontFamily: "Courier",
    lineHeight: 1.4,
  },

  // Lower two-column block
  twoCol: { flexDirection: "row", gap: 24 },
  col: { flex: 1 },

  skillBucket: { marginBottom: 6 },
  skillLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: palette.ink,
    marginBottom: 2,
  },
  skillItems: { fontSize: 10, color: palette.inkSoft, lineHeight: 1.5 },

  entryBlock: { marginBottom: 8 },
  entryHead: { fontFamily: "Times-Bold", fontSize: 10, lineHeight: 1.35 },
  entryItalic: {
    fontFamily: "Times-Italic",
    fontSize: 9.5,
    color: palette.inkSoft,
    lineHeight: 1.4,
  },
  entryMeta: {
    fontSize: 8.5,
    color: palette.inkFaint,
    letterSpacing: 0.4,
    lineHeight: 1.4,
  },
  entryNote: {
    fontSize: 9,
    color: palette.inkSoft,
    lineHeight: 1.4,
    marginTop: 1,
  },

  continued: {
    position: "absolute",
    top: 18,
    left: 44,
    right: 44,
    textAlign: "right",
    fontSize: 8,
    color: palette.inkFaint,
    fontFamily: "Courier",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  footer: {
    position: "absolute",
    bottom: 18,
    left: 44,
    right: 44,
    textAlign: "center",
    fontSize: 8,
    color: palette.inkFaint,
    fontFamily: "Courier",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});

export function CVDocument() {
  return (
    <Document
      title={`${cv.person.name} — CV`}
      author={cv.person.name}
      subject="Curriculum Vitae"
      keywords="software engineering, .NET, C#, Cape Town"
    >
      <Page size="A4" style={styles.page} wrap>
        <Text
          fixed
          style={styles.continued}
          render={({ pageNumber }) =>
            pageNumber > 1 ? `continued ·  page ${pageNumber}` : ""
          }
        />
        <Header />
        <View style={styles.rule} />

        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Profile</Text>
          <View style={styles.sectionRule} />
          <Text style={styles.summary}>{cv.summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Experience</Text>
          <View style={styles.sectionRule} />
          {cv.experience.map((role) => (
            <Role key={`${role.company}-${role.start}`} role={role} />
          ))}
        </View>

        <View style={styles.twoCol} break>
          <View style={styles.col}>
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Skills</Text>
              <View style={styles.sectionRule} />
              {Object.entries(cv.skills).map(([bucket, items]) => (
                <View key={bucket} style={styles.skillBucket}>
                  <Text style={styles.skillLabel}>{bucket}</Text>
                  <Text style={styles.skillItems}>{items.join(" · ")}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.col}>
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Education</Text>
              <View style={styles.sectionRule} />
              {cv.education.map((entry) => (
                <View
                  key={`${entry.year}-${entry.institution}`}
                  style={styles.entryBlock}
                >
                  <Text style={styles.entryHead}>{entry.credential}</Text>
                  <Text style={styles.entryItalic}>{entry.institution}</Text>
                  <Text style={styles.entryMeta}>
                    {entry.year}
                    {entry.status === "in-progress" ? "  ·  in progress" : ""}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Certifications</Text>
              <View style={styles.sectionRule} />
              {cv.certifications.map((cert) => (
                <View key={cert.name} style={styles.entryBlock}>
                  <Text style={styles.entryHead}>{cert.name}</Text>
                  <Text style={styles.entryItalic}>Issued by {cert.issuer}</Text>
                  {cert.note ? (
                    <Text style={styles.entryNote}>{cert.note}</Text>
                  ) : null}
                  {cert.verifyUrl ? (
                    <Link
                      src={cert.verifyUrl}
                      style={{
                        fontSize: 8.5,
                        color: palette.rust,
                        marginTop: 2,
                      }}
                    >
                      Verify credential ↗
                    </Link>
                  ) : null}
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Awards</Text>
              <View style={styles.sectionRule} />
              {cv.awards.map((award) => (
                <View key={award.title} style={styles.entryBlock}>
                  <Text style={styles.entryHead}>{award.title}</Text>
                  <Text style={styles.entryMeta}>
                    {award.year}
                    {award.status === "nominated" ? "  ·  nominated" : ""}
                    {award.status === "won" ? "  ·  winner" : ""}
                  </Text>
                  <Text style={styles.entryNote}>{award.description}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <Text style={styles.footer} fixed>
          {cv.person.name}  ·  {cv.person.title}  ·  {cv.person.location}
        </Text>
      </Page>
    </Document>
  );
}

function Header() {
  const websiteUrl = cv.person.links.website ?? "";
  const websiteDisplay = websiteUrl
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  const websiteHref =
    websiteUrl && !/^https?:\/\//.test(websiteUrl)
      ? `https://${websiteUrl}`
      : websiteUrl;
  const githubDisplay = cv.person.links.github
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  const phoneDigits = cv.person.phone.replace(/\s+/g, "");

  return (
    <View style={styles.headerRow}>
      <View style={styles.nameBlock}>
        <Text style={styles.name}>{cv.person.name}</Text>
        <Text style={styles.title}>{cv.person.title}</Text>
      </View>
      <View style={styles.contact}>
        <ContactLine
          prefix="E"
          value={cv.person.email}
          href={`mailto:${cv.person.email}`}
        />
        <ContactLine
          prefix="T"
          value={cv.person.phone}
          href={`tel:${phoneDigits}`}
        />
        <ContactLine prefix="L" value={cv.person.location} />
        <ContactLine
          prefix="G"
          value={githubDisplay}
          href={cv.person.links.github}
        />
        {websiteDisplay ? (
          <ContactLine prefix="W" value={websiteDisplay} href={websiteHref} />
        ) : null}
      </View>
    </View>
  );
}

function ContactLine({
  prefix,
  value,
  href,
}: {
  prefix: string;
  value: string;
  href?: string;
}) {
  return (
    <Text style={styles.contactLine}>
      <Text style={styles.contactPrefix}>{prefix}</Text>
      {"   "}
      {href ? (
        <Link src={href} style={styles.contactLink}>
          {value}
        </Link>
      ) : (
        value
      )}
    </Text>
  );
}

function Role({ role }: { role: (typeof cv.experience)[number] }) {
  return (
    <View style={styles.role} wrap={false}>
      <View style={styles.roleHeader}>
        <Text>
          <Text style={styles.roleTitle}>{role.role}</Text>
          <Text style={styles.roleCompany}>  ·  {role.company}</Text>
        </Text>
        <Text style={styles.roleRange}>{formatRange(role.start, role.end)}</Text>
      </View>
      <Text style={styles.roleSummary}>{role.summary}</Text>
      {role.highlights.slice(0, 4).map((h) => (
        <Text key={h} style={styles.bullet}>
          ·  {h}
        </Text>
      ))}
      {role.stack.length > 0 ? (
        <Text style={styles.stack}>Stack — {role.stack.join(" · ")}</Text>
      ) : null}
    </View>
  );
}
