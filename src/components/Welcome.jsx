import React, { useState, useEffect } from 'react'
import { Terminal, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

function Welcome() {
  const [terminalText, setTerminalText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const text = 'cat init_academic_resources.sh';
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setTerminalText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 80);

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(typeInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <div className='w-full flex flex-col items-center justify-center space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000'>
      
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mt-8 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-4">
          <BookOpen className="w-4 h-4" />
          <span>Department of Artificial Intelligence</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
          Academic Archive <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
            AI Batch 2024
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          A centralized, student-maintained repository for study materials, notes, and resources. Designed to supplement existing community platforms with highly specific content.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
           <Link to="/Resources" className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:bg-slate-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.3)]">
             Browse Resources
           </Link>
           <a href="#about" className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors">
             Learn More
           </a>
        </div>
      </div>

      {/* Terminal UI */}
      <div id="about" className="w-full max-w-4xl px-4 relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-[#0d0d12]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-white/5 px-4 py-3 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500/80 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500/80 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500/80 rounded-full"></div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <Terminal className="w-3 h-3" />
                <span>root@kgp-archive:~</span>
              </div>
            </div>
            
            <div className="p-6 font-mono text-sm sm:text-base text-indigo-300">
              <div className="flex items-center mb-4">
                <span className="text-emerald-400 mr-2">➜</span>
                <span className="text-cyan-400 mr-2">~</span>
                <span>{terminalText}</span>
                <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} w-2 h-5 bg-indigo-300 ml-1 inline-block align-middle`}></span>
              </div>
              <div className='text-slate-300 leading-relaxed opacity-90 delay-500 animate-in fade-in'>
                Initializing academic archive index... <span className="text-emerald-400">[OK]</span><br/>
                Connecting to departmental storage... <span className="text-emerald-400">[OK]</span><br/>
                <br/>
                <span className="text-white font-bold">INFO:</span> This platform serves as a supplementary index alongside existing sites such as 
                <span className='text-orange-400'> CSE 2020</span>, 
                <span className='text-pink-400'> KGPellence</span>, and 
                <span className='text-cyan-400'> MetaKGP</span>.<br/><br/>
                Our focus is on hosting high-yield resources that are not readily available elsewhere. If you come across any errors or missing content, please consider contributing.
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome