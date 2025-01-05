import { getDatabase, ref, set } from "firebase/database"
import toast from "react-hot-toast";

export default function firebaseNewSession(current_hour, current_minute, current_second, user, notes) {
    const database = getDatabase()
    const query =
    {
        "hour": current_hour,
        "minute": current_minute,
        "second": current_second,
        "user": user,
        "notes": notes
    }

    String.prototype.hashCode = function () {
        let hash = 0;
        for (let i = 0; i < this.length; i++) {
            const char = this.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0;
        }
        return hash;
    };

    try {
        set(ref(database, Math.abs(user.toString().hashCode() + notes.toString().hashCode()) + '/'), {
            hour: query.hour,
            minute: query.minute,
            second: query.second,
            user: query.user,
            notes: query.notes,
        });
        toast.success("Session saved")
    } catch (error) {
        toast.error(error)
    }
}