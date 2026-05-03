interface CardProps {
  title: string;
  noOfItems: number | string;
  subText: string;
  color: string;
}
export function TaskSummaryCard({ title, noOfItems, subText, color }: CardProps) {
  return (
    <div className="flex flex-col bg-surface rounded-2xl h-full w-full p-3">
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full shrink-0 ${color}`} />
        <span className="uppercase text-xs font-bold text-subtle">{title}</span>
      </div>
      <span className="text-text text-2xl font-bold">{noOfItems}</span>
      <span className="text-muted text-[0.6rem]">{subText}</span>
    </div>
  );
}
