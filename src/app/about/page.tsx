import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container-trizen py-16 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Image src="/logo.png" alt="TriZen Store" width={64} height={64} />
        <h1 className="text-3xl font-bold uppercase tracking-wide">About TriZen Store</h1>
      </div>
      <div className="prose prose-invert max-w-none space-y-6 text-[var(--color-muted)] leading-relaxed">
        <p>
          TriZen Store is dedicated to premium esports gear — glass mouse pads, hand
          sleeves, and mouse skates designed for competitive players who demand the
          fastest glide and most precise control.
        </p>
        <p>
          Every product is built with esports performance in mind. Secure bank transfer
          checkout, full order tracking, and professional invoicing on every order.
        </p>
        <h2 className="text-white text-lg font-semibold uppercase tracking-wide pt-4">
          Our Gear
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Glass mouse pads — ultra-smooth, super-fast glide</li>
          <li>Hand sleeves — comfort and control for long sessions</li>
          <li>Mouse skates — precision replacements for competitive mice</li>
        </ul>
      </div>
    </div>
  );
}
