import { isPlaygroundEnabled } from '@/lib/playground';
import { REPO_URL } from '@/lib/site';
import { AnswerTypes } from '@/components/AnswerTypes';
import { Benchmarks } from '@/components/Benchmarks';
import { Caveats } from '@/components/Caveats';
import { CostCalculator } from '@/components/CostCalculator';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { LlmVsJev } from '@/components/LlmVsJev';
import { Nav } from '@/components/Nav';
import { Playground } from '@/components/Playground';
import { PlaygroundProvider } from '@/components/PlaygroundProvider';
import { RevealObserver } from '@/components/RevealObserver';
import { Section } from '@/components/Section';
import { WhyJev } from '@/components/WhyJev';
import sectionStyles from '@/components/Section.module.css';

export default function Home() {
  const playgroundEnabled = isPlaygroundEnabled();

  return (
    <PlaygroundProvider enabled={playgroundEnabled}>
      <Nav repoUrl={REPO_URL} />
      <RevealObserver />

      <main className={sectionStyles.page} id="top">
        <Hero playgroundEnabled={playgroundEnabled} />

        <Section
          id="what"
          eyebrow="01 · What is Jev"
          title="Not a chatbot. A decision engine."
          intro="Most agents call a big general model for every step, including the trivial ones. Is this ticket billing or technical? Is this message safe? That's slow, expensive, and you still have to parse a paragraph to get the answer out. Jev skips the paragraph. You tell it the allowed answers up front and it picks one."
        >
          <LlmVsJev />
          <WhyJev />
        </Section>

        <Section
          id="how"
          eyebrow="02 · How it works"
          title="Three steps, one call."
          intro="Click a step to see which part of the code it maps to."
        >
          <HowItWorks />
        </Section>

        <Section
          id="types"
          eyebrow="03 · Answer types"
          title="Every answer is one of three shapes."
          intro="You can mix them in a single call, for example route a ticket, score its severity and check if it asks for a refund, all against the same input."
        >
          <AnswerTypes />
        </Section>

        <Section
          id="try"
          eyebrow="04 · Try it"
          title="Run the real thing."
          intro={
            playgroundEnabled ? (
              <>
                These calls go to Jev through Vercel AI Gateway using the key in your{' '}
                <code>.env.local</code>. Nothing here is mocked.
              </>
            ) : (
              'Pick a decision type and an example to see the exact call. To actually run it, clone the repo and add your own Vercel AI Gateway key. The free tier is enough.'
            )
          }
        >
          <Playground />
        </Section>

        <Section
          id="cost"
          eyebrow="05 · Cost"
          title="What does the difference look like at scale?"
          intro="Drag the sliders. This uses list prices, so it's a rough estimate, but it shows why offloading small decisions matters once an agent runs thousands of times a day."
        >
          <CostCalculator />
        </Section>

        <Section
          id="tests"
          eyebrow="06 · Independent tests"
          title="What other people measured."
          intro="Within a week of launch, developers ran their own comparisons against Claude. Jev really is much faster and cheaper, just not by as much as the launch numbers say."
        >
          <Benchmarks />
        </Section>

        <Section
          id="caveats"
          eyebrow="07 · Caveats"
          title="What to watch out for."
          intro="The launch was loud. Here's the part that usually gets skipped."
        >
          <Caveats />
        </Section>

        <Footer />
      </main>
    </PlaygroundProvider>
  );
}
