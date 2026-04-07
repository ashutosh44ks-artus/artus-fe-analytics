const EmptyChartState = ({ message }: { message: string }) => (
  <div className="flex h-55 items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-950/40 text-sm text-slate-400">
    {message}
  </div>
);

export default EmptyChartState;
