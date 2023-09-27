import React, { useEffect, useState } from 'react'
import { useParams } from "react-router";
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"
import Spinner from "../components/Spinner"
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from "swiper"
import { Pagination, Autoplay, Navigation, EffectFade } from 'swiper/modules';
import "swiper/css/bundle"
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { FaShare, FaMapMarkerAlt, FaBed, FaBath } from "react-icons/fa"
import { GiChickenOven } from "react-icons/gi"
import { BsFillCarFrontFill } from "react-icons/bs"
import { MdOutlineChair } from "react-icons/md"
import { toast } from 'react-toastify';
import { getAuth } from 'firebase/auth';
import Contact from '../components/Contact';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
// import { MapContainer, TileLayer, useMap } from 'react-leaflet'


export default function Listing() {

  const auth = getAuth()
  const params = useParams()
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [contactLandlord, setContactLandlord] = useState(false)
  
  SwiperCore.use([Autoplay, Navigation, Pagination])

  useEffect(() => {
    async function fetchListing() {
      const docref = doc(db, "listings", params.listingId)
      const docSnap = await getDoc(docref)
      // console.log(docSnap.data())
      if (docSnap.exists()) {
        setListings(docSnap.data())
        setLoading(false)
      }
    }
    fetchListing()
    // console.log(listings)
  }, [])

  if (loading) return <Spinner></Spinner>

  return (
    <main>
      {/* <Swiper slidesPerView={1} navigation pagination={{type: "progressbar"}} effect='fade' modules={[EffectFade]} autoplay={{delay: 3000}}>
        {listings.imgUrls.map((url,index)=>(
          <SwiperSlide key={index}>
            <div className='relative w-full overflow-hidden h-[300px]' style={{background: `url(${url})`, backgroundSize: "cover"}}></div>
          </SwiperSlide>
        ))}
      </Swiper> */}
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={false}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper h-[400px]"
      >
        {listings.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div className='relative w-full h-[350px] overflow-hidden' style={{
              background: `url(${url}) center no-repeat`,
              backgroundSize: "cover"
            }}>
              {/* <img src={url} alt="" className='object-cover'/> */}
            </div>
          </SwiperSlide>

        ))}
      </Swiper>
      <div className='fixed top-[13%] right-[3%] z-20 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-10 h-10 flex justify-center items-center' onClick={() => {
        navigator.clipboard.writeText(window.location.href)
        toast.success("link copied to clipboard!")
      }}>
        <FaShare className='text-lg font-light text-slate-500' />
      </div>

      <div className='m-4 flex min-[1264px]:flex-row flex-col md:w-[95%] lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:gap-5'>

        <div className='w-full pb-8 px-3 pt-2'>
          <p className='text-2xl font-bold mb-3 text-blue-900'>{listings.name} - ₹ {listings.discount ? listings.discountedPrice.toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",") : listings.regularPrice.toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {listings.type === "rent" && "/ Month"}</p>

          <p className='flex items-center mb-3 font-semibold'><FaMapMarkerAlt className='text-green-700 mr-1' />{listings.address}</p>

          <div className='flex justify-start items-center gap-4 w-[75%]'>
            <p className='bg-slate-800 w-full max-w-[200px] rounded-md p-1.5 text-white text-center font-medium shadow-md'>{listings.type === "sale" ? "Sale" : "Rent"}</p>
            {/* {listings.discount && (
                <p>₹ {listings.regularPrice-listings.discountedPrice} discount</p>
              )} */}
            {listings.discount && (
              <p className='bg-green-600 w-full max-w-[200px] rounded-md p-1.5 text-white text-center font-medium shadow-md'>{Math.floor((listings.regularPrice - listings.discountedPrice) / listings.regularPrice * 100)}% off</p>
            )}
          </div>
          <p className='mt-3 mb-3'>
            <span className='font-semibold'>Description - </span>
            {listings.description}
          </p>

          <ul className='flex justify-between items-center mb-6'>
            <li className='flex items-center whitespace-nowrap'><FaBed className="mr-1" />{+listings.bedrooms > 1 ? `${listings.bedrooms} beds` : "1 Bed"}</li>

            <li className='flex items-center whitespace-nowrap'><FaBath className="mr-1" />{+listings.bedrooms > 1 ? `${listings.bathrooms} baths` : "1 Bath"}</li>

            <li className='flex items-center whitespace-nowrap'><GiChickenOven className="mr-1" />{+listings.kitchens > 1 ? `${listings.kitchens} beds` : "1 kitchen"}</li>

            <li className={`flex items-center whitespace-nowrap ${listings.parking ? "text-green-700" : "text-red-700"}`}><BsFillCarFrontFill className="mr-1" />{listings.parking ? `Parking available` : "No parking"}</li>

            <li className={`flex items-center whitespace-nowrap ${listings.furnished ? "text-green-700" : "text-red-700"}`}><MdOutlineChair className="mr-1" />{listings.furnished ? `Furnished` : "Not furnished"}</li>
          </ul>

          {/* the ? is so that the currentUser can load and then that will be showed.. better than th eloader for a single element to use loader*/}
          {listings.userRef!==auth.currentUser?.uid && !contactLandlord && (
            <div className='mt-6'>
              <button className='px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded-md shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg w-full text-center transition duration-150 ease-in-out' onClick={()=> setContactLandlord(!contactLandlord)}>Contact the owner</button>
            </div>
          )}

          {contactLandlord && (
            <Contact lisitng={listings}/>
          )}

        </div>

        <div className='w-full h-[200px] lg:h-[400px] z-10 overflow-x-hidden'>
          <MapContainer center={[listings.geoLocation.lat,listings.geoLocation.lng]} zoom={13} scrollWheelZoom={false}
          style={{height: "100%", width: "100%"}}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[listings.geoLocation.lat,listings.geoLocation.lng]}>
              <Popup>
                {listings.address}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </main>
  )
}
