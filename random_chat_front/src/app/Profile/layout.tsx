
 
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <section className='h-full w-full'>{children}</section>
    </>
  )
}