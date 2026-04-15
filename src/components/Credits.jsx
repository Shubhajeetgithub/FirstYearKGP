import React from 'react'

function Credits() {
  return (
    <div className="mt-24 mb-16 text-center relative z-10 w-full max-w-5xl mx-auto px-4">
        <h3 className="text-sm font-bold tracking-widest uppercase mb-12 text-slate-500">Core Contributors</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Shubhajeet Das', email: 'shubhajeet [at] kgpian.iitkgp.ac.in', image: 'https://github.com/Shubhajeetgithub/photos/blob/main/shubhajeet.jpeg?raw=true' },
            { name: 'Durva Daga', email: 'durva [at] kgpian.iitkgp.ac.in', image: 'https://github.com/Shubhajeetgithub/photos/blob/main/durva.jpeg?raw=true' },
            { name: 'Kingshuk Patra', email: 'kingshuk [at] kgpian.iitkgp.ac.in', image: 'https://github.com/Shubhajeetgithub/photos/blob/main/kingshuk.jpeg?raw=true' }
          ].map((person, index) => (
            <div key={index} className="group relative rounded-2xl p-6 bg-white/5 border border-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 hover:border-indigo-500/30">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 rounded-2xl transition-all duration-300"></div>
              
              <div className="relative mb-6">
                <div className='flex justify-center'>
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500/30 group-hover:border-indigo-400 transition-colors shadow-lg">
                    <img className="w-full h-full object-cover" src={person.image} alt={person.name} />
                  </div>
                </div>
              </div>
              <div className="relative text-white font-bold text-lg mb-1">{person.name}</div>
              <div className="relative text-indigo-300/80 text-xs font-mono break-all">{person.email}</div>
            </div>
          ))}
        </div>
    </div>
  )
}

export default Credits
