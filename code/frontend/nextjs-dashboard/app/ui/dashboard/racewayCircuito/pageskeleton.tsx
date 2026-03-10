// Skeleton de carga — fondo blanco, bordes azul

export default function PageSkeleton() {
  return (
    <div className="min-h-screen bg-white px-4 py-8 animate-pulse">
      <div className="mx-auto max-w-5xl">

        {/* ── Encabezado ── */}
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="h-10 w-72 rounded-lg bg-blue-100" />
          <div className="h-4 w-80 rounded bg-gray-100" />
          <div className="h-4 w-24 rounded bg-gray-100" />
        </div>

        {/* ── Leyenda ── */}
        <div className="mb-4 flex justify-center gap-5">
          {[80, 72, 96, 72].map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gray-200" />
              <div className={`h-4 w-${w === 80 ? '20' : w === 72 ? '16' : w === 96 ? '24' : '16'} rounded bg-gray-100`} />
            </div>
          ))}
        </div>

        {/* ── SVG + Estado ── */}
        <div className="flex items-start gap-3">
          {/* SVG */}
          <div className="min-w-0 flex-1 rounded-2xl border border-blue-200 bg-sky-50 p-3">
            <div className="w-full rounded-xl bg-blue-100/60" style={{ aspectRatio: '780/420' }} />
          </div>
          {/* Estado */}
          <div className="w-56 shrink-0 rounded-2xl border border-blue-200 bg-gray-50 p-4">
            <div className="mb-4 border-b border-gray-200 pb-3 space-y-1.5">
              <div className="h-4 w-32 rounded bg-blue-100" />
              <div className="h-3 w-24 rounded bg-gray-100" />
            </div>
            <div className="space-y-3">
              <div className="h-20 rounded-xl bg-blue-50 border border-blue-100" />
              <div className="h-14 rounded-xl bg-blue-50 border border-blue-100" />
            </div>
          </div>
        </div>

        {/* ── Niveles ── */}
        <div className="mt-3 grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-blue-200 bg-white p-3 shadow-sm space-y-2">
              <div className="h-3 w-20 rounded bg-gray-100" />
              <div className="h-1.5 w-full rounded-full bg-gray-100" />
              <div className="h-3 w-8 ml-auto rounded bg-gray-100" />
            </div>
          ))}
        </div>

        {/* ── Tarjetas acción motor ── */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 p-3">
              <div className="h-9 w-9 rounded-xl bg-blue-100" />
              <div className="h-3 w-20 rounded bg-blue-100" />
              <div className="h-3 w-16 rounded bg-gray-100" />
              <div className="mt-1 h-7 w-full rounded-lg bg-blue-200" />
            </div>
          ))}
        </div>

        {/* ── Divisor ── */}
        <div className="my-8 h-px w-full bg-gray-200" />

        {/* ── Tarjetas info fases ── */}
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="h-8 w-48 rounded-lg bg-blue-100" />
          <div className="h-4 w-56 rounded bg-gray-100" />
          <div className="h-px w-16 bg-blue-200" />
        </div>

        <div className="space-y-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-5 rounded-2xl border border-blue-200 border-l-4 border-l-blue-400 bg-blue-50 p-5">
              <div className="h-12 w-12 shrink-0 rounded-2xl bg-blue-100 border border-blue-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 rounded bg-blue-100" />
                <div className="h-3 w-full rounded bg-gray-100" />
                <div className="h-3 w-4/5 rounded bg-gray-100" />
                <div className="mt-2 flex gap-2">
                  <div className="h-5 w-24 rounded-full bg-blue-100" />
                  <div className="h-5 w-28 rounded-full bg-blue-100" />
                  <div className="h-5 w-20 rounded-full bg-gray-100" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}