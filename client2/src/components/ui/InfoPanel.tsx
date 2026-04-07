
export function InfoPanel({children}: {children: React.ReactNode}) {

    return (
        <section className="relative ">
          <div className="p-4 rounded-md border-b-5 border-black/40  shadow-black/30 shadow-md bg-card">
            {children}
          </div>
        </section>
    )

}