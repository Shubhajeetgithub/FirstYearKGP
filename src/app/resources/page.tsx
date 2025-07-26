"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

interface Resource {
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Subject {
  id: string;
  name: string;
  image: string;
  resources: Resource[];
}

interface SemesterData {
  [key: string]: {
    name: string;
    subjects: Subject[];
  };
}

export default function Resources() {
  const [openSemester, setOpenSemester] = useState<string | null>(null);
  const [openSubject, setOpenSubject] = useState<Record<string, boolean>>({});
  const [semesterData, setSemesterData] = useState<SemesterData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const { semesterData } = await import("@/data/semester");
      setSemesterData(semesterData);
    };
    loadData();
  }, []);

  const toggleResources = (sem: string) => {
    setOpenSemester(openSemester === sem ? null : sem);
  };

  const toggleSubject = (subjectId: string) => {
    setOpenSubject((prev) => ({
      ...prev,
      [subjectId]: !prev[subjectId],
    }));
  };

  if (!semesterData) {
    return (
      <div className="text-center p-8">
        <p className="text-purple-600 font-bold text-lg">
          Loading Academic Resources...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <div className="rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6">
          <h1 className="text-3xl font-bold text-white mb-2">Academic Resources</h1>
          <p className="text-purple-100">
            Access your study materials and resources
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {Object.entries(semesterData).map(([semKey, semData]) => (
              <div
                key={semKey}
                className="border border-purple-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-100 to-purple-50 cursor-pointer hover:from-purple-200 hover:to-purple-100 transition-all duration-300"
                  onClick={() => toggleResources(semKey)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {semKey.substring(1)}
                      </span>
                    </div>
                    <span className="text-purple-700 font-bold text-xl">
                      {semData.name}
                    </span>
                  </div>
                  <div className="transition-transform duration-300">
                    {openSemester === semKey ? (
                      <ChevronDown className="w-6 h-6 text-purple-600" />
                    ) : (
                      <ChevronRight className="w-6 h-6 text-purple-600" />
                    )}
                  </div>
                </div>

                <div
                  className={`transition-all duration-500 ease-in-out ${
                    openSemester === semKey
                      ? "max-h-[2000px] opacity-100"
                      : "max-h-0 opacity-0"
                  } overflow-hidden`}
                >
                  <div className="p-4 space-y-4">
                    {semData.subjects.map((subject) => (
                      <div
                        key={subject.id}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <div
                          className="flex items-center space-x-4 p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSubject(subject.id);
                          }}
                        >
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden shadow-sm">
                        <Image
                            src={subject.image}
                            alt={subject.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                            priority
                        />
                        </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">
                              {subject.name}
                            </h3>
                          </div>
                          <div className="transition-transform duration-300">
                            {openSubject[subject.id] ? (
                              <ChevronDown className="w-5 h-5 text-gray-600" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-600" />
                            )}
                          </div>
                        </div>

                        <div
                          className={`transition-all duration-300 ease-in-out ${
                            openSubject[subject.id]
                              ? "max-h-96 opacity-100"
                              : "max-h-0 opacity-0"
                          } overflow-hidden`}
                        >
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
                                  <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                                    {resource.name}
                                  </span>
                                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 ml-auto" />
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {semKey === "s1" && (
                      <div className="text-center py-4">
                        <p className="text-purple-600 font-medium">More Coming Soon...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {[4, 5, 6, 7, 8].map((semNum) => (
              <div
                key={`s${semNum}`}
                className="border border-purple-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-100 to-purple-50 cursor-pointer hover:from-purple-200 hover:to-purple-100 transition-all duration-300"
                  onClick={() => toggleResources(`s${semNum}`)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{semNum}</span>
                    </div>
                    <span className="text-purple-700 font-bold text-xl">
                      Semester {semNum}
                    </span>
                  </div>
                  <div className="transition-transform duration-300">
                    {openSemester === `s${semNum}` ? (
                      <ChevronDown className="w-6 h-6 text-purple-600" />
                    ) : (
                      <ChevronRight className="w-6 h-6 text-purple-600" />
                    )}
                  </div>
                </div>

                <div
                  className={`transition-all duration-500 ease-in-out ${
                    openSemester === `s${semNum}`
                      ? "max-h-32 opacity-100"
                      : "max-h-0 opacity-0"
                  } overflow-hidden`}
                >
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
