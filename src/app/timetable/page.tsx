'use client';
import React from "react";
import { useTheme } from "@/components/ThemeProvider";

type TimeSlotContent = [string, string] | null;

interface DaySchedule {
  day: string;
  slots: TimeSlotContent[];
}

function TimeTable() {
  const { themeConfig } = useTheme();

  // The provided data for the timetable with explicit typing
  const timetableData: DaySchedule[] = [
    {
      day: 'Mon',
      slots: [
        ['Prob & Stats', 'NR321'],
        ['Prob & Stats', 'NR321'],
        null,
        null,
        ['Algo', 'NC231'],
        null,
        null,
        null,
        null,
      ],
    },
    {
      day: 'Tue',
      slots: [
        null,
        null,
        ['Algo', 'NC231'],
        ['Algo', 'NC231'],
        ['Prob & Stats', 'NR321'],
        null,
        null,
        null,
        null,
      ],
    },
    {
      day: 'Wed',
      slots: [
        null,
        null,
        ['AI', 'NC231'],
        null,
        ['ML', 'NC231'],
        ['ML Lab', 'CIC Lab VI'],
        ['ML Lab', 'CIC Lab VI'],
        ['ML Lab', 'CIC Lab VI'],
        null,
      ],
    },
    {
      day: 'Thur',
      slots: [
        ['Algo', 'NC231'],
        ['AI', 'NC231'],
        null,
        ['ML', 'NC231'],
        null,
        ['Algo lab', 'CIC Lab VI'],
        ['Algo lab', 'CIC Lab VI'],
        ['Algo lab', 'CIC Lab VI'],
        null,
      ],
    },
    {
      day: 'Fri',
      slots: [
        null,
        ['ML', 'NC231'],
        ['ML', 'NC231'],
        ['AI', 'NC231'],
        ['AI', 'NC231'],
        ['Lin Alg', 'NC234'],
        ['Lin Alg', 'NC234'],
        ['Lin Alg', 'NC234'],
        ['Lin Alg', 'NC234'],
      ],
    },
  ];

  const timeSlots: string[] = [
    '8:00–8:55 AM',
    '9:00–9:55 AM',
    '10:00–10:55 AM',
    '11:00–11:55 AM',
    '12:00–12:55 PM',
    '2:00–2:55 PM',
    '3:00–3:55 PM',
    '4:00–4:55 PM',
    '5:00–5:55 PM',
  ];

  return (
    <div
      className={`max-w-7xl mx-auto rounded-lg shadow-md overflow-hidden mt-8 ${themeConfig.background.main} ${themeConfig.text.primary}`}
    >
      <div
        className={`${themeConfig.text.primary} px-4 py-6 text-center`}
      >
        <h1 className="text-2xl font-bold">2nd Year AUTUMN 2025–2026</h1>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto whitespace-nowrap">
        <table
          className={`w-full min-w-[800px] border-collapse text-sm ${themeConfig.text.primary}`}
        >
          <thead
            className={`sticky top-0 z-10 ${themeConfig.background.main}`}
          >
            <tr>
              <th
                className={`border px-2 py-3 font-bold sticky left-0 z-20 ${themeConfig.background.main} ${themeConfig.text.secondary}`}
              >
                Day
              </th>
              {timeSlots.map((time, i) => (
                <th
                  key={i}
                  className={`border px-2 py-3 font-bold ${themeConfig.text.secondary}`}
                >
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timetableData.map(({ day, slots }, i) => (
              <tr key={i}>
                <td
                  className={`border px-2 py-3 font-semibold sticky left-0 z-10 ${themeConfig.background.main}`}
                >
                  {day}
                </td>
                {slots.map((slot, idx) => (
                  <td
                    key={idx}
                    className="border px-2 py-3 min-w-[100px] align-middle text-center"
                  >
                    {slot ? (
                      <>
                        <div className="font-semibold">{slot[0]}</div>
                        <div
                          className={`text-xs ${themeConfig.text.secondary}`}
                        >
                          {slot[1]}
                        </div>
                      </>
                    ) : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden px-4 py-6">
        {timetableData.map(({ day, slots }, dIdx) => (
          <div
            key={dIdx}
            className="rounded-xl mb-6 shadow-md overflow-hidden border"
          >
            <div
              className={`text-white py-4 text-center font-bold text-lg ${themeConfig.background.main}`}
            >
              {
                // Mapping dIdx to full day name
                ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][dIdx]
              }
            </div>
            <div className="p-4 space-y-3">
              {timeSlots.map((time, i) => {
                const slot = slots[i];
                return (
                  <div
                    key={i}
                    className={`flex items-start border-b pb-2 ${slot ? '' : 'opacity-40'}`}
                  >
                    <div
                      className={`w-28 font-bold text-sm ${themeConfig.text.secondary}`}
                    >
                      {time}
                    </div>
                    <div className="pl-3 text-sm">
                      {slot ? (
                        <>
                          <div className="font-semibold">{slot[0]}</div>
                          <div
                            className={`text-xs ${themeConfig.text.secondary}`}
                          >
                            {slot[1]}
                          </div>
                        </>
                      ) : (
                        <div className={`italic ${themeConfig.text.secondary}`}>
                          Free
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TimeTable;