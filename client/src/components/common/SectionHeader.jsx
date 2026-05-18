const SectionHeader = ({ title, subtitle, action }) => (
  <div className="mb-6 flex items-end justify-between border-b border-[#d5dbe1] pb-4">
    <div>
      <h2 className="text-[30px] font-bold text-[#191c1e]">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-[#5a6168]">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export default SectionHeader;
