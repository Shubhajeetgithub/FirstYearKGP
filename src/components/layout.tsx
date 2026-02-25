import { Navbar } from './navbar';
import { Footer } from './footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}

