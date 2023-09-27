import React, { useState } from 'react'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { getAuth } from 'firebase/auth'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useNavigate } from 'react-router'

const CreateListing = () => {
    const auth = getAuth()
    const navigate = useNavigate()
    const [geoLocationEnabled, setGeoLocationEnabled] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        type: "rent",
        name: "",
        bedrooms: 1,
        bathrooms: 1,
        kitchens: 1,
        parking: false,
        furnished: false,
        address: "",
        city: "",
        state: "",
        pin: "",
        description: "",
        discount: true,
        regularPrice: 0,
        discountedPrice: 0,
        latitude: 0,
        longitude: 0,
        images: {},

    })
    const { type, name, bedrooms, bathrooms, kitchens, parking, furnished, address, city, state, pin, description, discount, regularPrice, discountedPrice,latitude, longitude,images } = formData

    let geoLocation = {}

    function onChange(e) {
        let boolean = null;
        // as the true and false come as string and we need true or false
        if (e.target.value === "true") boolean = true
        if (e.target.value === "false") boolean = false
        // for the files 
        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files
            }))
        }

        if (!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value
            }))
        }


    }

    
    
    
    async function onSubmit(e){
        e.preventDefault();
        setLoading(true)

        if(+discountedPrice >= +regularPrice){
            setLoading(false)
            toast.error("Discounted price should be less than Regular price!")
            return;
        }
        if(images.length>6){
            setLoading(false)
            toast.error("Maximum 6 images are allowed")
            return;
        }

        if(!geoLocationEnabled){
            geoLocation.lat = latitude;
            geoLocation.lng = longitude;
        }

        console.log(geoLocation)


        async function storeImage(image){
            return new Promise((resolve,reject)=>{
                const storage = getStorage()
                const filename = `${auth.currentUser.uid}-${image.name}-${Math.random()*99}`
                const storageRef = ref(storage,filename)
                const uploadTask = uploadBytesResumable(storageRef,image);
                
                uploadTask.on("state_changed",(snapshot)=>{
                    const progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
                    console.log("upload is" + progress + "% done")
                    switch(snapshot.state){
                        case "paused" :
                            console.log("ulpoad is paused")
                            break;
                        case "running" :
                            console.log("ulpoad is running")
                            break;
                        case "canceled" :
                            console.log("ulpoad is canceled")
                            break;
                    }
                },(error)=>{
                    reject(error)
                },()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                        resolve(downloadURL)
                    })
                })
            })
        }
        
        const imgUrls = await Promise.all(
            [...images].map((image)=> storeImage(image))).catch((error)=>{
                setLoading(false)
                toast.error("Images not uploaded!")
                console.log(error.message)
                return;
            });
            
        const formDataCopy = {
            ...formData,
            imgUrls,
            geoLocation,
            timestamp : serverTimestamp(),
            userRef : auth.currentUser.uid,
        }
        delete formDataCopy.images;
        !formDataCopy.discount && delete formDataCopy.discountedPrice;

        const docRef = await addDoc(collection(db,"listings"), formDataCopy);
        // const docRef = doc(db,"listings",auth.currentUser.uid)
        // await setDoc(docRef,formDataCopy);
        setLoading(false);
        toast.success("Listing created");
        navigate(`/category/${formDataCopy.type}/${docRef.id}`)

        
    }

    if(loading) return <Spinner></Spinner>

    return (
        <main className='mx-auto px-2 max-w-md pb-20'>
            <h1 className='text-3xl text-center mt-6 font-bold'>Create Listing</h1>

            <form action="" onSubmit={onSubmit}>
                <p className='text-lg mt-6 mb-1'>Select type of listing:</p>
                <div className='flex justify-center items-center gap-3'>
                    <button type='button' id='type' value={"sale"} onClick={onChange} className={`px-7 py-2 font-medium text-base uppercase shadow-md rounded-lg hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${type === "rent" ? "bg-white text-black" : 'bg-slate-500 text-white'}`}>Sell</button>

                    <button type='button' id='type' value={"rent"} onClick={onChange} className={`px-7 py-2 font-medium text-base uppercase shadow-md rounded-lg hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${type === "sale" ? "bg-white text-black" : 'bg-slate-500 text-white'}`}>Rent</button>
                </div>

                <p className='text-lg mt-6 mb-1' >Name:</p>
                <input type="text" id='name' value={name} onChange={onChange} placeholder='Enter property name' minLength={10} maxLength={50} required className='w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded-lg transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600' />

                <div className='flex justify-between'>
                    <div>
                        <p className='text-lg mt-6 mb-1'>Bedrooms</p>
                        <input type="number" id='bedrooms' value={bedrooms} onChange={onChange} min={1} max={20} required className='px-4 py-2 text-lg text-gray-700  bg-white border border-gray-300 rounded-lg transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600' />
                    </div>

                    <div>
                        <p className='text-lg mt-6 mb-1'>Bathrooms</p>
                        <input type="number" id='bathrooms' value={bathrooms} onChange={onChange} min={1} max={20} required className='px-4 py-2 text-lg text-gray-700  bg-white border border-gray-300 rounded-lg transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600' />
                    </div>

                    <div>
                        <p className='text-lg mt-6 mb-1'>Kitchens</p>
                        <input type="number" id='kitchens' value={kitchens} onChange={onChange} min={1} max={5} required className='px-4 py-2 text-lg text-gray-700  bg-white border border-gray-300 rounded-lg transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600' />
                    </div>
                </div>


                <p className='text-lg mt-6 mb-1'>Parking facility?</p>
                <div className='flex justify-center items-center gap-3'>
                    <button type='button' id='parking' value={true} onClick={onChange} className={`px-7 py-2 font-medium text-base uppercase shadow-md rounded-lg hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${parking === false ? "bg-white text-black" : 'bg-slate-500 text-white'}`}>Yes</button>

                    <button type='button' id='parking' value={false} onClick={onChange} className={`px-7 py-2 font-medium text-base uppercase shadow-md rounded-lg hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${parking === true ? "bg-white text-black" : 'bg-slate-500 text-white'}`}>No</button>
                </div>

                <p className='text-lg mt-6 mb-1'>Furnished?</p>
                <div className='flex justify-center items-center gap-3'>
                    <button type='button' id='furnished' value={true} onClick={onChange} className={`px-7 py-2 font-medium text-base uppercase shadow-md rounded-lg hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${furnished === false ? "bg-white text-black" : 'bg-slate-500 text-white'}`}>Yes</button>

                    <button type='button' id='furnished' value={false} onClick={onChange} className={`px-7 py-2 font-medium text-base uppercase shadow-md rounded-lg hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${furnished === true ? "bg-white text-black" : 'bg-slate-500 text-white'}`}>No</button>
                </div>

                <p className='text-lg mt-6 mb-1' >Address:</p>
                <textarea type="textarea" id='address' value={address} onChange={onChange} rows={3} placeholder='Enter Address of the property' required className='w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded-lg transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600' />

                {!geoLocationEnabled && (
                    <div className='w-full flex justify-between items-center'>
                        <div className='w-[45%]'>
                            <p className='text-lg mt-6 mb-1' >Latitude (in °):</p>
                            <input type="number" id='latitude' value={latitude} onChange={onChange} min={-90} max={90} step={"any"} placeholder='Enter pin code' required className='w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded-lg transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600' />
                        </div>
                        <div className='w-[45%]'>
                            <p className='text-lg mt-6 mb-1' >Longitude (in °):</p>
                            <input type="number" id='longitude' value={longitude} onChange={onChange} step={"any"}  min={-180} max={180} placeholder='Enter pin code' required className='w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded-lg transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600' />
                        </div>
                    </div>
                )}


                <p className='text-lg mt-6 mb-1' >City:</p>
                <input type="text" id='city' value={city} onChange={onChange} placeholder='City' required className='w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded-lg transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600' />


                <p className='text-lg mt-6 mb-1' >State:</p>
                <input type="text" id='state' value={state} onChange={onChange} placeholder='State' required className='w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded-lg transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600' />


                <p className='text-lg mt-6 mb-1' >Pin code:</p>
                <input type="number" id='pin' value={pin} onChange={onChange} min={100000} max={999999} placeholder='Enter pin code' required className='w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded-lg transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600' />

                <p className='text-lg mt-6 mb-1' >Description:</p>
                <textarea type="text" id='description' value={description} onChange={onChange} placeholder='Description for the property' required className='w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded-lg transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600' />


                <p className='text-lg mt-6 mb-1'>Discount?</p>
                <div className='flex justify-center items-center gap-3'>
                    <button type='button' id='discount' value={true} onClick={onChange} className={`px-7 py-2 font-medium text-base uppercase shadow-md rounded-lg hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${discount === false ? "bg-white text-black" : 'bg-slate-500 text-white'}`}>Yes</button>

                    <button type='button' id='discount' value={false} onClick={onChange} className={`px-7 py-2 font-medium text-base uppercase shadow-md rounded-lg hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${discount === true ? "bg-white text-black" : 'bg-slate-500 text-white'}`}>No</button>
                </div>

                <div>
                    <p className='text-lg mt-6 mb-1'>Regular Price:</p>
                    <div className='flex justify-centre w-full gap-4'>
                        <input type="number" id='regularPrice' value={regularPrice} onChange={onChange} min={2000} max={20000000000} required className='w-[50%] px-4 py-2 text-lg text-gray-700  bg-white border border-gray-300 rounded-lg transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600' />

                        {type === 'rent' && (
                            <div className='flex items-center justify-start'>
                                <p className='text-base w-full whitespace-nowrap '>₹ / month</p>
                            </div>
                        )}
                        {type === 'sale' && (
                            <div className='flex items-center justify-start'>
                                <p className='text-base w-full whitespace-nowrap '>₹</p>
                            </div>
                        )}
                    </div>
                </div>

                {discount && (
                    <div>
                        <p className='text-lg mt-6 mb-1'>Discounted Price:</p>
                        <div className='flex justify-centre w-full gap-4'>
                            <input type="number" id='discountedPrice' value={discountedPrice} onChange={onChange} min={2000} max={20000000000} required className='w-[50%] px-4 py-2 text-lg text-gray-700  bg-white border border-gray-300 rounded-lg transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600' />

                            {type === 'rent' && (
                                <div className='flex items-center justify-start'>
                                    <p className='text-base w-full whitespace-nowrap '>₹ / month</p>
                                </div>
                            )}
                            {type === 'sale' && (
                                <div className='flex items-center justify-start'>
                                    <p className='text-base w-full whitespace-nowrap '>₹</p>
                                </div>
                            )}
                        </div>
                    </div>)}

                <p className='text-lg mt-6 mb-1 font-medium' >Images</p>
                <p className='text-sm mb-1'>* The first image will be the cover (max 6)</p>
                <input type="file" id="images" accept='.jpg,.png,.jpeg' onChange={onChange} multiple required className='w-full px-3 py-1 text-gray-700 bg-white border border-gray-300 transition duration-150 ease-in-out rounded-lg cursor-pointer' />

                <button type='submit' className="w-full mt-6 uppercase flex justify-center items-center mx-auto text-white bg-blue-600 border-0 py-2 px-8 focus:outline-none hover:bg-blue-700 rounded text-base shadow-md focus:shadow-lg transition duration-150 ease-in-out">Create listing</button>


            </form>
        </main>
    )
}

export default CreateListing
