function FlightSearchLayout({ children, flightFilter, flightResult }) {
  return (
    <>
      <main className="w-[90%] my-10 mx-auto">
        {children}
        <section className="flex w-full flex-col justify-center gap-[24px] lg:flex-row">
          {flightFilter}
          {flightResult}
        </section>
      </main>
    </>
  );
}

export default FlightSearchLayout;
