import Empty from "../components/empty_box"
import { useEffect, useState } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { signOut } from 'firebase/auth';
import { auth } from "../components/firebase_project"
import toast from "react-hot-toast"
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { getDatabase, ref, onValue } from "firebase/database";
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function TopBar({ isLogged, username }) {
    const [open, setOpen] = useState(false)
    const getSessions = () => { setOpen(true); setModalOpen(false) }
    const [userSessions, setUserSessions] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [sessionNotes, setSessionNotes] = useState("")

    const redirect_login = () => {
        window.location.href = "/auth/login"
    }

    const fetch_sessions = () => {
        const database = getDatabase();
        const sessionsRef = ref(database);
        onValue(sessionsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const sessions = [];
                Object.keys(data).forEach((key) => {
                    if (data[key].user === username) {
                        sessions.push(data[key]);
                    }
                });
                setUserSessions(sessions);
            } else {
                setUserSessions([]);
            }
        });
    };


    useEffect(() => {
        if (open) {
            fetch_sessions()
        }
    }, [open])

    const sign_out = async () => {
        if (document.getElementById("end_session_button")?.classList.contains("hidden")) {
            try {
                await signOut(auth)
                localStorage.removeItem("auth")
                toast.success("Signed out.")
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
            }
            catch (e) {
                toast.error("Something went wrong.")
            }

        }
        else {
            toast.error("You must close your session to sign out.")
        }

    }

    return (
        <>
            <Empty padding="py-2" />
            <div className="px-8">
                <div className="bg-[#7775D6] rounded-full px-12 py-3 drop-shadow-2xl container m-auto flex items-center justify-between gap-4">
                    <p className="text-white font-bold font-sans text-xl truncate">
                        Coding Session Manager
                    </p>

                    {isLogged ? <Menu as="div" className="relative inline-block text-left">
                        <div>
                            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                {username}
                                <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
                            </MenuButton>
                        </div>

                        <MenuItems
                            transition
                            className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                        >
                            <div className="py-1">
                                <MenuItem>
                                    <a
                                        onClick={getSessions}
                                        className="cursor-pointer block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                    >
                                        Your Sessions
                                    </a>
                                </MenuItem>
                                <div className="py-1">
                                    <MenuItem>
                                        <a
                                            onClick={sign_out}
                                            className="cursor-pointer block px-4 py-2 text-sm text-red-500 data-[focus]:bg-red-400 data-[focus]:text-white data-[focus]:outline-none"
                                        >
                                            Sign Out
                                        </a>
                                    </MenuItem>
                                </div>
                            </div>
                        </MenuItems>
                    </Menu> :
                        <button className="bg-transparent rounded rounded-x border-2 px-4 py-2 border-black"
                            onClick={redirect_login}
                        >
                            Login
                        </button>
                    }
                </div>
            </div>
            {open ? <Dialog open={open} onClose={setOpen} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
                />
                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <DialogPanel
                                transition
                                className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
                            >
                                <TransitionChild>
                                    <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 duration-500 ease-in-out data-[closed]:opacity-0 sm:-ml-10 sm:pr-4">
                                        <button
                                            type="button"
                                            onClick={() => setOpen(false)}
                                            className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                        >
                                            <span className="absolute -inset-2.5" />
                                            <span className="sr-only">Close panel</span>
                                            <XMarkIcon aria-hidden="true" className="size-6" />
                                        </button>
                                    </div>
                                </TransitionChild>
                                <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                                    <div className="px-4 sm:px-6">
                                        <DialogTitle className="text-base font-bold text-gray-900">Sessions For {username}</DialogTitle>
                                    </div>
                                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                        <ul className="divide-y divide-gray-100">
                                            {userSessions.map((session) => (
                                                <li className="flex justify-between gap-x-6 py-5">
                                                    <div className="flex min-w-0 gap-x-4">
                                                        <div className="min-w-0 flex-auto">
                                                            <p className="text-sm/6 font-semibold text-gray-900">By {session.user}</p>
                                                            <p className="mt-1 truncate text-xs/5 text-gray-500">Hours: {session.hour}</p>
                                                            <p className="mt-1 truncate text-xs/5 text-gray-500">Minutes: {session.minute}</p>
                                                            <p className="mt-1 truncate text-xs/5 text-gray-500">Seconds: {session.second}</p>
                                                        </div>
                                                    </div>
                                                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end px-4 py-8">
                                                        <button className="text-sm/6 text-gray-900 rounded bg-zinc-400 px-4 py-4 text-white"
                                                            onClick={() => { setModalOpen(true); setSessionNotes(session.notes) }}
                                                        >
                                                            View Notes
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </div>
            </Dialog> : <div />}
            {modalOpen ? <Dialog open={open} onClose={setOpen} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                        >
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                        <DialogTitle as="h3" className="text-base font-bold text-gray-900">
                                            Session Notes
                                        </DialogTitle>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                {sessionNotes}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="button"
                                    data-autofocus
                                    onClick={() => setModalOpen(false)}
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto text-red-400"
                                >
                                    Close
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog> : <div />}
        </>
    )
}