import React from 'react'

function Credits() {
  return (
    <div className="mt-16 mb-12 text-center relative z-10">
        <h3 className="text-2xl font-semibold mb-8 text-gray-300">Credits</h3>
        <div className="flex justify-center gap-16">
          {[
            { name: 'Shubhajeet Das', email: '(firstname)(lastname)(24.24)(at)(kgpian.iitkgp.ac.in)', image: 'https://github.com/Shubhajeetgithub/photos/blob/main/shubhajeet.jpeg?raw=true' },
            { name: 'Kingshuk Patra', email: '(firstname)(lastname)(2006.24)(at)(kgpian.iitkgp.ac.in)', image: 'https://github.com/Shubhajeetgithub/photos/blob/main/kingshuk.jpeg?raw=true' }
          ].map((person, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-4">
                <div className='flex justify-center'>
                  <img className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#4B0082]" src={person.image} />
                </div>
              </div>
              <div className="text-white font-medium">{person.name}</div>
              <div className="text-gray-400 text-sm mt-1">{person.email}</div>
            </div>
          ))}
        </div>
    </div>
  )
}

export default Credits
