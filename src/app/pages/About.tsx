import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'

import { bySlug } from '../../data/products'
import { Shoe } from '../components/Shoe'
import { ButtonLink, Container, Reveal } from '../components/ui'

export function About() {
  const axis = bySlug('axis-low')!
  const boot = bySlug('foundry-boot')!

  return (
    <Container className="pt-10 sm:pt-14">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="label text-accent">The workshop / Porto</p>
          <h1 className="font-display mt-4 text-[clamp(44px,7.5vw,92px)] uppercase leading-[0.85] tracking-[-0.055em]">
            One bench.
            <br />
            One pair.
            <br />
            <span className="text-accent">Every time.</span>
          </h1>
        </div>
        <p className="max-w-[440px] pb-2 text-[15.5px] leading-relaxed text-muted">
          Raxx is a six-person workshop on Rua da Alegria. We make shoes to order, on four lasts, from leather we can trace to the tannery. No seasons, no stock, no pair made before someone asks for it.
        </p>
      </div>

      <Reveal className="mt-10">
        <div className="stage relative overflow-hidden rounded-[28px] border border-line/70">
          <div className="pointer-events-none absolute inset-0 hairline-grid opacity-60" aria-hidden />
          <div className="absolute inset-x-6 top-6 flex items-start justify-between">
            <p className="label text-[9px] text-muted">Rua da Alegria 142, Porto</p>
            <p className="label text-[9px] text-muted">Est. 2019</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-2 px-4 pb-14 pt-16 sm:px-10 sm:pt-12">
            <Shoe {...axis.colorways[1]} silhouette={axis.silhouette} monogram="RX" className="mx-auto max-w-[420px]" label="Axis Low in Ink and Volt" />
            <Shoe {...boot.colorways[0]} silhouette={boot.silhouette} className="mx-auto max-w-[380px]" label="Foundry Boot in Cognac" />
          </div>
          <div className="absolute inset-x-6 bottom-5 flex flex-wrap items-center justify-between gap-3 border-t border-line/70 pt-3">
            <p className="text-[12px] text-muted">Two of four lasts. Photographed on the bench, not a set.</p>
            <Link to="/studio" className="inline-flex items-center gap-1.5 text-[12px] text-muted hover:text-fg">
              Design one
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </Reveal>

      <div className="mt-16 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <p className="font-script text-[34px] leading-[1.12] text-fg">“We only make what someone will actually wear.”</p>
          <p className="label mt-4 text-[9px] text-muted">Marta Reis, founder</p>
        </Reveal>
        <Reveal delay={0.08} className="flex flex-col gap-5 text-[15.5px] leading-relaxed text-muted">
          <p>
            Raxx began as a repair bench. Marta was resoling boots for friends and slowly collecting the lasts that now define the collection: a low top, a court shoe, a work boot and a slip-on.
          </p>
          <p>
            In 2021 we stopped repairing other people’s shoes and started making our own, one pair at a time. The rule was simple: nothing leaves the workshop unless the person who made it would happily wear it for a year.
          </p>
          <p>
            Today we work with two tanneries in Tuscany and one in Alcanena, buy soles from a family workshop outside Porto, and use a cork footbed that moulds to the foot rather than fighting it. If a sole wears out before the upper does, send it back and we will replace it for the cost of the sole.
          </p>
          <ButtonLink to="/shop" className="mt-1 self-start" variant="secondary">
            See the four lasts
          </ButtonLink>
        </Reveal>
      </div>

      <dl className="mt-16 grid gap-6 border-y border-line py-9 sm:grid-cols-4">
        {[
          ['2019', 'founded as a repair bench'],
          ['06', 'makers on the bench'],
          ['1,840', 'pairs made by hand'],
          ['<2%', 'pairs returned'],
        ].map(([value, label], i) => (
          <Reveal key={label} delay={i * 0.05}>
            <div>
              <dt className="font-display text-[clamp(34px,4vw,48px)] leading-none tracking-[-0.04em]">{value}</dt>
              <dd className="mt-2 max-w-[150px] text-[12.5px] leading-relaxed text-muted">{label}</dd>
            </div>
          </Reveal>
        ))}
      </dl>

      <section className="mt-16">
        <Reveal>
          <h2 className="font-display text-[clamp(30px,4vw,44px)] uppercase leading-none">A short history of the bench</h2>
        </Reveal>
        <ol className="mt-8 grid gap-0 sm:grid-cols-2">
          {[
            ['2019', 'A repair bench on Rua da Alegria', 'Marta starts resoling boots for friends. The first last is bought at an estate sale in Matosinhos.'],
            ['2021', 'The first pair of Raxx', 'The Axis Low is cut, stitched and worn daily by three people for a year before it is offered to anyone else.'],
            ['2023', 'The studio opens', 'We add the online studio so a customer can choose every panel without a fitting appointment.'],
            ['2025', 'Resole for life', 'The cupsole is redesigned to be stitched, not glued, and the workshop begins resoling any Raxx pair for the cost of the sole.'],
          ].map(([year, title, body], i) => (
            <Reveal key={year} delay={i * 0.05}>
              <li className="grid grid-cols-[52px_1fr] gap-4 border-t border-line py-6 sm:grid-cols-[64px_1fr] sm:pr-8">
                <span className="label pt-1 text-[10px] text-accent">{year}</span>
                <div>
                  <p className="text-[15px] font-medium">{title}</p>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{body}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="mt-12 grid gap-3 md:grid-cols-3">
        {[
          ['Resole, don’t replace', 'Every pair is stitched so the sole can come off and go back on. Send them in; we will not sell you a new pair.'],
          ['Paid by the pair', 'Our makers are paid per pair and named on the ticket inside your box. No piecework quotas, no seasonal rush.'],
          ['Small on purpose', 'We cap orders at 40 pairs a week. Beyond that, the bench gets crowded and the stitching shows it.'],
        ].map(([title, body], i) => (
          <Reveal key={title} delay={i * 0.06}>
            <div className="h-full rounded-card border border-line bg-surface p-6">
              <p className="label text-[9px] text-accent">0{i + 1}</p>
              <p className="mt-3 text-[15.5px] font-medium">{title}</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{body}</p>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="mt-16 rounded-[28px] bg-ink px-6 py-12 text-bg sm:px-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label text-volt">Come by, or start online</p>
            <h2 className="font-display mt-3 text-[clamp(36px,5vw,60px)] uppercase leading-[0.88]">The kettle is on.</h2>
            <p className="mt-4 max-w-[420px] text-[14px] leading-relaxed text-bg/60">
              Wednesday to Saturday, 10h–18h. Fittings by appointment. If you cannot make it to Porto, the studio works from a photograph and a tape measure.
            </p>
          </div>
          <ButtonLink to="/studio" variant="volt" size="lg">
            Design your pair
            <ArrowRight />
          </ButtonLink>
        </div>
      </section>
    </Container>
  )
}
