import Image from "next/image";

const photos = [
  {
    src: "/trabalhos/catedral.jpg",
    alt: "Catedral de Brasília iluminada, vista de drone à noite.",
    caption: "Catedral de Brasília à noite",
  },
  {
    src: "/trabalhos/esplanada.jpg",
    alt: "Congresso Nacional e a Esplanada dos Ministérios à noite, em tomada aérea.",
    caption: "Congresso Nacional e a Esplanada dos Ministérios",
  },
] as const;

const videos = [
  {
    src: "/trabalhos/voo-01.mp4",
    poster: "/trabalhos/voo-01.jpg",
    caption: "Memorial JK ao anoitecer, com a Torre de TV ao fundo",
  },
  {
    src: "/trabalhos/voo-02.mp4",
    poster: "/trabalhos/voo-02.jpg",
    caption: "Detalhe aéreo da escultura do Memorial JK",
  },
  {
    src: "/trabalhos/voo-03.mp4",
    poster: "/trabalhos/voo-03.jpg",
    caption: "Sobrevoo noturno de Brasília",
  },
] as const;

export function Works() {
  return (
    <section id="trabalhos" className="scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <p className="eyebrow">Trabalhos</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight sm:text-4xl">
          Voos já feitos em Brasília.
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          Registros reais de sobrevoo noturno. Aperte o play para ver o movimento de cada tomada.
        </p>

        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {photos.map((photo) => (
            <li key={photo.src} className="surface overflow-hidden">
              <figure>
                <div className="relative aspect-video">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="p-5 text-sm leading-relaxed text-muted">{photo.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          {videos.map((video) => (
            <li key={video.src} className="surface overflow-hidden">
              <figure>
                <video
                  className="aspect-[9/16] w-full bg-black object-cover"
                  controls
                  playsInline
                  preload="metadata"
                  poster={video.poster}
                  aria-label={video.caption}
                >
                  <source src={video.src} type="video/mp4" />
                </video>
                <figcaption className="p-4 text-sm leading-relaxed text-muted">{video.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
