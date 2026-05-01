import { Bookmark } from "@/components/book/Bookmark";
import { Cover } from "@/components/book/Cover";
import { ChapterCredentials } from "@/components/chapter/Credentials";
import { EpilogueStub } from "@/components/chapter/EpilogueStub";
import { ChapterGlossary } from "@/components/chapter/Glossary";
import { ChapterProjects } from "@/components/chapter/Projects";
import { ChapterTimeline } from "@/components/chapter/Timeline";
import { Prologue } from "@/components/chapter/Prologue";

export default function HomePage() {
  return (
    <main className="relative">
      <Bookmark />
      <Cover />
      <Prologue />
      <ChapterTimeline />
      <ChapterGlossary />
      <ChapterProjects />
      <ChapterCredentials />
      <EpilogueStub />
    </main>
  );
}
