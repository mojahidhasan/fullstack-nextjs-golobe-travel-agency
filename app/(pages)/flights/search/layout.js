function FlightSearchLayout({
  children,
  flightFilter,
  flightResult,
  searchParams,
}) {
  console.log(searchParams);
  return (
    <>
      <main className="w-[90%] my-10 mx-auto">
        {children}
        <section className="mx-auto flex w-full flex-col justify-center gap-[24px] lg:flex-row">
          {flightFilter}
          {flightResult}
        </section>
      </main>
    </>
  );
}

export default FlightSearchLayout;
