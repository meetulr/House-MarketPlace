import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import googleIcon from "../assets/svg/googleIcon.svg";

function OAuth() {
    const navigate = useNavigate();
    const location = useLocation();

    const onGoogleClick = async () => {
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // check if user already exists
            const userRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userRef);

            if(!docSnap.exists()){
                await setDoc(doc(db, "users", user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timeStamp: serverTimestamp()
                });
            }

            navigate("/");
        } catch (error) {
            toast.error("couldn't authenticate with google");
        }
    }

    return (
        <div className="socialLogin">
            <p>Sign {location.pathname === "/sign-up" ? "Up" : "In"} with </p>
            <button className="socialIconDiv" onClick={onGoogleClick}>
                <img className="socialIconImg" src={googleIcon} alt="googleIcon" />
            </button>
        </div>
    )
}

export default OAuth