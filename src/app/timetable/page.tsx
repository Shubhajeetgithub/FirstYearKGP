import React from "react";
import "./timetable.css";

function TimeTable() {
  return (
    <div className="container">
      <div className="timetable-header">
        <h1>2nd Year AUTUMN 2025–2026</h1>
      </div>

      {/* <!-- Desktop Table View --> */}
      <div className="desktop-table">
        <table>
          <thead>
            <tr>
              <th>Day Name</th>
              <th>8:00–8:55 AM</th>
              <th>9:00–9:55 AM</th>
              <th>10:00–10:55 AM</th>
              <th>11:00–11:55 AM</th>
              <th>12:00–12:55 PM</th>
              <th>2:00–2:55 PM</th>
              <th>3:00–3:55 PM</th>
              <th>4:00–4:55 PM</th>
              <th>5:00–5:55 PM</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Mon</td>
              <td>
                <span className="subject">Prob & Stats</span>
                <br />
                <span className="room">NR321</span>
              </td>
              <td>
                <span className="subject">Prob & Stats</span>
                <br />
                <span className="room">NR321</span>
              </td>
              <td></td>
              <td></td>
              <td>
                <span className="subject">Algo</span>
                <br />
                <span className="room">NC231</span>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Tue</td>
              <td></td>
              <td></td>
              <td>
                <span className="subject">Algo</span>
                <br />
                <span className="room">NC231</span>
              </td>
              <td>
                <span className="subject">Algo</span>
                <br />
                <span className="room">NC231</span>
              </td>
              <td>
                <span className="subject">Prob & Stats</span>
                <br />
                <span className="room">NR321</span>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Wed</td>
              <td></td>
              <td></td>
              <td>
                <span className="subject">AI</span>
                <br />
                <span className="room">NC231</span>
              </td>
              <td></td>
              <td>
                <span className="subject">ML</span>
                <br />
                <span className="room">NC231</span>
              </td>
              <td>
                <span className="subject">ML Lab</span>
                <br />
                <span className="room">CIC Lab VI</span>
              </td>
              <td>
                <span className="subject">ML Lab</span>
                <br />
                <span className="room">CIC Lab VI</span>
              </td>
              <td>
                <span className="subject">ML Lab</span>
                <br />
                <span className="room">CIC Lab VI</span>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>Thur</td>
              <td>
                <span className="subject">Algo</span>
                <br />
                <span className="room">NC231</span>
              </td>
              <td>
                <span className="subject">AI</span>
                <br />
                <span className="room">NC231</span>
              </td>
              <td></td>
              <td>
                <span className="subject">ML</span>
                <br />
                <span className="room">NC231</span>
              </td>
              <td></td>
              <td>
                <span className="subject">Algo lab</span>
                <br />
                <span className="room">CIC Lab VI</span>
              </td>
              <td>
                <span className="subject">Algo lab</span>
                <br />
                <span className="room">CIC Lab VI</span>
              </td>
              <td>
                <span className="subject">Algo lab</span>
                <br />
                <span className="room">CIC Lab VI</span>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>Fri</td>
              <td></td>
              <td>
                <span className="subject">ML</span>
                <br />
                <span className="room">NC231</span>
              </td>
              <td>
                <span className="subject">ML</span>
                <br />
                <span className="room">NC231</span>
              </td>
              <td>
                <span className="subject">AI</span>
                <br />
                <span className="room">NC231</span>
              </td>
              <td>
                <span className="subject">AI</span>
                <br />
                <span className="room">NC231</span>
              </td>
              <td>
                <span className="subject">Lin Alg</span>
                <br />
                <span className="room">NC234</span>
              </td>
              <td>
                <span className="subject">Lin Alg</span>
                <br />
                <span className="room">NC234</span>
              </td>
              <td>
                <span className="subject">Lin Alg</span>
                <br />
                <span className="room">NC234</span>
              </td>
              <td>
                <span className="subject">Lin Alg</span>
                <br />
                <span className="room">NC234</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* <!-- Mobile Card View --> */}
      <div className="mobile-cards">
        <div className="day-card">
          <div className="day-header">Monday</div>
          <div className="time-slots">
            <div className="time-slot">
              <div className="time">8:00–8:55 AM</div>
              <div className="subject-info">
                <div className="subject">Prob & Stats</div>
                <div className="room">NR321</div>
              </div>
            </div>
            <div className="time-slot">
              <div className="time">9:00–9:55 AM</div>
              <div className="subject-info">
                <div className="subject">Prob & Stats</div>
                <div className="room">NR321</div>
              </div>
            </div>
            <div className="time-slot">
              <div className="time">10:00–10:55 AM</div>
              <div className="subject-info">
                <div className="empty-slot">Free</div>
              </div>
            </div>
            <div className="time-slot empty">
              <div className="time">11:00–11:55 AM</div>
              <div className="subject-info">
                <div className="empty-slot">Free</div>
              </div>
            </div>
            <div className="time-slot">
              <div className="time">12:00–12:55 PM</div>
              <div className="subject-info">
                <div className="subject">Algo</div>
                <div className="room">NC231</div>
              </div>
            </div>
            <div className="time-slot empty">
              <div className="time">2:00–2:55 PM</div>
              <div className="subject-info">
                <div className="empty-slot">Free</div>
              </div>
            </div>
            <div className="time-slot empty">
              <div className="time">3:00–3:55 PM</div>
              <div className="subject-info">
                <div className="empty-slot">Free</div>
              </div>
            </div>
            <div className="time-slot empty">
              <div className="time">4:00–4:55 PM</div>
              <div className="subject-info">
                <div className="empty-slot">Free</div>
              </div>
            </div>
            <div className="time-slot empty">
              <div className="time">5:00–5:55 PM</div>
              <div className="subject-info">
                <div className="empty-slot">Free</div>
              </div>
            </div>
          </div>
        </div>

        <div className="day-card">
          <div className="day-header">Tuesday</div>
          <div className="time-slots">
            <div className="time-slot empty">
              <div className="time">8:00–8:55 AM</div>
              <div className="subject-info">
                <div className="empty-slot">Free</div>
              </div>
            </div>
            <div className="time-slot empty">
              <div className="time">9:00–9:55 AM</div>
              <div className="subject-info">
                <div className="empty-slot">Free</div>
              </div>
            </div>
            <div className="time-slot">
              <div className="time">10:00–10:55 AM</div>
              <div className="subject-info">
                <div className="subject">Algo</div>
                <div className="room">NC231</div>
              </div>
            </div>
            <div className="time-slot">
              <div className="time">11:00–11:55 AM</div>
              <div className="subject-info">
                <div className="subject">Algo</div>
                <div className="room">NC231</div>
              </div>
            </div>
            <div className="time-slot">
              <div className="time">12:00–12:55 PM</div>
              <div className="subject-info">
                <div className="subject">Prob & Stats</div>
                <div className="room">NR321</div>
              </div>
            </div>
            <div className="time-slot empty">
              <div className="time">2:00–2:55 PM</div>
              <div className="subject-info">
                <div className="empty-slot">Free</div>
              </div>
            </div>
            <div className="time-slot empty">
              <div className="time">3:00–3:55 PM</div>
              <div className="subject-info">
                <div className="empty-slot">Free</div>
              </div>
            </div>
            <div className="time-slot empty">
              <div className="time">4:00–4:55 PM</div>
              <div className="subject-info">
                <div className="empty-slot">Free</div>
              </div>
            </div>
            <div className="time-slot empty">
              <div className="time">5:00–5:55 PM</div>
              <div className="subject-info">
                <div className="empty-slot">Free</div>
              </div>
            </div>
          </div>
        </div>

        <div className="day-card">
          <div className="day-header">Wednesday</div>
          <div className="time-slots">
            <div className="time-slot">
              <div className="time">8:00–8:55 AM</div>
              <div className="subject-info">
                <div className="empty-slot">Free</div>
              </div>
            </div>
            <div className="time-slot">
              <div className="time">9:00–9:55 AM</div>
              <div className="subject-info">
                <div className="empty-slot">Free</div>
              </div>
            </div>
            <div className="time-slot">
              <div className="time">10:00–10:55 AM</div>
              <div className="subject-info">
                <div className="subject">AI</div>
                <div className="room">NC231</div>
              </div>
            </div>
            <div className="time-slot empty">
              <div className="time">11:00–11:55 AM</div>
              <div className="subject-info">
                <div className="empty-slot">Free</div>
              </div>
            </div>
            <div className="time-slot">
              <div className="time">12:00–12:55 PM</div>
              <div className="subject-info">
                <div className="subject">ML</div>
                <div className="room">NC231</div>
              </div>
            </div>
            <div className="time-slot">
              <div className="time">2:00–2:55 PM</div>
              <div className="subject-info">
                <div className="subject">ML Lab</div>
                <div className="room">CIC Lab VI</div>
              </div>
            </div>
            <div className="time-slot">
              <div className="time">3:00–3:55 PM</div>
              <div className="subject-info">
                <div className="subject">ML Lab</div>
                <div className="room">CIC Lab VI</div>
              </div>
            </div>
            <div className="time-slot empty">
              <div className="time">4:00–4:55 PM</div>
              <div className="subject-info">
                <div className="subject">ML Lab</div>
                <div className="room">CIC Lab VI</div>
              </div>
            </div>
            <div className="time-slot">
              <div className="time">5:00–5:55 PM</div>
              <div className="subject-info">
                <div className="empty-slot">Free</div>
              </div>
            </div>
          </div>
        </div>

        <div className="day-card">
          <div className="day-header">Thursday</div>
          <div className="time-slots">
            <div className="time-slot">
              <div className="time">8:00–8:55 AM</div>
              <div className="subject-info">
                <div className="subject">Algo</div>
                <div className="room">NC231</div>
              </div>
            </div>
            <div className="time-slot">
              <div className="time">9:00–9:55 AM</div>
              <div className="subject-info">
                <div className="subject">AI</div>
                <div className="room">NC231</div>
              </div>
            </div>
            <div className="time-slot">
              <div className="time">10:00–10:55 AM</div>
              <div className="subject-info">
                <div className="empty-slot">Free</div>
              </div>
            </div>
            <div className="time-slot">
              <div className="time">11:00–11:55 AM</div>
              <div className="subject-info">
                <div className="subject">ML</div>
                <div className="room">NC231</div>
              </div>
            </div>
            <div className="time-slot empty">
              <div className="time">12:00–12:55 PM</div>
              <div className="subject-info">
                <div className="empty-slot">Free</div>
              </div>
            </div>
            <div className="time-slot">
              <div className="time">2:00–2:55 PM</div>
              <div className="subject-info">
                <div className="subject">Algo lab</div>
                <div className="room">CIC Lab VI</div>
              </div>
            </div>
            <div className="time-slot">
              <div className="time">3:00–3:55 PM</div>
              <div className="subject-info">
                <div className="subject">Algo lab</div>
                <div className="room">CIC Lab VI</div>
              </div>
            </div>
            <div className="time-slot">
              <div className="time">4:00–4:55 PM</div>
              <div className="subject-info">
                <div className="subject">Algo lab</div>
                <div className="room">CIC Lab VI</div>
              </div>
            </div>
            <div className="time-slot empty">
              <div className="time">5:00–5:55 PM</div>
              <div className="subject-info">
                <div className="empty-slot">Free</div>
              </div>
            </div>
          </div>
        </div>

        <div className="day-card">
          <div className="day-header">Friday</div>
          <div className="time-slots">
            <div className="time-slot empty">
              <div className="time">8:00–8:55 AM</div>
              <div className="subject-info">
                <div className="empty-slot">Free</div>
              </div>
            </div>
            <div className="time-slot">
              <div className="time">9:00–9:55 AM</div>
              <div className="subject-info">
                <div className="subject">ML</div>
                <div className="room">NC231</div>
              </div>
            </div>
            <div className="time-slot">
              <div className="time">10:00–10:55 AM</div>
              <div className="subject-info">
                <div className="subject">ML</div>
                <div className="room">NC231</div>
              </div>
            </div>
            <div className="time-slot">
              <div className="time">11:00–11:55 AM</div>
              <div className="subject-info">
                <div className="subject">AI</div>
                <div className="room">NC231</div>
              </div>
            </div>
            <div className="time-slot">
              <div className="time">12:00–12:55 PM</div>
              <div className="subject-info">
                <div className="subject">AI</div>
                <div className="room">NC231</div>
              </div>
            </div>
            <div className="time-slot">
              <div className="time">2:00–2:55 PM</div>
              <div className="subject-info">
                <div className="subject">Lin Alg</div>
                <div className="room">NC234</div>
              </div>
            </div>
            <div className="time-slot">
              <div className="time">3:00–3:55 PM</div>
              <div className="subject-info">
                <div className="subject">Lin Alg</div>
                <div className="room">NC234</div>
              </div>
            </div>
            <div className="time-slot">
              <div className="time">4:00–4:55 PM</div>
              <div className="subject-info">
                <div className="subject">Lin Alg</div>
                <div className="room">NC234</div>
              </div>
            </div>
            <div className="time-slot">
              <div className="time">5:00–5:55 PM</div>
              <div className="subject-info">
                <div className="subject">Lin Alg</div>
                <div className="room">NC234</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimeTable;
