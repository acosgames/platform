
export function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="relative overflow-hidden transform p-4 rounded-md border-b-5 border-black/40  shadow-black/30 shadow-md bg-card ">
       
            <div className="z-1 relative space-y-3 flex flex-col h-full">
                <p className="text-sm lg:text-md uppercase tracking-wide font-semibold text-foreground text-center">{label}</p>
                <div className="flex-1 flex items-end">
                    <div className="w-full relative overflow-hidden transform p-2 rounded-md border-b-5 border-black/40  shadow-black/30 shadow-md bg-primary ">
                        <p className="text-sm lg:text-md uppercase font-black text-foreground truncate text-center">{value}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}