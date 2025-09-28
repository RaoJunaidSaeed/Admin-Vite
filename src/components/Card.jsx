const Card = ({ children, className = '', variant = 'default' }) => {
  const variants = {
    default: 'bg-white shadow-md rounded-xl border border-gray-100',
    glass:
      'bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300',
    elevated:
      'bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1',
    outline:
      'bg-white/80 backdrop-blur-sm border-2 border-primary/20 rounded-3xl hover:border-primary/40 transition-all duration-300',
  };

  return <div className={`${variants[variant]} ${className}`}>{children}</div>;
};

const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`p-6 pb-4 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`p-6 pt-4 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`font-semibold text-xl text-charcoal ${className}`}>{children}</h3>
);

const CardDescription = ({ children, className = '' }) => (
  <p className={`text-gray-600 mt-2 ${className}`}>{children}</p>
);

export { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription };

// const Card = ({ children, className = '' }) => (
//   <div className={`bg-white shadow-md rounded-xl ${className}`}>{children}</div>
// );

// const CardContent = ({ children, className = '' }) => (
//   <div className={`p-4 ${className}`}>{children}</div>
// );

// export { Card, CardContent };
