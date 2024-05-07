export function SectionTitle({ title, subTitle, className }) {
  return (
    <div className={className}>
      <h2 className="mb-2 text-[2rem] font-semibold text-black max-md:text-center md:mb-4">
        {title}
      </h2>
      <p className="opacity-75 max-md:text-center">{subTitle}</p>
    </div>
  );
}
