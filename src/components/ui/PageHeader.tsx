
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string; // Add description as an alias for subtitle
}

const PageHeader = ({ title, subtitle, description }: PageHeaderProps) => {
  // Use description as a fallback for subtitle
  const displaySubtitle = subtitle || description;
  
  return (
    <div className="mb-12 text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h1>
      {displaySubtitle && <p className="text-gray-400 text-lg max-w-2xl mx-auto">{displaySubtitle}</p>}
    </div>
  );
};

export default PageHeader;
