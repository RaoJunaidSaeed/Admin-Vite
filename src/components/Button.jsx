const Button = ({ children, className = '', variant, ...props }) => {
  const base = 'rounded-md font-medium px-4 py-2';
  const variants = {
    default: 'bg-primary text-white hover:bg-primary/90',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
  };
  const classes = `${base} ${variant ? variants[variant] : variants.default} ${className}`;
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export { Button };
