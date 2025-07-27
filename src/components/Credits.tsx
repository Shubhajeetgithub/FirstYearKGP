'use client';

import Image from 'next/image';
import React from 'react';
import { useTheme } from './ThemeProvider';

type Person = {
  name: string;
  email: string;
  image: string;
};

const people: Person[] = [
  {
    name: 'Shubhajeet Das',
    email: '(firstname)(lastname)(24.24)(at)(kgpian.iitkgp.ac.in)',
    image: '/photos/shubhajeet.jpeg',
  },
  {
    name: 'Durva Daga',
    email: '(firstname)(lastname)(.24)(at)(kgpian.iitkgp.ac.in)',
    image: '/photos/durva.jpeg',
  },
  {
    name: 'Kingshuk Patra',
    email: '(firstname)(lastname)(2006.24)(at)(kgpian.iitkgp.ac.in)',
    image: '/photos/kingshuk.jpeg',
  },
];

const Credits: React.FC = () => {
  const { themeConfig } = useTheme();
  
  return (
    <div className="mt-16 mb-12 text-center relative z-10">
      <h3 className={`text-2xl font-semibold mb-8 ${themeConfig.text.secondary}`}>Credits</h3>
      <div className="flex justify-center gap-16 flex-wrap">
        {people.map((person, index) => (
          <div key={index} className="text-center group">
            <div className="relative mb-4">
              <div className="flex justify-center">
                <div className={`w-[150px] h-[150px] relative rounded-full overflow-hidden border-[3px] ${themeConfig.header.gradient}`}>
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    sizes="150px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            <div className={`${themeConfig.text.primary} font-medium`}>{person.name}</div>
            <div className={`${themeConfig.text.secondary} text-sm mt-1`}>{person.email}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Credits;