
interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  return (
    <div className="mb-12 text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h1>
      {subtitle && <p className="text-gray-400 text-lg max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
};

export default PageHeader;
