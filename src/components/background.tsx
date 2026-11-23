export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid" />
      <div className="aurora drift-a left-[-10%] top-[-15%] h-[38rem] w-[38rem] bg-[hsl(265_90%_45%)]" />
      <div className="aurora drift-b right-[-15%] top-[5%] h-[34rem] w-[34rem] bg-[hsl(195_95%_40%)] opacity-40" />
      <div className="aurora drift-c left-[30%] top-[40%] h-[30rem] w-[30rem] bg-[hsl(160_80%_35%)] opacity-25" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}
