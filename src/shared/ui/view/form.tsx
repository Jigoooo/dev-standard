import { FormEvent, FormHTMLAttributes, ReactNode } from 'react';

export function Form({
  handleSubmit,
  children,
  ...props
}: FormHTMLAttributes<HTMLFormElement> & {
  handleSubmit: (formData: FormData) => void;
  children: ReactNode;
}) {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    handleSubmit(formData);
  };

  return (
    <form onSubmit={onSubmit} {...props}>
      {children}
    </form>
  );
}
