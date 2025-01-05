import { useState } from 'react';
import ReactStopwatch from 'react-stopwatch';
import { toast } from 'react-hot-toast';
import firebaseNewSession from "../services/firebase_data_service";

function ClockView({ user }) {
    const [openClock, setOpenClock] = useState(false);
    const [current_hour, setCurrentHour] = useState(0);
    const [current_minute, setCurrentMinute] = useState(0);
    const [current_second, setCurrentSecond] = useState(0);
    const [notes, setNotes] = useState("");

    const startClock = () => {
        setOpenClock(true);
        setCurrentHour(0);
        setCurrentMinute(0);
        setCurrentSecond(0);
    };

    const saveSession = () => {
        if (current_hour === 0 && current_minute === 0 && current_second === 0) {
            toast.error("Please start timer first!");
            return
        }
        if (notes == "" || notes == "null_notes") {
            toast.error("Please enter notes!");
            return
        }
        firebaseNewSession(current_hour, current_minute, current_second, user, notes);
    };

    const stopClock = () => {
        setCurrentHour(document.getElementById("hour_label").innerText);
        setCurrentMinute(document.getElementById("minute_label").innerText);
        setCurrentSecond(document.getElementById("second_label").innerText);
        document.getElementById("hour_label").innerText = current_hour;
        document.getElementById("minute_label").innerText = current_minute;
        document.getElementById("second_label").innerText = current_second;
        setOpenClock(false);
    };

    return (
        <>
            {openClock ? (
                <ReactStopwatch
                    seconds={current_second}
                    minutes={current_minute}
                    hours={current_hour}
                    render={({ hours, minutes, seconds }) => (
                        <div className="flex items-center justify-center py-16">
                            <div className="h-56 grid grid-cols-3 gap-96 content-center text-center">
                                <div>
                                    <h6 className="font-bold text-8xl py-4" id='hour_label'>{hours}</h6>
                                    Hours
                                </div>
                                <div>
                                    <h6 className="font-bold text-8xl py-4" id='minute_label'>{minutes}</h6>
                                    Minutes
                                </div>
                                <div>
                                    <h6 className="font-bold text-8xl py-4" id='second_label'>{seconds}</h6>
                                    Seconds
                                </div>
                            </div>
                        </div>
                    )}
                />
            ) : (
                <>
                    <div className="flex items-center justify-center py-16">
                        <div className="h-56 grid grid-cols-3 gap-96 content-center text-center">
                            <div>
                                <h6 className="font-bold text-8xl py-4">{current_hour}</h6>
                                Hours
                            </div>
                            <div>
                                <h6 className="font-bold text-8xl py-4">{current_minute}</h6>
                                Minutes
                            </div>
                            <div>
                                <h6 className="font-bold text-8xl py-4">{current_second}</h6>
                                Seconds
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={startClock}
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Start New Session
                        </button>
                        <button
                            onClick={saveSession}
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Save Session
                        </button>
                    </div>
                    <div className='flex justify-center py-4'>
                        <div className="sm:col-span-2">
                            <label htmlFor="message" className="block text-sm/6 font-semibold text-gray-900">
                                Notes For Your Session
                            </label>
                            <div className="mt-2.5">
                                <textarea
                                    id="notes"
                                    rows={4}
                                    className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                    defaultValue={''}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
            <div className='flex items-center justify-center'>
                <button
                    onClick={stopClock}
                    id='end_session_button'
                    className={!openClock ? "hidden" : "px-4 py-2 bg-red-500 text-white rounded"}
                >
                    End Session
                </button>
            </div>
        </>
    );
}
export default ClockView