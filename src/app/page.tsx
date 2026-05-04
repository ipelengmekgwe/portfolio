import { Bookmark } from "@/components/book/Bookmark";
import { Cover } from "@/components/book/Cover";
import { ChapterCredentials } from "@/components/chapter/Credentials";
import { Epilogue } from "@/components/chapter/Epilogue";
import { ChapterGlossary } from "@/components/chapter/Glossary";
import { ChapterProjects } from "@/components/chapter/Projects";
import { Prologue } from "@/components/chapter/Prologue";
import { ChapterTimeline } from "@/components/chapter/Timeline";

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
      <Epilogue />
    </main>
  );
}
