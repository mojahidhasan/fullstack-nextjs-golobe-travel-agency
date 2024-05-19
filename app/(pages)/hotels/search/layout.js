function HotelSearchLayout({ children, hotelFilter, hotelResult }) {
  return (
    <>
      <main className="w-[90%] my-10 mx-auto">
        {children}
        <section className="mx-auto flex w-full flex-col justify-center gap-[24px] lg:flex-row">
          {hotelFilter}
          {hotelResult}
        </section>
      </main>
    </>
  );
}

export default HotelSearchLayout;
