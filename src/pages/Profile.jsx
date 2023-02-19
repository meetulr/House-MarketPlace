import { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import ListingItem from "../components/ListingItem";

function Profile() {
    const auth = getAuth();

    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [changeDetails, setChangeDetails] = useState(false);
    const [formData, setFormData] = useState(
        {
            name: auth.currentUser.displayName,
            email: auth.currentUser.email
        }
    );

    const { name, email } = formData;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserListings = async () => {
            const listingsRef = collection(db, "listings");

            const q = query(listingsRef,
                where("userRef", "==", auth.currentUser.uid),
                orderBy("timestamp", "desc"));

            const querySnap = await getDocs(q);

            const listings = [];

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })

            setListings(listings);
            setLoading(false);
        }

        fetchUserListings();
    }, [auth.currentUser.uid]);

    const onLogout = () => {
        auth.signOut();
        navigate("/");
    }

    const onSubmit = async () => {
        try {
            if (auth.currentUser.displayName !== name) {
                await updateProfile(auth.currentUser, {
                    displayName: name
                })

                const userRef = doc(db, "users", auth.currentUser.uid);
                await updateDoc(userRef, {
                    name
                })
            }
        } catch (error) {
            toast.error("couldn't update profile details");
        }
    }

    const handleChange = (e) => {
        setFormData((prevState) => (
            {
                ...prevState,
                [e.target.id]: e.target.value
            }
        ))
    }

    const handleDelete = async (listingId) => {
        if(window.confirm("You sure you want to delete this listing?")){
            await deleteDoc(doc(db, "listings", listingId));

            const updatedListings = listings.filter((listing) => listing.id !== listingId);

            setListings(updatedListings);
            toast.success("Successfully deleted the listing");
        }
    }

    const handleEdit = (listingId) => navigate(`/edit-listing/${listingId}`);

    return <div className="profile">
        <header className="profileHeader">
            <p className="pageHeader">My Profile</p>
            <button type="button"
                className="logOut"
                onClick={onLogout} >
                Logout
            </button>
        </header>

        <main>
            <div className="profileDetailsHeader">
                <p className="profileDetailsText">Personal Details</p>
                <p className="changePersonalDetails" onClick={() => {
                    changeDetails && onSubmit();
                    setChangeDetails(prevState => !prevState);
                }}>
                    {changeDetails ? "done" : "change"}
                </p>
            </div>

            <div className="profileCard">
                <form>
                    <input type="text" id="name"
                        className={!changeDetails ? "profileName" : "profileNameActive"}
                        disabled={!changeDetails}
                        value={name}
                        onChange={handleChange}
                    />

                    <input type="text" id="email"
                        className={!changeDetails ? "profileEmail" : "profileEmailActive"}
                        disabled={!changeDetails}
                        value={email}
                        onChange={handleChange}
                    />
                </form>
            </div>

            <Link to="/create-listing" className="createListing">
                <img src={homeIcon} alt="home" />

                <p>Sell or Rent your Home</p>
                <img src={arrowRight} alt="arrow right" />
            </Link>

            {!loading && listings?.length > 0 && (
                <>
                    <p className="listingText">
                        Your Listings
                    </p>

                    <ul className="listingsList">
                        {listings.map((listing) => (
                            <ListingItem key={listing.id}
                                listing={listing.data}
                                id={listing.id}
                                onDelete={() => handleDelete(listing.id)}
                                onEdit={() => handleEdit(listing.id)}
                            />
                        ))}
                    </ul>
                </>
            )}
        </main>
    </div>
}

export default Profile