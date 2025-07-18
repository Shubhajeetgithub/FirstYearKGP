import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, FileText, Download, ExternalLink } from 'lucide-react';

function Resources() {
  const [openSemester, setOpenSemester] = useState(null);
  const [openSubject, setOpenSubject] = useState({});

  // Toggle semester open/close
  const toggleResources = (sem) => {
    setOpenSemester(openSemester === sem ? null : sem);
  };

  // Toggle subject open/close
  const toggleSubject = (subjectId) => {
    setOpenSubject((prev) => ({
      ...prev,
      [subjectId]: !prev[subjectId],
    }));
  };

  const semesterData = {
    s1: {
      name: 'Semester 1',
      subjects: [
        {
          id: 'adv_calc',
          name: 'Advanced Calculus',
          image: 'https://github.com/Shubhajeetgithub/photos/blob/main/AC.png?raw=true',
          resources: [
            { name: 'Tutorials', url: 'https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EvbzH0FixhpBr03NaVuVQ-AB7VCUx_FurLcTppmwP2fBEA?e=bwTCWE', icon: FileText },
            { name: 'Lecture Notes', url: '#', icon: BookOpen }
          ]
        },
        {
          id: 'pow',
          name: 'Physics of Waves',
          image: 'https://github.com/Shubhajeetgithub/photos/blob/main/PoW.png?raw=true',
          resources: [
            { name: 'Short Notes', url: 'https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EuuxkMtVi_RNitLAdo20fm4BVFuGr1Adzp7HuUt7tzu_8g?e=BvmJqQ', icon: FileText }
          ]
        }
      ]
    },
    s2: {
      name: 'Semester 2',
      subjects: [
        {
          id: 'ec',
          name: 'Basic Electronics',
          image: 'https://github.com/Shubhajeetgithub/photos/blob/main/EC.png?raw=true',
          resources: [
            { name: 'PYQ', url: 'https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EpE5jV5PpFpLuB4mMUNUVoMBfAhzZSDM2I_NwmQ6qkroaA?e=MMtBaS', icon: FileText },
            { name: 'Tutorials', url: 'https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EgBJVzn60P1DkTkUDRNud04BbFF9PsQ9-3BwsoCx7bMMyQ?e=sE18km', icon: BookOpen },
            { name: 'Short Notes', url: 'https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/Euois0-DdqNEvWAyXU_4K8sBjwh4j1zZEqRog8VUUkgCIA?e=jcWAQM', icon: FileText },
            { name: 'Newman Solutions', url: 'https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EgC4FH3xqutJiYT5z14wwT4Bsn1WsRgVhMw7ekG-ny84Lg?e=vsIaDn', icon: Download }
          ]
        },
        {
          id: 'et',
          name: 'Electrical Technology',
          image: 'https://github.com/Shubhajeetgithub/photos/blob/main/ET.png?raw=true',
          resources: [
            { name: 'PYQ', url: 'https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EiSz1ua6s61KvejosjYX-_kBqL-4-iTRRr9v3KuxdXH39w?e=lIWocb', icon: FileText },
            { name: 'Tutorials', url: 'https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EtBYYaYl_mdEgiaHCaE_La4B6i8BNnCgvDKeWnWVD_hMYA?e=eVO1qC', icon: BookOpen },
            { name: 'Short Notes', url: 'https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EuQJJsrCeEVMh3_VgrPZDzYBhjGSFSJKlP-M-XBDAFFJ5w?e=02lpXY', icon: FileText }
          ]
        },
        {
          id: 'intro_ds',
          name: 'Introduction to Data Science',
          image: 'https://github.com/Shubhajeetgithub/photos/blob/main/IntroDS.png?raw=true',
          resources: [
            { name: 'Slides', url: 'https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EmAkIucSyehNq1dqngHn-CcBWBDwCRK8JDvoO_iNB7wDQg?e=fPpUaX', icon: FileText }
          ]
        },
        {
          id: 'SPL',
          name: 'System Programming Lab',
          image: 'https://github.com/Shubhajeetgithub/photos/blob/main/spl.png?raw=true',
          resources: [
            { name: 'Slides', url: 'https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EnDXss39wPVEhjtst3kH4LoBdueRvppWXnA-gSHTS6goIA?e=H3MwN5', icon: FileText },
            { name: 'Assignments', url: 'https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/Ei6_7VFJ49ZJr5GoamcvhwYBAlQ2Y83IoqxgnzKnZTOsuQ?e=q3JzDT', icon: Download }
          ]
        },
        {
          id: 'lanca',
          name: 'Linear Algebra, Numerical and Complex Analysis',
          image: 'https://github.com/Shubhajeetgithub/photos/blob/main/LinearAlgebra.png?raw=true',
          resources: [
            { name: 'PYQ', url: 'https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EqEbDaujfcFKn5Kt9xb4DIgBdwJhMuoZ6b-OZ-vEzTT2NQ?e=yLlwGf', icon: FileText },
            { name: 'Tutorials', url: 'https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EgzGGEkVM11GplRAAgcyJJYBrsqYlt2tR6k3-TpxfcvoXA', icon: BookOpen }
          ]
        }
      ]
    },
    s3: {
      name: 'Semester 3',
      subjects: [
        {
          id: 'ai',
          name: 'Intoduction to Artificial Intelligence',
          image: 'https://github.com/Shubhajeetgithub/photos/blob/main/EC.png?raw=true',
          resources: [
            { name: 'Syllabus', url: 'https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/ErO-fKkIXaZGjxydrtzEcs8BFsgm1ki1SoaVXgypca_TJw?e=VLZdwr', icon: FileText }
          ]
        },
        {
          id: 'ml',
          name: 'Introduction to Machine Learning',
          image: 'https://github.com/Shubhajeetgithub/photos/blob/main/ET.png?raw=true',
          resources: [
            { name: 'Syllabus', url: 'https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EunGyN-55G1Ml6AVHifLPGgB8b7wJG809UPDP1BUhjnPSQ?e=pnnouu', icon: FileText }
          ]
        },
        {
          id: 'linalgAi',
          name: 'Linear Algebra for AI',
          image: 'https://github.com/Shubhajeetgithub/photos/blob/main/IntroDS.png?raw=true',
          resources: [
            { name: 'Syllabus', url: 'https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/EiJBmDFxyaxCkA5bK-xVmP4B5DoFiAgH7HHane22SGgFPw?e=cbKo7E', icon: FileText }
          ]
        },
        {
          id: 'algo',
          name: 'Design and analysis of Algorithms',
          image: 'https://github.com/Shubhajeetgithub/photos/blob/main/spl.png?raw=true',
          resources: [
            { name: 'Syllabus', url: 'https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/Eh1WzMAfjJtAkV_xoa7frjwBchYlafoaTBZvXqydZsy5nw?e=TwhChh', icon: FileText }
          ]
        },
        {
          id: 'prob',
          name: 'Probability and Statistics',
          image: 'https://github.com/Shubhajeetgithub/photos/blob/main/spl.png?raw=true',
          resources: [
            { name: 'Syllabus', url: 'https://iitkgpacin-my.sharepoint.com/:f:/g/personal/shubhajeetdas24_24_kgpian_iitkgp_ac_in/En0A9mwowmFHn-Gu2KwcqosBQd1B9eQNZ2dBanHDdRGWjg?e=aWSM8L', icon: FileText }
          ]
        }
      ]
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <div className="rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6">
          <h1 className="text-3xl font-bold text-white mb-2">Academic Resources</h1>
          <p className="text-purple-100">Access your study materials and resources</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">

            {Object.entries(semesterData).map(([semKey, semData]) => (
              <div key={semKey} className="border border-purple-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div 
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-100 to-purple-50 cursor-pointer hover:from-purple-200 hover:to-purple-100 transition-all duration-300"
                  onClick={() => toggleResources(semKey)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{semKey.substring(1)}</span>
                    </div>
                    <span className="text-purple-700 font-bold text-xl">{semData.name}</span>
                  </div>
                  <div className="transition-transform duration-300">
                    {openSemester === semKey ? 
                      <ChevronDown className="w-6 h-6 text-purple-600" /> : 
                      <ChevronRight className="w-6 h-6 text-purple-600" />
                    }
                  </div>
                </div>
                
                <div className={`transition-all duration-500 ease-in-out ${
                  openSemester === semKey ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}>
                  <div className="p-4 space-y-4">
                    {semData.subjects.map((subject, index) => (
                      <div key={subject.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div 
                          className="flex items-center space-x-4 p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                          onClick={(e) => { e.stopPropagation(); toggleSubject(subject.id); }}
                        >
                          <img src={subject.image} alt={subject.name} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">{subject.name}</h3>
                          </div>
                          <div className="transition-transform duration-300">
                            {openSubject[subject.id] ? 
                              <ChevronDown className="w-5 h-5 text-gray-600" /> : 
                              <ChevronRight className="w-5 h-5 text-gray-600" />
                            }
                          </div>
                        </div>
                        
                        <div className={`transition-all duration-300 ease-in-out ${
                          openSubject[subject.id] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        } overflow-hidden`}>
                          <div className="p-4 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {subject.resources.map((resource, resourceIndex) => (
                                <a
                                  key={resourceIndex}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200 group"
                                >
                                  <resource.icon className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
                                  <span className="text-gray-700 group-hover:text-gray-900 font-medium">{resource.name}</span>
                                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 ml-auto" />
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {semKey === 's1' && (
                      <div className="text-center py-4">
                        <p className="text-purple-600 font-medium">More Coming Soon...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            

            {[4, 5, 6, 7, 8].map((semNum) => (
              <div key={`s${semNum}`} className="border border-purple-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div 
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-100 to-purple-50 cursor-pointer hover:from-purple-200 hover:to-purple-100 transition-all duration-300"
                  onClick={() => toggleResources(`s${semNum}`)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{semNum}</span>
                    </div>
                    <span className="text-purple-700 font-bold text-xl">Semester {semNum}</span>
                  </div>
                  <div className="transition-transform duration-300">
                    {openSemester === `s${semNum}` ? 
                      <ChevronDown className="w-6 h-6 text-purple-600" /> : 
                      <ChevronRight className="w-6 h-6 text-purple-600" />
                    }
                  </div>
                </div>
                
                <div className={`transition-all duration-500 ease-in-out ${
                  openSemester === `s${semNum}` ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}>
                  <div className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                      <BookOpen className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="text-purple-600 font-medium text-lg">Coming Soon...</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resources;