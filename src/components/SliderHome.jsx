import React, { useEffect, useState } from 'react'
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore"
import { db } from "../firebase"
import Spinner from '../components/Spinner'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from "swiper"
import { Pagination, Autoplay, Navigation, EffectFade } from 'swiper/modules';
import "swiper/css/bundle"
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useNavigate } from 'react-router';


const SliderHome = () => {

  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(false)
  SwiperCore.use([Autoplay, Navigation, Pagination])
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchListings(){
      // setLoading(true)
      const listingsRef = collection(db,"listings")
      const q = query(listingsRef, orderBy("timestamp" , "desc"),limit(5));

      const querySnap = await getDocs(q);
      let listingArr = [];
      querySnap.forEach((doc)=>{
        return listingArr.push({
          id: doc.id,
          data : doc.data(),
        })
      })
      setListings(listingArr)
      setLoading(false)
    }
    fetchListings()
  }, [])

  if(loading) return <Spinner></Spinner>
  if(listings.length ===0) return <></>
  return listings && (
    <>  
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
        {listings.map((lisitng) => (
          <SwiperSlide key={lisitng.id} onClick={()=> navigate(`/category/${lisitng.data.type}/${lisitng.id}`)}>
            <div className='relative w-full h-[350px] overflow-hidden cursor-pointer' style={{
              background: `url(${lisitng.data.imgUrls[0]}) center no-repeat`,
              backgroundSize: "cover"
            }}>
              {/* <h1>{data.imgUrls}</h1> */}
            </div>
            <p className='text-white absolute left-2 top-3 font-medium max-w-[90%] bg-[#478db8] shadow-lg opacity-90 p-2 pr-3 rounded-br-3xl'>{lisitng.data.name}</p>

            <p className='text-white absolute left-2 bottom-16 font-medium max-w-[90%] bg-[#e63946] shadow-lg opacity-90 p-2 pr-3 rounded-tr-3xl'>₹ {lisitng.data.discount ? lisitng.data.discountedPrice.toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",") : lisitng.data.regularPrice.toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{lisitng.data.type === "rent" && " / month"}</p>
          </SwiperSlide>

        ))}
      </Swiper>
    </>
  )
}

export default SliderHome
