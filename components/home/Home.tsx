import { motion, Variants } from "framer-motion";
import {
  Coffee,
  Croissant,
  CupSoda,
  Leaf,
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  Star,
  Flame,
} from "lucide-react";

const heroCafe = "/hero-cafe.jpg";
const menuChai = "/menu-chai.jpg";
const menuLatte = "/menu-latte.jpg";
const menuIcedTea = "/menu-icedtea.jpg";
const menuCroissant = "/menu-croissant.jpg";
import Link from "next/link";
import Image from "next/image";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const menuItems = [
  {
    name: "Masala Chai",
    desc: "Traditional Indian tea simmered with ginger, cardamom and cinnamon.",
    price: "₹79",
    img: menuChai,
    tag: "Bestseller",
    veg: true,
  },
  {
    name: "Cafe Latte",
    desc: "Double-shot espresso under silky steamed milk and rosetta art.",
    price: "₹179",
    img: menuLatte,
    tag: "Signature",
    veg: true,
  },
  {
    name: "Iced Tea",
    desc: "Refreshing cold-brewed tea with lemon, mint and a touch of honey.",
    price: "₹129",
    img: menuIcedTea,
    tag: "Summer pick",
    veg: true,
  },
  {
    name: "Butter Croissant",
    desc: "Flaky, golden, oven-fresh every morning. Perfect with any brew.",
    price: "₹99",
    img: menuCroissant,
    tag: "Fresh bake",
    veg: true,
  },
];

const highlights = [
  {
    icon: Coffee,
    title: "Single-origin beans",
    text: "Roasted in small batches, ground to order.",
  },
  {
    icon: Flame,
    title: "Slow-brewed chai",
    text: "Family recipe, simmered for twenty minutes.",
  },
  {
    icon: Croissant,
    title: "Baked at sunrise",
    text: "Croissants and breads out of the oven by 8 AM.",
  },
  {
    icon: Leaf,
    title: "Vegetarian friendly",
    text: "A menu crafted around fresh, honest produce.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-espresso">
              <Coffee className="h-4 w-4 text-primary" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              The Secret Cafe
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#menu" className="transition-colors hover:text-foreground">
              Menu
            </a>
            <a
              href="#about"
              className="transition-colors hover:text-foreground"
            >
              Our Story
            </a>
            <a
              href="#visit"
              className="transition-colors hover:text-foreground"
            >
              Visit Us
            </a>
          </nav>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:scale-105"
          >
            Login
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.p
              variants={fadeUp}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold tracking-wide text-accent-foreground uppercase"
            >
              <Star className="h-3.5 w-3.5 text-primary" />
              Brewed with love since 2019
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-balance font-display text-5xl leading-[1.05] font-semibold tracking-tight sm:text-6xl lg:text-7xl"
            >
              Every cup keeps a{" "}
              <span className="text-primary italic">little secret</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground"
            >
              Hand-pulled espresso, slow-simmered masala chai and bakes that
              leave the oven at sunrise — all in the coziest corner of the city.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <a
                href="#menu"
                className="inline-flex items-center gap-2 rounded-full bg-espresso px-7 py-3 text-sm font-semibold text-espresso-foreground transition-transform hover:scale-105"
              >
                Explore the menu
                <CupSoda className="h-4 w-4" />
              </a>
              <a
                href="#visit"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3 text-sm font-semibold transition-colors hover:bg-accent"
              >
                <MapPin className="h-4 w-4 text-primary" />
                Find us
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, rotate: 1.5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-3xl border border-border shadow-2xl shadow-espresso/20">
              <Image
                src={heroCafe}
                alt="Warm interior of The Secret Cafe with wooden counter and orange armchair"
                width={1920}
                height={1080}
                loading="eager"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="absolute -bottom-6 -left-4 rounded-2xl border border-border bg-card px-5 py-4 shadow-xl sm:-left-8"
            >
              <p className="text-2xl font-bold text-primary">4.9★</p>
              <p className="text-xs font-medium text-muted-foreground">
                2,400+ happy reviews
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Marquee strip */}
        <div className="border-y border-border bg-espresso py-3">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
            className="flex w-max gap-10 text-sm font-semibold tracking-widest text-espresso-foreground/90 uppercase"
          >
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="flex gap-10">
                {[
                  "Espresso",
                  "Masala Chai",
                  "Cold Brew",
                  "Fresh Croissants",
                  "Iced Tea",
                  "Cafe Latte",
                  "Green Tea",
                  "Sourdough",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-10">
                    {item} <span className="text-primary">✦</span>
                  </span>
                ))}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-12 text-center"
        >
          <motion.p
            variants={fadeUp}
            className="text-sm font-semibold tracking-widest text-primary uppercase"
          >
            From our kitchen
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl"
          >
            The menu everyone talks about
          </motion.h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {menuItems.map((item) => (
            <motion.article
              key={item.name}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-xl hover:shadow-espresso/10"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={item.img}
                  alt={item.name}
                  width={800}
                  height={800}
                  loading="eager"
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute top-3 left-3 rounded-full bg-espresso/90 px-3 py-1 text-xs font-semibold text-espresso-foreground">
                  {item.tag}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold">
                    {item.name}
                  </h3>
                  <span className="rounded-full bg-accent px-3 py-0.5 text-sm font-bold text-primary">
                    {item.price}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* About / highlights */}
      <section
        id="about"
        className="scroll-mt-24 border-y border-border bg-secondary/60"
      >
        <div className="mx-auto max-w-6xl px-6 py-24">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-12 lg:grid-cols-[1fr_1.4fr]"
          >
            <motion.div variants={fadeUp}>
              <p className="text-sm font-semibold tracking-widest text-primary uppercase">
                Our story
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                A small cafe with a big heart
              </h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                What began as a two-table tea stall is now the neighbourhood's
                favourite hideout. We still brew chai the slow way, still bake
                before the sun is up, and still remember your usual order.
              </p>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2">
              {highlights.map((h) => (
                <motion.div
                  key={h.title}
                  variants={fadeUp}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent">
                    <h.icon className="h-5 w-5 text-primary" />
                  </span>
                  <h3 className="mt-4 font-semibold">{h.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {h.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Visit / address */}
      <section id="visit" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="overflow-hidden rounded-3xl bg-espresso text-espresso-foreground"
        >
          <div className="grid gap-10 p-10 sm:p-14 lg:grid-cols-2">
            <motion.div variants={fadeUp}>
              <p className="text-sm font-semibold tracking-widest text-primary uppercase">
                Visit us
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight">
                Come say hello
              </h2>
              <p className="mt-5 leading-relaxed text-espresso-foreground/70">
                Tucked beside the old banyan tree — follow the smell of fresh
                croissants and you'll find us.
              </p>
              <Link
                href="/login"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
              >
                Staff & member login
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} className="space-y-5">
              <div className="flex gap-4 rounded-2xl bg-white/5 p-5">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-sm text-espresso-foreground/70">
                    12, Lakeview Lane, Sector 5, Salt Lake, Kolkata 700091
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-2xl bg-white/5 p-5">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold">Hours</p>
                  <p className="text-sm text-espresso-foreground/70">
                    Mon – Sun · 8:00 AM – 10:00 PM
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-2xl bg-white/5 p-5">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold">Call us</p>
                  <p className="text-sm text-espresso-foreground/70">
                    +91 98765 43210
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-muted-foreground sm:flex-row">
          <p className="flex items-center gap-2">
            <Coffee className="h-4 w-4 text-primary" />
            The Secret Cafe · Brewed with love
          </p>
          <p>
            © {new Date().getFullYear()} The Secret Cafe. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
