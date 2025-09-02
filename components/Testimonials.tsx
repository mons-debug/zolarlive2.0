export default function Testimonials() {
  return (
    <section aria-label="Testimonials" className="relative z-10 mx-auto max-w-6xl px-4 md:px-8 py-12 md:py-16">
      <div className="text-center mb-8 md:mb-12">
        <div className="font-mono text-xs md:text-sm tracking-[0.3em] text-white/70">What people say</div>
        <h3 className="mt-3 text-2xl md:text-3xl font-semibold text-white">Testimonials</h3>
        <p className="mt-2 text-white/60 text-sm md:text-base">Real feedback from Moroccan buyers.</p>
      </div>

      <div className="grid gap-4 md:gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-md p-4 md:p-6">
          <div className="text-white/90 text-sm md:text-base">&ldquo;The fabric quality is incredible! Wore it to a party and got so many compliments. Delivery was super fast too.&rdquo;</div>
          <div className="mt-3 text-white/50 text-xs">— Ahmed from Casablanca</div>
        </div>
        
        <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-md p-4 md:p-6">
          <div className="text-white/90 text-sm md:text-base">&ldquo;Perfect fit and the design is exactly what I was looking for. The cash on delivery option made it so easy to order.&rdquo;</div>
          <div className="mt-3 text-white/50 text-xs">— Fatima from Rabat</div>
        </div>
        
        <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur-md p-4 md:p-6">
          <div className="text-white/90 text-sm md:text-base">&ldquo;Love the streetwear vibe! The material feels premium and the stitching is perfect. Will definitely order again.&rdquo;</div>
          <div className="mt-3 text-white/50 text-xs">— Youssef from Marrakech</div>
        </div>
      </div>
    </section>
  );
}


