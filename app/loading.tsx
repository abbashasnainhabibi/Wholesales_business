export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Top bar placeholder */}
      <div className="h-9 bg-slate-100 border-b border-slate-200" />

      {/* Header placeholder */}
      <div className="mx-auto flex h-16 sm:h-20 max-w-[1536px] items-center justify-between px-4 sm:px-6 md:px-10 border-b border-slate-100">
        <div className="space-y-2">
          <div className="h-6 w-44 rounded-sm bg-slate-200" />
          <div className="h-3 w-28 rounded-sm bg-slate-100" />
        </div>
        <div className="hidden xl:flex items-center gap-6">
          <div className="h-4 w-14 rounded-sm bg-slate-100" />
          <div className="h-4 w-20 rounded-sm bg-slate-100" />
          <div className="h-4 w-20 rounded-sm bg-slate-100" />
          <div className="h-4 w-16 rounded-sm bg-slate-100" />
          <div className="h-4 w-16 rounded-sm bg-slate-100" />
        </div>
        <div className="h-9 w-32 rounded-sm bg-slate-200" />
      </div>

      {/* Hero placeholder */}
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 md:px-10 py-10 sm:py-14 space-y-4">
        <div className="h-4 w-36 rounded-sm bg-blue-100" />
        <div className="h-10 sm:h-12 w-3/4 max-w-2xl rounded-sm bg-slate-200" />
        <div className="h-4 w-1/2 max-w-lg rounded-sm bg-slate-100" />
      </div>

      {/* Grid Cards placeholder */}
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 md:px-10 pb-20">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-sm border border-slate-200 bg-white p-3 sm:p-5 space-y-3.5">
              <div className="aspect-[4/3] sm:aspect-[16/11] w-full rounded-sm bg-slate-200" />
              <div className="space-y-2">
                <div className="h-3 w-20 rounded-sm bg-slate-100" />
                <div className="h-5 w-3/4 rounded-sm bg-slate-200" />
                <div className="h-3 w-full rounded-sm bg-slate-100" />
              </div>
              <div className="h-9 w-full rounded-sm bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
