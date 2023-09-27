import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { toast } from 'react-toastify'

export default function Contact({ lisitng }) {

    const [landlord, setLandlord] = useState(null)
    const [message, setMessage] = useState("")

    useEffect(() => {
        async function getLandLord() {
            const docRef = doc(db, "users", lisitng.userRef)
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setLandlord(docSnap.data());
            }
            else {
                toast.error("Could not get landlord data")
            }
        }
        getLandLord()
    }, [])

    async function onChange(e) {
        setMessage(e.target.value);
    }

    return (
        <div>
            {landlord !== null && (
                <div>
                    <p className='mb-2'>Contact {landlord.name} for more details about "{lisitng.name}"</p>
                    <div>
                        <textarea name="message" id="message" cols="30" rows="5" placeholder='Write your message here' value={message} onChange={onChange} className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 border rounded-md transition duration-150 ease-in-out focus:border-slate-600'></textarea>
                    </div>
                    <a href={`mailto:${landlord.email}?Subject=${lisitng.name}&body=${message}`}>
                        <button className='px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded-md shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg w-full text-center transition duration-150 ease-in-out'>Send Message</button>
                    </a>
                </div>
            )}
        </div>
    )
}
